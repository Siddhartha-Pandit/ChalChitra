import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import LoginModal from '../pages/LoginModal';
import RegisterModal from '../pages/RegisterModal';
import { MovieService } from '../services/movieService';
import LoggedOut from './LoggedOut';
import LoggedIn from './LoggedIn';

export default function Navbar() {

    const navigate = useNavigate()

    const movieService = new MovieService();

    const [moviesInVision, setMoviesInVision] = useState([])
    const [comingSoonMovies, setComingSoonMovies] = useState([])

    const userFromRedux = useSelector(state => state.user.payload);

    useEffect(() => {
        movieService.getAllDisplayingMovies().then(result => setMoviesInVision(result.data))
        movieService.getAllComingSoonMovies().then(result => setComingSoonMovies(result.data))
    }, [])
    
  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
            <div className="container px-5">
                <Link to={"/"} style={{ textDecoration: "none" }}>
                    <a className="navbar-brand"> CineVision </a>
                </Link> 
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto align-items-center">
                        {userFromRedux?.roles[0] === "ADMIN" ? 
                            <li className="nav-item">
                                <a className="nav-link" href="#!" onClick={() => navigate("/addMovie")}>
                                    Add Movie
                                </a>
                            </li>
                        : null}

                        <li className="nav-item">
                            <a className="nav-link" href="#!"
                               data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
                                Movies
                            </a>
                        </li>
                        
                        { userFromRedux ? <LoggedIn /> : <LoggedOut /> }
                    </ul>
                </div>
            </div>
        </nav>

        {/* Login Modal */}
        <LoginModal />
        <RegisterModal />

        {/* Movies OffCanvas */}
        <div className="offcanvas offcanvas-top off-canvas-movie" tabIndex="-1" id="offcanvasTop" 
            aria-labelledby="offcanvasTopLabel" style={{ offcanvasHeight: "100%" }}>
       
            <div className="offcanvas-body mt-5">
                <div className='container mb-5'>
                    <div className='row justify-content-between align-items-center'>
                        <div className='col-sm-12 col-md-6 text-white text-start'>
                            <div className='row justify-content-center align-items-center'>
                                <div className='col-sm-6'>
                                    <img src={moviesInVision[0]?.movieImageUrl}
                                         className="img-fluid" alt="..."/>
                                </div>
                                <div className='col-sm-6'>
                                    <h3>{moviesInVision[0]?.movieName}</h3>
                                    <p className='last-movie-p'>{moviesInVision[0]?.description}</p>
                                    <a className="slider-button btn btn-light btn-md rounded" data-bs-dismiss="offcanvasTop" aria-label="Close"
                                       onClick={() => navigate("/movie/" + moviesInVision[0]?.movieId)}>
                                        <strong>Buy Ticket</strong>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-12 col-md-6'>
                            <div className='row justify-content-center align-items-start'>
                                <div className='col-sm-7'>
                                    <h3 className='text-start ms-3'>Now Showing</h3>
                                    {/* Only showing the first 5 movies */}
                                    <div className='ms-3 mt-2'>
                                        {moviesInVision.map(movie => (
                                            <p key={movie.movieId} className='nav-movie-p text-start text-decoration-none'
                                               onClick={() => navigate("/movie/" + movie.movieId)}>
                                                {movie.movieName}
                                            </p>
                                        ))}
                                    </div>
                                    <a href='#!' className='text-decoration-none'>
                                        <strong>All</strong>
                                    </a>
                                </div>
                                <div className='col-sm-5'>
                                    <h3 className='text-start ms-3'>Coming Soon</h3>
                                    {/* For loop */}
                                    <div className='ms-3 mt-2'>
                                        {comingSoonMovies.map(movie => (
                                             <p key={movie.movieId} className='nav-movie-p text-start text-decoration-none'
                                                onClick={() => navigate("/movie/" + movie.movieId)}>
                                                {movie.movieName}
                                            </p>
                                        ))}
                                    </div>
                                    <a href='#!' className='text-decoration-none'>
                                        <strong>All</strong>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
        </div>
    </div>
  )
}
