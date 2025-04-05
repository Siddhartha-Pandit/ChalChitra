import React, { useState, useEffect } from 'react'
import { Formik, Form } from "formik"
import * as yup from "yup"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { ActorService } from '../../services/actorService'
import { CityService } from '../../services/cityService'
import { CategoryService } from '../../services/categoryService'
import { DirectorService } from '../../services/directorService'
import { MovieService } from '../../services/movieService'

import KaanKaplanSelect from '../../utils/customFormItems/KaanKaplanSelect'
import KaanKaplanTextInput from '../../utils/customFormItems/KaanKaplanTextInput'
import KaanKaplanTextArea from '../../utils/customFormItems/KaanKaplanTextArea'
import KaanKaplanCheckBox from '../../utils/customFormItems/KaanKaplanCheckBox'

export default function AddMoviePage() {
  const userFromRedux = useSelector(state => state.user.payload)
  const navigate = useNavigate()

  const actorService = new ActorService()
  const cityService = new CityService()
  const categoryService = new CategoryService()
  const directorService = new DirectorService()
  const movieService = new MovieService()

  const [actors, setActors] = useState([])
  const [cities, setCities] = useState([])
  const [categories, setCategories] = useState([])
  const [directors, setDirectors] = useState([])

  useEffect(() => {
    actorService.getall().then(res => setActors(res.data))
    cityService.getall().then(res => setCities(res.data))
    categoryService.getall().then(res => setCategories(res.data))
    directorService.getall().then(res => setDirectors(res.data))
  }, [])

  const initValues = {
    movieName: '',
    description: '',
    duration: '',
    releaseDate: '',
    trailerUrl: '',
    categoryId: '',
    directorId: '',
    directorName: '',
    isInVision: false
  }

  const validationSchema = yup.object({
    movieName: yup.string().required('Required'),
    description: yup.string().required('Required'),
    duration: yup.number().required('Required'),
    releaseDate: yup.date().required('Required'),
    trailerUrl: yup.string().url('Invalid URL').required('Required'),
    categoryId: yup.string().required('Required')
    // you can add more validations as needed
  })

  return (
    <div>
      <div className='mt-5 p-5 container' style={{ height: "100vh" }}>
        <h2 className='mt-4'>Add Movie</h2>
        <hr />

        <h5 className='my-4'>
          Fill in all the movie details and then proceed to select the cast.
        </h5>

        <Formik
          initialValues={initValues}
          validationSchema={validationSchema}
          onSubmit={values => {
            values.userAccessToken = userFromRedux.token

            const createAndAddMovie = directorId => {
              values.directorId = directorId
              movieService.addMovie(values).then(result => {
                if (result.data) {
                  navigate(`/addMovie/${result.data.movieId}`)
                }
              })
            }

            if (!values.directorId) {
              // If no existing director selected, create one first
              directorService.add({
                directorName: values.directorName,
                token: userFromRedux.token
              }).then(res => {
                createAndAddMovie(res.data.directorId)
              })
            } else {
              // Use existing director
              createAndAddMovie(values.directorId)
            }
          }}
        >
          <Form>
            {/* Movie Name */}
            <div className="form-floating mb-3">
              <KaanKaplanTextInput
                type="text"
                name="movieName"
                className="form-control"
                id="movieName"
                placeholder="Movie Title"
              />
              <label htmlFor="movieName">Movie Title</label>
            </div>

            {/* Description */}
            <div className="form-floating mb-3">
              <KaanKaplanTextArea
                name="description"
                className="form-control"
                id="description"
                placeholder="Synopsis"
              />
              <label htmlFor="description">Synopsis</label>
            </div>

            {/* Duration */}
            <div className="form-floating mb-3">
              <KaanKaplanTextInput
                name="duration"
                type="number"
                className="form-control"
                id="duration"
                placeholder="Duration (minutes)"
              />
              <label htmlFor="duration">Duration (minutes)</label>
            </div>

            {/* Release Date */}
            <div className="form-floating mb-3">
              <KaanKaplanTextInput
                name="releaseDate"
                type="date"
                className="form-control"
                id="releaseDate"
                placeholder="Release Date"
              />
              <label htmlFor="releaseDate">Release Date</label>
            </div>

            {/* Trailer URL */}
            <div className="form-floating mb-3">
              <KaanKaplanTextInput
                name="trailerUrl"
                type="text"
                className="form-control"
                id="trailerUrl"
                placeholder="Trailer URL"
              />
              <label htmlFor="trailerUrl">Trailer URL</label>
            </div>

            {/* Category */}
            <div className="form-floating mb-3">
              <KaanKaplanSelect
                id="categoryId"
                className="form-select form-select-lg mb-3"
                name="categoryId"
                options={categories.map(cat => ({
                  key: cat.categoryId,
                  text: cat.categoryName,
                  value: cat.categoryName
                }))}
              />
              <label htmlFor="categoryId">Category</label>
            </div>

            {/* Director */}
            <div className="form-floating mb-3">
              <KaanKaplanSelect
                id="directorId"
                className="form-select form-select-lg mb-3"
                name="directorId"
                options={directors.map(dir => ({
                  key: dir.directorId,
                  text: dir.directorName,
                  value: dir.directorName
                }))}
              />
              <label htmlFor="directorId">Director</label>
            </div>
            <p>If the director isn’t listed above, please type their name below.</p>
            <div className="form-floating mb-3">
              <KaanKaplanTextInput
                name="directorName"
                type="text"
                className="form-control"
                id="directorName"
                placeholder="Director Name"
              />
              <label htmlFor="directorName">Director Name</label>
            </div>

            {/* In Vision Checkbox */}
            <div className="form-check mb-3 text-start">
              <KaanKaplanCheckBox
                name="isInVision"
                className="form-check-input"
                type="checkbox"
                id="isInVision"
              />
              <label className="form-check-label" htmlFor="isInVision">
                Currently in Theaters?
              </label>
            </div>

            {/* Submit */}
            <div className="d-grid gap-2 my-4 col-6 mx-auto">
              <input
                type="submit"
                value="Next"
                className="btn btn-block btn-primary"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  )
}
