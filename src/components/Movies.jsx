import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Movie = () => {

  const { movieId } = useParams()
  const [movie, setMovie] = useState({})

  useEffect(() => {
    async function fetchMovies() {
      const resp = await fetch(`http://localhost:8000/api/movies/${movieId}`)
      const data = await resp.json()
      setMovie(data)
    }
    fetchMovies()
  }, [movieId])

console.log(movieId)

  return <div className="section">
  <div className="container">
    <img src={movie.poster}/>
  </div>
</div>
}

export default Movie