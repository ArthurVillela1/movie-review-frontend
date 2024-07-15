import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Helper function to parse JWT token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

const Movie = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userReviewed, setUserReviewed] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null); // Track which review is being edited
    const [formData, setFormData] = useState({
        text: '',
        ratings: '',
        movie: Number(movieId),
    });

    // Fetch movie data and check if the user has already reviewed it
    async function fetchMovieAndCheckReview() {
        try {
            const response = await axios.get(`http://localhost:8000/api/movies/${movieId}`);
            const movieData = response.data;
            setMovie(movieData);

            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = parseJwt(token);
                if (decodedToken) {
                    const userId = decodedToken.sub;
                    setUserId(userId);
                    const hasReviewed = movieData.reviews.some(review => review.owner.id === userId);
                    setUserReviewed(hasReviewed);
                } else {
                    console.error('Failed to decode JWT token.');
                }
            }
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    }

    useEffect(() => {
        fetchMovieAndCheckReview();
    }, [movieId]);

    // Update form data on change
    function handleChange(e) {
        const newFormData = { ...formData };
        newFormData[e.target.name] = e.target.value;
        setFormData(newFormData);
    }

    // Handle new review submission
    async function handleSubmit(e) {
        e.preventDefault();
    
        try {
            if (formData.text === '' || formData.ratings === '') {
                toast.error('Fill in ratings and reviews to post');
                return;
            } else if (formData.text.length > 55) {
                toast.error('Reviews must be under 55 characters');
                return;
            } else if (formData.ratings > 10 || formData.ratings < 0) {
                toast.error('Ratings must be between 0 and 10');
                return;
            }
    
            // Check if the user has already reviewed the movie
            const hasReviewed = movie.reviews.some(review => review.owner.id === userId);
            if (hasReviewed) {
                toast.error('You have already reviewed this movie.');
                return;
            }
    
            // Proceed with submitting the review
            await axios.post(`http://localhost:8000/api/reviews/`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Review posted!');
            fetchMovieAndCheckReview(); // Reload movie data after submit
        } catch (err) {
            toast.error(err.response.data.message || 'Error posting/reviewing');
            console.error('Error posting/reviewing:', err);
        }
    }

    // Handle review deletion
    async function handleDeleteReview(reviewId) {
        try {
            await axios.delete(`http://localhost:8000/api/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Review deleted!');
            fetchMovieAndCheckReview();
        } catch (err) {
            toast.error('Error deleting review:', err);
            console.error('Error deleting review:', err);
        }
    }

    // Handle review update
    async function handleEditReview(e) {
        e.preventDefault();
    
        try {
            if (!formData.text || !formData.ratings || !formData.movie) {
                toast.error('Please fill in all fields.');
                return;
            }
    
            // Ensure 'owner' is added to formData
            formData.owner = userId; // Assuming userId is correctly set in your component
    
            const response = await axios.put(`http://localhost:8000/api/reviews/${editingReviewId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            toast.success('Review updated!');
            fetchMovieAndCheckReview();  // Refresh the movie data after update
            setEditingReviewId(null);    // Reset editing state after successful edit
        } catch (error) {
            if (error.response) {
                console.error('Error updating review:', error.response.data);
                toast.error('Error updating review: ' + error.response.data.detail);
            } else {
                console.error('Error updating review:', error.message);
                toast.error('Error updating review: ' + error.message);
            }
        }
    }

    // Start editing a review
    const startEditingReview = (review) => {
        setFormData({
            text: review.text,
            ratings: review.ratings,
            movie: Number(movieId),
        });
        setEditingReviewId(review.id); // Set the ID of the review being edited
    };

    return (
        <div className="container">
            {movie && (
                <>
                    <img id="postertoreview" className="poster" src={movie.poster} alt={`${movie.title} Poster`} />
                    <p className="info">Director: {movie.director.name}</p>
                    <p className="info">Genre: {movie.genre.name}</p>
                    <p className="info">Average Rating: <b>{Math.round(movie.average_rating * 10) / 10}</b></p>
                    {movie.reviews && movie.reviews.length > 0 && (
                        <div className="reviews">
                            {movie.reviews.slice(-8).reverse().map((review) => (
                                <div key={review.id}>
                                    <ul className='reviewslist'>
                                        <li className='review-item'>
                                            {review.owner.id === userId ? (
                                                <p>
                                                    <b>{review.owner.username}</b> {review.ratings} {review.text}
                                                    <button onClick={() => startEditingReview(review)}>Edit</button>
                                                    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                                </p>
                                            ) : (
                                                <p><b>{review.owner.username}</b> {review.ratings} {review.text}</p>
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                    <form onSubmit={editingReviewId ? handleEditReview : handleSubmit}>
                        <div className="field">
                            <div className="control">
                                <label className="label">Review</label>
                                <textarea
                                    id='reviewbox'
                                    className="input"
                                    name='text'
                                    onChange={handleChange}
                                    value={formData.text}
                                />
                            </div>
                            <div className="control">
                                <label className="label">Rating</label>
                                <input
                                    id='ratingbox'
                                    className="input"
                                    type="number"
                                    name='ratings'
                                    onChange={handleChange}
                                    value={formData.ratings}
                                />
                            </div>
                        </div>
                        <button className="postReviewButton">{editingReviewId ? 'Update' : 'Post'}</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default Movie;