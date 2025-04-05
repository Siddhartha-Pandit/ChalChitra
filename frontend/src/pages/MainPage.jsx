import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper"
import { MovieService } from '../services/movieService'
import { useNavigate } from 'react-router-dom'

export default function MainPage() {
  const movieService = new MovieService()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])

  async function getMovies(isComingSoon) {
    if (isComingSoon) {
      const result = await movieService.getAllComingSoonMovies()
      setMovies(result.data)
    } else {
      const result = await movieService.getAllDisplayingMovies()
      setMovies(result.data)
    }
  }

  useEffect(() => {
    getMovies(false)
  }, [])

  return (
    <div>
      {/* Hero Carousel */}
      <section>
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="false"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            />
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            />
          </div>
          <div className="carousel-inner">
            {/* First slide */}
            <div className="carousel-item active">
              <header className="masthead text-center text-white">
                <div className="masthead-content">
                  <div className="container px-5">
                    <h1 className="masthead-heading mb-0">CineVision</h1>
                    <h2 className="masthead-subheading mb-0">
                      Don’t Miss the Movie Experience with CineVision
                    </h2>
                    <h2 className="mt-3">
                      The newest movies now showing in CineVision Theaters
                    </h2>
                    <a
                      className="btn btn-primary btn-xl rounded-pill mt-5"
                      href="#scroll"
                    >
                      Movies
                    </a>
                  </div>
                </div>
                <div className="bg-circle-1 bg-circle" />
                <div className="bg-circle-2 bg-circle" />
                <div className="bg-circle-3 bg-circle" />
                <div className="bg-circle-4 bg-circle" />
              </header>
            </div>

            {/* Second slide */}
            <div className="topgun-bg carousel-item" />

            {/* Third slide */}
            <div className="assassin-bg carousel-item" />
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Now Showing / Coming Soon Tabs */}
      <section className="py-5">
        <div className="d-flex justify-content-center">
          <ul
            className="nav nav-pills mb-3"
            id="pills-tab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
                onClick={() => getMovies(false)}
              >
                Now Showing
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
                onClick={() => getMovies(true)}
              >
                Coming Soon
              </button>
            </li>
          </ul>
        </div>
      </section>

      {/* Movie Slider */}
      <section className="mb-5">
        <Swiper
          slidesPerView={5}
          spaceBetween={0}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper movie-slider"
        >
          {movies.map(movie => (
            <SwiperSlide key={movie.movieId}>
              <div
                className="slider-item"
                onClick={() => navigate("/movie/" + movie.movieId)}
              >
                <div className="slider-item-caption d-flex align-items-end justify-content-center h-100 w-100">
                  <div
                    className="d-flex align-items-center flex-column mb-3"
                    style={{ height: "20rem" }}
                  >
                    <div className="mb-auto pt-5 text-white">
                      <h3>{movie.movieName}</h3>
                    </div>
                    <div className="p-2 d-grid gap-2">
                      <button
                        className="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                        onClick={() => navigate("/movie/" + movie.movieId)}
                      >
                        <strong>Comment</strong>
                      </button>
                      <button
                        className="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                        onClick={() => navigate("/movie/" + movie.movieId)}
                      >
                        <strong>Buy Ticket</strong>
                      </button>
                    </div>
                  </div>
                </div>
                <img
                  src={movie.movieImageUrl}
                  className="img-fluid mx-2"
                  alt={movie.movieName}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  )
}
