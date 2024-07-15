import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../config';


const Home = () => {
  const [movies, setMovies] = useState([]);
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token'));
  }, [location]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/movies`);
        setMovies(response.data);
      } catch (err) {
        console.log('Did not fetch');
      }
    };
    fetchMovies();
  }, []);

  function handleUser() {
    toast.error('Log in to post reviews and ratings');
  }

  return (
    <>
      <h1 className="title1">Welcome to <span className="ft">Fresh Tomatoes 🍅</span></h1>
      <h2 className="title1">Rate, Review, and Discover Your Next Favorite Movie!</h2>
      <div className="container-movies">
        {movies.map((movie) => {
          const averageRating = Math.round(movie.average_rating * 10) / 10;
          const ratingEmoji = averageRating >= 5 ? '🍅' : '🦠';
          return (
            <div className="posters" key={movie.id}>
              <ul key={movie.id} className="movie-list">
                <li className="movie-item">
                  <img className="poster" src={movie.poster} alt={`${movie.title} poster`} />
                  <div className="review-container">
                  <p className="rating">{averageRating} {ratingEmoji}</p>
                    {isLoggedIn ? (
                      <Link to={`/movies/${movie.id}`}>
                        <div className="review"></div>
                      </Link>
                    ) : (
                      <div onClick={() => { handleUser() }} className="review"></div>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Home;