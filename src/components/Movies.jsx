import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';

const Movie = () => {

  const { movieId } = useParams()
  const [movie, setMovie] = useState({})

  const [formData, setFormData] = useState({
    text: '',
    ratings: '',
  })
  
  function handleChange(e) {
    const newFormData = structuredClone(formData)
    newFormData[e.target.name] = e.target.value
    setFormData(newFormData)
  }
  
  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const { data } = await axios.post(`http://localhost:8000/api/reviews`, formData)
      const token = data.token

      localStorage.setItem('token', token)
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

  return <div className="section">
  <div className="container">
    <img src={movie.poster}/>
    <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Your Review</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name={'email'}
              onChange={handleChange}
              value={formData.email}
            />
          </div>
        </div>
    </form>
  </div>
</div>
}

export default Movie