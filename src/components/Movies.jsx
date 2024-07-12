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

    function handleChange(e) {
        const newFormData = structuredClone(formData)
        newFormData[e.target.name] = e.target.value
        setFormData(newFormData)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        console.log(formData)
        try {
            const { data } = await axios.post(`http://localhost:8000/api/reviews/`, formData, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            toast.success('Review posted!');

        } catch (err) {
            toast.error(err.response.data.message);
            console.log(err.response.data)
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

    console.log(movie)

    return <>
        <div className="container">
            {movie && <>
                {movie.reviews.map((review) => {
                return <div className="review box" key={review.id}>
                    <ul key={review.id} className='reviewlist'>
                        <li className='review-item'>
                            <p>{review.text}</p>
                        </li>
                    </ul>
                </div>
  })}
            <img src={movie.poster} />
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Your Review</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            name={'text'}
                            onChange={handleChange}
                            value={formData.text}
                        />
                        <button className="postReviewButton">Post Review</button>
                    </div>
                </div>
            </form>
            </>}
        </div>
    </>
}

export default Movie