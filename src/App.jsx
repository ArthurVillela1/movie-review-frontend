import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'


//import Home from './components/Home'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
//import Movie from './components/Movie'

const App = () => {
  return <Router>
    <Navbar />
    < ToastContainer />
    <Routes>
      {/* {<Route path="/" element={<Home />} />} */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/movie" element={<Movie />} /> */}
    </Routes>
  </Router>
}

export default App
