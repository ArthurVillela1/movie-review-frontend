import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

const Movie = () => {

    const { movieId } = useParams()
    const [movie, setMovie] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userPosted, setUserPosted] = useState(false)


    const [formData, setFormData] = useState({
        text: '',
        ratings: '',
        movie: Number(movieId),
    })

    function handleChange(e) {
        const newFormData = structuredClone(formData)
        newFormData[e.target.name] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (formData.review === '' || formData.ratings === '') {
            toast.error('Fill in ratings and reviews to post')
        } else if (formData.text.length > 60) {
            toast.error('Reviews must be under 60 characters');
        } else if (formData.ratings > 10 || formData.ratings < 0) {
            toast.error('Ratings must be between 0 and 10');
        } else {
            try {
                const { data } = await axios.post(`http://localhost:8000/api/reviews/`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })

                toast.success('Review posted!');

            } catch (err) {
                toast.error(err.response.data.message);
                console.log(err.response.data)
            }
        }
    }

    useEffect(() => {
        async function fetchMovies() {
            const resp = await fetch(`http://localhost:8000/api/movies/${movieId}`)
            const data = await resp.json()
            setMovie(data)
        }
        fetchMovies()
    }, [movieId])

    return <>
    <div className="container">
        {movie && <>
            <img className="poster" src={movie.poster} alt={`${movie.title} Poster`} />
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
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <div className="control">
                        <label className="label">Your Review</label>
                        <input
                            className="input"
                            type="text"
                            name={'text'}
                            onChange={handleChange}
                            value={formData.text}
                        />
                    </div>
                    <div className="control">
                        <label className="label">Your Rating</label>
                        <input
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