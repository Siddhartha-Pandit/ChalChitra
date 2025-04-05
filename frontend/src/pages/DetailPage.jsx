import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper"
import { ActorService } from '../services/actorService'
import { CityService } from '../services/cityService'
import { MovieService } from '../services/movieService'
import dateConvert from '../utils/dateConverter'
import dateConvertForTicket from '../utils/dateConvertForTicket'
import { SaloonTimeService } from '../services/saloonTimeService'
import { useDispatch, useSelector } from 'react-redux'
import { addMovieToState, cleanState } from '../store/actions/movieActions'
import { CommentService } from '../services/commentService'
import { toast, ToastContainer } from 'react-toastify'

export default function DetailPage() {
  let { movieId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userFromRedux = useSelector(state => state.user.payload)

  const today = new Date()

  const movieService = new MovieService()
  const cityService = new CityService()
  const actorService = new ActorService()
  const saloonTimeService = new SaloonTimeService()
  const commentService = new CommentService()

  const [movie, setMovie] = useState({})
  const [actors, setActors] = useState([])
  const [otherMovies, setOtherMovies] = useState([])
  const [cinemaSaloons, setCinemaSaloons] = useState([])
  const [selectedCity, setSelectedCity] = useState({})
  const [selectedSaloon, setSelectedSaloon] = useState(null)
  const [saloonTimes, setSaloonTimes] = useState([])
  const [selectedDay, setSelectedDay] = useState(dateConvert(today))
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [countOfComments, setCountOfComments] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadMovieDetails(movieId)
  }, [movieId])

  function loadMovieDetails(id) {
    movieService.getMovieById(id).then(res => setMovie(res.data))
    actorService.getActorsByMovieId(id).then(res => setActors(res.data))
    cityService.getCitiesByMovieId(id).then(res => setCinemaSaloons(res.data))
    movieService.getAllDisplayingMovies().then(res => {
      setOtherMovies(res.data.filter(m => m.movieId !== id))
    })
    commentService.getCountOfComments(id).then(res => setCountOfComments(res.data))
    loadComments(id, 1)
  }

  function loadSaloonTimes(saloonId, movieId) {
    saloonTimeService
      .getMovieSaloonTimeSaloonAndMovieId(saloonId, movieId)
      .then(res => setSaloonTimes(res.data))
  }

  function loadComments(id, page, pageSize = 5) {
    commentService.getCommentsByMovieId(id, page, pageSize).then(res => {
      if (comments.length > 0 && page > 1) {
        setComments([...comments, ...res.data])
      } else {
        setComments(res.data)
      }
    })
  }

  function proceedToPurchase(time) {
    dispatch(cleanState())
    const dto = {
      id: movie.movieId,
      movieName: movie.movieName,
      imageUrl: movie.movieImageUrl,
      saloonId: selectedSaloon.saloonId,
      saloonName: selectedSaloon.saloonName,
      movieDay: selectedDay,
      movieTime: time
    }
    dispatch(addMovieToState(dto))
    navigate("buyTicket")
  }

  function submitComment() {
    if (!userFromRedux) {
      toast.error("Please log in to leave a comment!", {
        theme: "light",
        position: "top-center"
      })
      return
    }
    if (commentText.trim().length === 0) {
      toast.warning("Comment cannot be empty!", {
        theme: "light",
        position: "top-center"
      })
      return
    }

    const dto = {
      commentByUserId: userFromRedux.userId,
      commentText,
      commentBy: userFromRedux.fullName,
      token: userFromRedux.token,
      movieId
    }
    commentService.addComment(dto).then(res => {
      if (res.status === 200) {
        document.querySelector("#commentArea").value = ""
        setComments([...comments, res.data])
        toast.success("Your comment has been added!", {
          theme: "light",
          position: "top-center"
        })
      }
    })
  }

  function removeComment(commentId) {
    const dto = { commentId, token: userFromRedux.token }
    commentService.deleteComment(dto).then(res => {
      if (res.status === 200) {
        setComments(comments.filter(c => c.commentId !== commentId))
      }
    })
  }

  return (
    <div>
      {/* Header Section */}
      <section id="entry-section" className='detail-bg pt-5'>
        <div className='container mt-5'>
          <div className='row gx-0 pt-2 justify-content-center align-items-start'>
            <div className='col-sm-12 col-md-6 text-center mb-4'>
              <img className='img-thumbnail w-50' src={movie?.movieImageUrl} alt={movie?.movieName} />
            </div>
            <div className='col-sm-12 col-md-6 text-start text-light'>
              <h3>{movie?.movieName}</h3>
              <hr />
              <h5>Director: {movie?.directorName}</h5>
              <h5>
                Actors:{" "}
                {actors.map(a => a.actorName).join(", ")}
              </h5>
              <div className="row gy-1 justify-content-start align-items-end mt-5">
                <div className='col-sm-4'>
                  <button
                    className="detail-page-btn btn btn-light btn-lg w-100"
                    onClick={() =>
                      document
                        .querySelector("#ticketBuy")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <strong>Buy Ticket</strong>
                  </button>
                </div>
                <div className='col-sm-4'>
                  <button
                    className="detail-page-btn btn btn-light btn-lg w-100"
                    onClick={() =>
                      document
                        .querySelector("#commentSection")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <strong>Write a Comment</strong>
                  </button>
                </div>
                <div className='col-sm-4'>
                  <button
                    className="detail-page-btn btn btn-light btn-lg w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#movieTrailerModal"
                  >
                    <strong>Trailer</strong>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* background blur via ::after */}
      <style dangerouslySetInnerHTML={{
        __html: [
          '.detail-bg:after {',
          '  content: "";',
          '  position: absolute;',
          '  z-index: -1;',
          '  inset: 0;',
          `  background-image: url(${movie?.movieImageUrl});`,
          '  background-repeat: no-repeat;',
          '  background-size: cover;',
          '  background-position: top center;',
          '  opacity: 0.8;',
          '  -webkit-filter: blur(8px) saturate(1);',
          '}'
        ].join('\n')
      }} />

      {/* Movie Info */}
      <section className='p-5'>
        <div className='container'>
          <div className='row justify-content-between ms-0 ms-md-5 ps-0 ps-md-5'>
            <div className='col-sm-4 text-start'>
              <p><strong>Release Date:</strong> {dateConvert(movie.releaseDate)}</p>
              <p><strong>Duration:</strong> {movie.duration} minutes</p>
              <p><strong>Genre:</strong> {movie.categoryName}</p>
            </div>
            <div className='col-sm-8 text-start'>
              <p><strong>Plot:</strong> {movie.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buy Ticket Trigger */}
      <section id="ticketBuy" className='pt-1 pb-3'>
        <div className='container bg-primary rounded'>
          <div className='row p-5'>
            <div className='col-sm-4 text-sm-start text-md-end text-light'>
              <h2>Buy Ticket</h2>
            </div>
            <div className='col-sm-8 ps-3'>
              <button
                className="select-saloon-button btn btn-primary w-100"
                data-bs-toggle="modal"
                data-bs-target="#saloonModal"
              >
                <strong>Select Cinema</strong> <i className="fa-solid fa-caret-down" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Details */}
      {selectedSaloon && (
        <section id="ticketDetailSection" className='px-5 py-1 pb-5'>
          <hr />
          <div className='container py-2'>
            <ul className="nav justify-content-center">
              {[0,1,2,3,4,5,6].map(i => (
                <li key={i} className="nav-item">
                  <a
                    className="nav-link active date-converter-ticket"
                    href="#!"
                    onClick={() => setSelectedDay(
                      dateConvert(new Date().setDate(today.getDate() + i))
                    )}
                  >
                    {dateConvertForTicket(new Date().setDate(today.getDate() + i))}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <hr />
          <div className='container bg-primary rounded'>
            <h3 className='text-light p-3'>{selectedSaloon.saloonName}</h3>
          </div>
          <div className='container pb-4'>
            {saloonTimes.map(time => (
              <button
                key={time.movieBeginTime}
                className='saloonTime-btn btn btn-outline-dark mx-2 mt-3'
                onClick={() => proceedToPurchase(time.movieBeginTime)}
              >
                <strong>{time.movieBeginTime}</strong>
              </button>
            ))}
          </div>
          <hr />
        </section>
      )}

      {/* Comments Section */}
      <section id="commentSection" className='pt-5 pb-5 px-2'>
        <div className='container'>
          <div className='row gy-2'>
            <div className='col-sm-12 col-md-6'>
              <h3>Comments</h3>
              <div style={{ height: "200px", overflowY: "scroll" }}>
                {comments.length === 0 && <p className='lead mt-4'>Be the first to comment</p>}
                {comments.map(c => (
                  <div key={c.commentId} className='row align-items-center'>
                    <div className='col-sm-10'>
                      <p className='lead mt-4'>{c.commentText}</p>
                      <p className='small mt-0'>{c.commentBy}</p>
                    </div>
                    {userFromRedux && c.commentByUserId === userFromRedux.userId && (
                      <div className='col-sm-2'>
                        <p className='small mb-0' onClick={() => removeComment(c.commentId)}>
                          <i className="fa-solid fa-xmark" />
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                <hr />
                {currentPage < Math.ceil(countOfComments / 5) && countOfComments > 5 && (
                  <div className='text-center'>
                    <a
                      href="#!"
                      className='lead mt-4'
                      onClick={() => {
                        loadComments(movieId, currentPage + 1)
                        setCurrentPage(currentPage + 1)
                      }}
                    >
                      Show more
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className='col-sm-12 col-md-6'>
              <h3>Write a Comment</h3>
              <textarea
                id="commentArea"
                className='form-control mb-3'
                placeholder='Your comment'
                onChange={e => setCommentText(e.target.value)}
              />
              <button
                className="comment-btn btn btn-dark btn-lg w-100"
                onClick={submitComment}
              >
                <strong>Submit</strong>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Other Movies Slider */}
      <section className='p-5'>
        <h3 className='text-center mb-4'>Other Now Showing Movies</h3>
        <Swiper
          slidesPerView={5}
          spaceBetween={0}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper movie-slider"
        >
          {otherMovies.map(m => (
            <SwiperSlide key={m.movieId}>
              <div
                className='slider-item'
                onClick={() => {
                  navigate("/movie/" + m.movieId)
                  loadMovieDetails(m.movieId)
                  document.querySelector("#entry-section").scrollIntoView({ behavior: "smooth" })
                }}
              >
                <div className='slider-item-caption d-flex align-items-end justify-content-center h-100 w-100'>
                  <div className="d-flex align-items-center flex-column mb-3" style={{ height: "20rem" }}>
                    <div className="mb-auto pt-5 text-white"><h3>{m.movieName}</h3></div>
                    <div className="p-2 d-grid gap-2">
                      <button
                        className="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                        onClick={() => {
                          navigate("/movie/" + m.movieId)
                          loadMovieDetails(m.movieId)
                        }}
                      >
                        <strong>Comment</strong>
                      </button>
                      <button
                        className="slider-button btn btn-light btn-md rounded d-none d-sm-block"
                        onClick={() => {
                          navigate("/movie/" + m.movieId)
                          loadMovieDetails(m.movieId)
                        }}
                      >
                        <strong>Buy Ticket</strong>
                      </button>
                    </div>
                  </div>
                </div>
                <img src={m.movieImageUrl} className="img-fluid mx-2" alt={m.movieName} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Trailer Modal */}
      <div
        className="modal fade"
        id="movieTrailerModal"
        tabIndex="-1"
        aria-labelledby="movieTrailerLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="movieTrailerLabel">Trailer</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  const player = document.getElementById("videoPlayer").src
                  document.getElementById("videoPlayer").src = player
                }}
              />
            </div>
            <div className="modal-body">
              <iframe
                id="videoPlayer"
                width="100%"
                height="500rem"
                frameBorder="0"
                src={movie.movieTrailerUrl + "?autoplay=0"}
                title="Movie Trailer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Select City Modal */}
      <div
        className="modal fade"
        id="saloonModal"
        tabIndex="-1"
        aria-labelledby="saloonModalLabel"
        aria-hidden="true"
        style={{ height: "50%", overflow: 'auto' }}
      >
        <div className="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="saloonModalLabel">Select City</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {cinemaSaloons.map(s => (
                <a
                  key={s.cityName}
                  className='d-block text-dark text-decoration-none'
                  href="#!"
                  data-bs-target="#saloonModal2"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  onClick={() => setSelectedCity(s)}
                >
                  <h6 className='ps-1'>{s.cityName}</h6>
                  <hr />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Select Saloon Modal */}
      <div
        className="modal fade"
        id="saloonModal2"
        tabIndex="-1"
        aria-labelledby="saloonModal2ToggleLabel2"
        aria-hidden="true"
        style={{ height: "50%", overflow: 'auto' }}
      >
        <div className="modal-dialog modal-sm modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <a
                href="#!"
                className='text-dark text-decoration-none'
                data-bs-target="#saloonModal"
                data-bs-toggle="modal"
                data-bs-dismiss="modal"
              >
                <h5 className="modal-title" id="saloonModal2ToggleLabel2">
                  <i className="fa-sharp fa-solid fa-chevron-left" /> {selectedCity.cityName}
                </h5>
              </a>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {selectedCity.saloon?.map(s => (
                <a
                  key={s.saloonId}
                  className='d-block text-dark text-decoration-none'
                  href="#!"
                  data-bs-target="#saloonModal2"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    setSelectedSaloon(s)
                    loadSaloonTimes(s.saloonId, movieId)
                  }}
                >
                  <h6 className='ps-1'>{s.saloonName}</h6>
                  <hr />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
