import { Form, Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActorService } from '../../services/actorService';
import { CityService } from '../../services/cityService';
import KaanKaplanSelect from '../../utils/customFormItems/KaanKaplanSelect';
import KaanKaplanTextInput from '../../utils/customFormItems/KaanKaplanTextInput';
import * as yup from "yup";
import { MovieImageService } from '../../services/movieImageService';
import { useSelector } from 'react-redux';

export default function AddActorsAndCityToMovie() {
  let { movieId } = useParams();
  const navigate = useNavigate();
  const userFromRedux = useSelector(state => state.user.payload);

  const cityService = new CityService();
  const actorService = new ActorService();
  const movieImageService = new MovieImageService();

  const [cities, setCities] = useState([]);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    cityService.getall().then(result => {
      const names = [];
      result.data.forEach(el => {
        if (!names.includes(el.cityName)) {
          names.push(el.cityName);
        }
      });
      setCities(names);
    });
    actorService.getall().then(result => {
      const names = [];
      result.data.forEach(el => {
        if (!names.includes(el.actorName)) {
          names.push(el.actorName);
        }
      });
      setActors(names);
    });
  }, []);

  const initValues = {
    actors: [],
    actorName: '',
    imageUrl: '',
    cities: []
  };

  const validationSchema = yup.object({
    // add validations here if needed
  });

  return (
    <div>
      <div className='mt-5 p-5 container' style={{ height: "100vh" }}>
        <h2 className='mt-4'>Add Movie Details</h2>
        <hr />

        <h5 className='my-4'>
          Add the actors and city information for the movie you just added.
        </h5>

        <Formik
          initialValues={initValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            let actorNameList;
            if ((!values.actorName || values.actorName.trim() !== "") && values.actorName) {
              actorNameList = values.actors
                ? [...values.actors, ...values.actorName.split(", ").filter(n => n)]
                : [...values.actorName.split(", ").filter(n => n)];
            } else {
              actorNameList = [...(values.actors || [])];
            }

            const actorDto = {
              movieId,
              actorNameList,
              token: userFromRedux.token
            };
            const cityDto = {
              movieId,
              cityNameList: values.cities,
              token: userFromRedux.token
            };
            const movieImageDto = {
              movieId,
              imageUrl: values.imageUrl,
              token: userFromRedux.token
            };

            actorService.addActor(actorDto);
            movieImageService.addMovieImage(movieImageDto);
            cityService.addCity(cityDto).then(() => navigate("/addMovie"));
          }}
        >
          <Form>
            <div className="mb-3">
              <KaanKaplanSelect
                className="form-select form-select-lg mb-3"
                name="actors"
                multiple
                size={3}
                options={actors.map(name => ({ key: name, text: name, value: name }))}
                placeholder="Select existing actors"
              />
            </div>
            <p>If the actor isn’t listed, please enter names separated by commas.</p>
            <div className="form-floating mb-3">
              <KaanKaplanTextInput
                type="text"
                name="actorName"
                className="form-control"
                id="actorName"
                placeholder="Actor Name"
              />
              <label htmlFor="actorName">Actor Name</label>
            </div>

            <div className="form-floating mb-3">
              <KaanKaplanTextInput
                name="imageUrl"
                type="text"
                className="form-control"
                id="imageUrl"
                placeholder="Poster Image URL"
              />
              <label htmlFor="imageUrl">Poster Image URL</label>
            </div>

            <div className="mb-3">
              <KaanKaplanSelect
                className="form-select form-select-lg mb-3"
                name="cities"
                multiple
                size={3}
                options={cities.map(name => ({ key: name, text: name, value: name }))}
                placeholder="Select cities"
              />
            </div>

            <div className="d-grid gap-2 my-4 col-6 mx-auto">
              <input
                type="submit"
                value="Add"
                className="btn btn-block btn-primary"
              />
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
}
