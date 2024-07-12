import React, { useEffect, useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

  const Home = () => {

    const navigate = useNavigate()
    const [movies, setMovies] = useState([])
    
    
    useEffect(() => {
      const fetchMovies = async () => {
        try{
          const response = await axios.get(`http://localhost:8000/api/movies`)
          setMovies(response.data)
        }catch(err){
          console.log('Did not fetch')
        }
      }
      fetchMovies()
    },[])

    return <>
    <div className='container-movies'>
      {movies.map((movie, index) => {
        return <div className="center-of-poster" key={movie.id}>
          <ul key={movie.id} className='movie-list'>
          <li className='movie-item'>
          <img className="poster" src={movie.poster} />
          <Link to={`/movies/${movie.id}`}>
                    <div className="review"></div>
          </Link>
          </li>
          </ul>
        </div>
      })}
    </div>
    </>
}
  export default Home