import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';

const Home = () => {

  const [movies, setMovies] = useState([])
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'))

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token'))
  }, [location])


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/movies`)
        setMovies(response.data)
      } catch (err) {
        console.log('Did not fetch')
      }
    }
    fetchMovies()
  }, [])

  function handleUser() {
    toast.error('Log in to post reviews and ratings')
  }

  return <>
    <h1 class="title1">Welcome to Fresh Tomatoes 🍅</h1>
    <h2 class="title1">Rate, Review, and Discover Your Next Favorite Movie!</h2>
    <div className='container-movies'>
      {movies.map((movie, index) => {
        return <div className="posters" key={movie.id}>
          <ul key={movie.id} className='movie-list'>
            <li className='movie-item'>
              <img className="poster" src={movie.poster} />
              {isLoggedIn ? (
                <Link to={`/movies/${movie.id}`}>
                  <div className="review"></div>
                </Link>
              ) : (
                <div onClick={() => { handleUser() }} className="review"></div>
              )}
            </li>
          </ul>
        </div>
      })}
    </div>
  </>
}
export default Home