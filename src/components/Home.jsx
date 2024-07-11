import React, { useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


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

    const handleSubmit = () => {
        navigate('/movie')
    }

    return (
      <div className='movies-display'>
        {movies.map((movie) => (
            <ul key={movie.id} className='movie-list'>
                <li className='movie-item'>
                    <img className='movie' src={movie.poster}  />
                    <a onClick={() => handleSubmit()}><div className="review"></div></a>
                </li>
            </ul>
              ))}
      </div>
    );
  };

  export default Home