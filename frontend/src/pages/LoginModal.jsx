import { Form, Formik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { UserService } from '../services/userService';
import { addUserToState, removeUserFromState } from '../store/actions/userActions';
import KaanKaplanTextInput from '../utils/customFormItems/KaanKaplanTextInput';

export default function LoginModal() {
  const userService = new UserService();
  const dispatch = useDispatch();

  function login(loginDto) {
    dispatch(removeUserFromState());

    userService.login(loginDto)
      .then(result => {
        if (result.status === 200) {
          dispatch(addUserToState(result.data));
          // close the modal
          document.getElementById("close-button").click();
          toast("Welcome!", {
            theme: "colored",
            position: "top-center"
          });
        }
      })
      .catch(() => {
        toast.error("Email or password incorrect. Please try again.", {
          theme: "colored",
          position: "top-center"
        });
      });
  }

  return (
    <div>
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header login-modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button
                id="close-button"
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={values => login(values)}
            >
              <Form>
                <div className="modal-body">
                  <div className="form-floating mb-3">
                    <KaanKaplanTextInput
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Email"
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <KaanKaplanTextInput
                      id="password"
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                  <p className="ps-2 text-start">
                    Don’t have a CineVision account?{' '}
                    <a
                      href="#!"
                      style={{ color: "black" }}
                      data-bs-toggle="modal"
                      data-bs-target="#registerModal"
                    >
                      Register now
                    </a>
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary login-modal-btn">
                    Login
                  </button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
