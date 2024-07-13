import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';


const Movie = () => {

    const { movieId } = useParams()
    const [movie, setMovie] = useState(null)

    const [formData, setFormData] = useState({
        text: '',
        ratings: '',
        movie: Number(movieId),
    })

    const [userReviewed, setUserReviewed] = useState(false);

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing JWT:', error);
            return null;
        }
    }

    function handleChange(e) {
        const newFormData = structuredClone(formData)
        newFormData[e.target.name] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (userReviewed) {
                toast.error('You have already reviewed this movie.');
                return;
            }else{
                if (formData.text === '' || formData.ratings === '') {
                    toast.error('Fill in ratings and reviews to post');
                    return;
                } else if (formData.text.length > 60) {
                    toast.error('Reviews must be under 60 characters');
                    return;
                } else if (formData.ratings > 10 || formData.ratings < 0) {
                    toast.error('Ratings must be between 0 and 10');
                    return;
                }
    
                const response = await axios.post(`http://localhost:8000/api/reviews/`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                toast.success('Review posted!');
            }

        } catch (err) {
            toast.error(err.response.data.message);
            console.error('Error posting review:', err);
        }
    }

    useEffect(() => {
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
        fetchMovieAndCheckReview();
    }, [movieId, parseJwt]);

    return <>
    <div className="container">
        {movie && <>
            <img id="postertoreview" className="poster" src={movie.poster} alt={`${movie.title} Poster`} />
            {movie.reviews && movie.reviews.length > 0 && (
            <div className="reviews">
                {movie.reviews.slice(-8).reverse().map((review) => {
                    return <div key={review.id}>
                        <ul className='reviewslist'>
                            <li className='review-item'>
                                <p><b>{review.owner.username}</b> {review.ratings} {review.text}</p>
                            </li>
                        </ul>
                    </div>
                })}
            </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <div className="control">
                        <label className="label">Review</label>
                        <input
                            id='reviewbox'
                            className="input"
                            type="text"
                            name={'text'}
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
                            name={'ratings'}
                            onChange={handleChange}
                            value={formData.ratings}
                        />
                    </div>
                </div>
                <button className="postReviewButton">Post</button>
            </form>
        </>}
    </div>
</>
}

export default Movie