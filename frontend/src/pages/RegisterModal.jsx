import { Form, Formik } from 'formik';
import React from 'react';
import { useState } from 'react';
import { UserService } from '../services/userService';
import KaanKaplanTextInput from '../utils/customFormItems/KaanKaplanTextInput';
import { ToastContainer, toast } from 'react-toastify';

export default function RegisterModal() {
  const userService = new UserService();

  const registerCustomer = (values) => {
    if (values.password === values.passwordAgain) {
      const customer = {
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        password: values.password
      };

      userService.addCustomer(customer).then(result => {
        if (result.status === 200) {
          // Open the login modal
          document.querySelector("#loginModalLink").click();
          toast("Your account has been created successfully! Please log in.", {
            theme: "colored",
            position: "top-center"
          });
        }
      });
    } else {
      toast.error("Password values do not match.", {
        theme: "colored",
        position: "top-center"
      });
    }
  };

  return (
    <div>
      <div
        className="modal fade"
        id="registerModal"
        tabIndex="-1"
        aria-labelledby="registerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header login-modal-header">
              <h5 className="modal-title" id="registerModalLabel">Register</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <Formik
              initialValues={{
                customerName: '',
                email: '',
                phone: '',
                password: '',
                passwordAgain: ''
              }}
              onSubmit={values => registerCustomer(values)}
            >
              <Form>
                <div className="modal-body">
                  <div className="form-floating mb-3">
                    <KaanKaplanTextInput
                      type="text"
                      name="customerName"
                      className="form-control"
                      id="customerName"
                      placeholder="Full Name"
                      required
                    />
                    <label htmlFor="customerName">Full Name</label>
                  </div>
                  <div className="form-floating mb-3">
                    <KaanKaplanTextInput
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      required
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  <div className="form-floating mb-3">
                    <KaanKaplanTextInput
                      type="tel"
                      name="phone"
                      className="form-control"
                      id="phone"
                      placeholder="Phone"
                      pattern="[0]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
                      required
                    />
                    <label htmlFor="phone">Phone – 0 5** *** ** **</label>
                  </div>
                  <div className="form-floating mb-3">
                    <KaanKaplanTextInput
                      type="password"
                      name="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="form-floating mb-3">
                    <KaanKaplanTextInput
                      type="password"
                      name="passwordAgain"
                      className="form-control"
                      id="passwordAgain"
                      placeholder="Confirm Password"
                      required
                    />
                    <label htmlFor="passwordAgain">Confirm Password</label>
                  </div>
                  <p className="ps-2 text-start">
                    Already a member?{' '}
                    <a
                      href="#!"
                      id="loginModalLink"
                      style={{ color: "black" }}
                      data-bs-toggle="modal"
                      data-bs-target="#loginModal"
                    >
                      Login
                    </a>
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary login-modal-btn">
                    Register
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
