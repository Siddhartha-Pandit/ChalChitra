import Cleave from 'cleave.js/react'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { PaymentService } from '../services/paymentService'
import KaanKaplanTextInput from '../utils/customFormItems/KaanKaplanTextInput'

export default function BuyTicketPage() {
  const navigate = useNavigate()
  const paymentService = new PaymentService()

  const [ticketItem, setTicketItem] = useState("ticketSection")
  const [adultTicketNumber, setAdultTicketNumber] = useState(0)
  const [studentTicketNumber, setStudentTicketNumber] = useState(0)
  const [seatCount, setSeatCount] = useState(studentTicketNumber + adultTicketNumber)
  const [selectedSeats, setSelectedSeats] = useState([])

  const movieState = useSelector(state => state.movie.payload)

  function isSeatAvailable(id) {
    return document.getElementById(id).className !== "taken"
  }

  function selectSeat(id) {
    const elem = document.getElementById(id)
    if (isSeatAvailable(id) && seatCount > 0) {
      elem.style.background = "#ff6a00"
      elem.className = "taken"
      setSelectedSeats([...selectedSeats, id])
      setSeatCount(seatCount - 1)
    } else if (elem.className === "taken") {
      elem.removeAttribute("style")
      elem.className = "empty"
      setSelectedSeats(selectedSeats.filter(s => s !== id))
      setSeatCount(seatCount + 1)
    }
  }

  return (
    <div className='ticket-page'>
      <div className='row justify-content-center align-items-start'>

        {/* Movie Info Panel */}
        <div className='ticket-page-bg-img col-sm-12 col-md-4 text-light'>
          <div className='mt-5 pt-5'>
            <h3 className='mt-2'>{movieState?.movieName}</h3>
            <img
              className='img-thumbnail w-50 mx-auto mt-5'
              src={movieState?.imageUrl}
              alt={movieState?.movieName}
            />
            <h5 className='pt-5'>
              <i className="fa-solid fa-location-dot" /> {movieState?.saloonName}
            </h5>
            <h5 className='py-2'>
              <i className="fa-solid fa-calendar-days" /> {movieState?.movieDay}
            </h5>
            <h5>
              <i className="fa-regular fa-clock" /> {movieState?.movieTime}
            </h5>
          </div>

          {/* Background blur via ::after */}
          <style dangerouslySetInnerHTML={{
            __html: [
              '.ticket-page-bg-img:after {',
              '  content: "";',
              '  position: absolute;',
              '  z-index: -1;',
              '  inset: 0;',
              `  background-image: url(${movieState?.imageUrl});`,
              '  background-repeat: no-repeat;',
              '  background-size: cover;',
              '  background-position: top center;',
              '  opacity: 0.8;',
              '  min-height: 100vh;',
              '  -webkit-filter: blur(8px) saturate(1);',
              '}'
            ].join('\n')
          }} />
        </div>

        {/* Main Form Panel */}
        <div className='col-sm-12 col-md-8 pt-5'>
          <div className='container pt-5'>

            <div className="accordion accordion-flush" id="accordionPanels">
              {/* Ticket Selection */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTicket">
                  <div className='row pt-3 pb-1 px-4 align-items-center'>
                    <div className='col-sm-6 text-start'>
                      <h3>Choose Your Ticket</h3>
                    </div>
                    <div className='col-sm-6 text-end'>
                      {ticketItem === "ticketSection" ? (
                        <button
                          className='btn btn-dark'
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTicket"
                          aria-expanded="true"
                          onClick={() => {
                            if (adultTicketNumber + studentTicketNumber === 0) {
                              toast.warning("Please select a ticket to proceed", {
                                theme: "dark",
                                position: "top-center"
                              })
                            } else {
                              setTicketItem("placeSection")
                              setSeatCount(adultTicketNumber + studentTicketNumber)
                            }
                          }}
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          className='btn btn-outline-dark'
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTicket"
                          onClick={() => setTicketItem("ticketSection")}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>
                </h2>

                {ticketItem === 'ticketSection' && (
                  <div
                    id="collapseTicket"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingTicket"
                  >
                    <div className="accordion-body">
                      <p>
                        After selecting film and showtime, choose your ticket type.
                        If you’re a student, don’t forget your student ID.
                      </p>

                      {/* Adult Ticket */}
                      <div className='row mt-3 px-2 border border-2 align-items-center'>
                        <div className='col-sm-6 text-uppercase border-end'>Adult</div>
                        <div className='col-sm-3 border-end'>Price 25₺</div>
                        <div className='col-sm-3'>
                          <div className='row justify-content-center align-items-center'>
                            <div className='col-4'>
                              <button
                                className='btn btn-dark'
                                onClick={() => adultTicketNumber > 0 && setAdultTicketNumber(adultTicketNumber - 1)}
                              >
                                <i className="fa-solid fa-minus" />
                              </button>
                            </div>
                            <div className='col-4 text-center'>{adultTicketNumber}</div>
                            <div className='col-4'>
                              <button
                                className='btn btn-dark'
                                onClick={() => setAdultTicketNumber(adultTicketNumber + 1)}
                              >
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Student Ticket */}
                      <div className='row mt-1 px-2 border border-2 align-items-center'>
                        <div className='col-sm-6 text-uppercase border-end'>Student</div>
                        <div className='col-sm-3 border-end'>Price 15₺</div>
                        <div className='col-sm-3'>
                          <div className='row justify-content-center align-items-center'>
                            <div className='col-4'>
                              <button
                                className='btn btn-dark'
                                onClick={() => studentTicketNumber > 0 && setStudentTicketNumber(studentTicketNumber - 1)}
                              >
                                <i className="fa-solid fa-minus" />
                              </button>
                            </div>
                            <div className='col-4 text-center'>{studentTicketNumber}</div>
                            <div className='col-4'>
                              <button
                                className='btn btn-dark'
                                onClick={() => setStudentTicketNumber(studentTicketNumber + 1)}
                              >
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className='lead text-end mt-3 me-5'>
                        Total Amount: <strong>{(studentTicketNumber * 15 + adultTicketNumber * 25).toFixed(2)} ₺</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Seat Selection */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingSeat">
                  <div className='row pt-3 pb-1 px-4 align-items-center'>
                    <div className='col-sm-6 text-start'>
                      <h3>Select Seat</h3>
                    </div>
                    <div className='col-sm-6 text-end'>
                      {ticketItem === "placeSection" ? (
                        <button
                          className='btn btn-dark'
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSeat"
                          onClick={() => {
                            if (seatCount !== 0) {
                              toast.warning("Please select seats equal to the number of tickets!", {
                                theme: "dark",
                                position: "top-center"
                              })
                            } else {
                              setTicketItem("paySection")
                            }
                          }}
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          className='btn btn-outline-dark'
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSeat"
                          onClick={() => setTicketItem("placeSection")}
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>
                </h2>
                <div
                  id="collapseSeat"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingSeat"
                >
                  <div className="accordion-body">
                    {ticketItem === "placeSection" && (
                      <>
                        <table className="table">
                          <tbody>
                            {["F","E","D","C","B","A"].map(row =>
                              <tr key={row}>
                                <th scope="row">{row}</th>
                                <td></td><td></td>
                                {[1,2,3,4,5,6,7,8].slice(row==="F"?3:0, row==="F"?10:8).map(num => (
                                  <td
                                    key={row+num}
                                    id={`${row}${num}`}
                                    className="empty"
                                    onClick={() => selectSeat(`${row}${num}`)}
                                  >
                                    <i className="fa-solid fa-chair" />
                                  </td>
                                ))}
                              </tr>
                            )}
                          </tbody>
                        </table>
                        <div>
                          <p className='pt-2'>Screen</p>
                          <hr style={{ height: "4px", backgroundColor: "black" }} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingPay">
                  <div className='row pt-3 pb-1 px-4 align-items-center'>
                    <div className='col-sm-6 text-start'>
                      <h3>Payment</h3>
                    </div>
                    <div className='col-sm-6 text-end'>
                      {ticketItem === "paySection" && (
                        <h3>Total: {(studentTicketNumber * 15 + adultTicketNumber * 25).toFixed(2)} ₺</h3>
                      )}
                    </div>
                  </div>
                </h2>
                <div
                  id="collapsePay"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingPay"
                >
                  {ticketItem === "paySection" && (
                    <div className="accordion-body">
                      <Formik
                        initialValues={{}}
                        onSubmit={values => {
                          values.chairNumbers = selectedSeats.join(' ')
                          values.movieName = movieState?.movieName
                          values.saloonName = movieState?.saloonName
                          values.movieDay = movieState?.movieDay
                          values.movieStartTime = movieState?.movieTime

                          paymentService.sendTicketDetail(values).then(() => {
                            navigate("/paymentSuccess")
                          })
                        }}
                      >
                        <Form className='row justify-content-center align-items-start'>
                          <div className='col-sm-12 col-md-6'>
                            <div className="form-floating mb-3">
                              <KaanKaplanTextInput
                                name="fullName"
                                type="text"
                                className="form-control"
                                id="fullName"
                                placeholder="Full Name"
                                required
                              />
                              <label htmlFor="fullName">Full Name</label>
                            </div>
                            <div className="form-floating mb-3">
                              <KaanKaplanTextInput
                                name="email"
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                required
                              />
                              <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                              <KaanKaplanTextInput
                                name="phone"
                                type="tel"
                                pattern="[0]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
                                className="form-control"
                                id="phone"
                                placeholder="0 5** *** ** **"
                                required
                              />
                              <label htmlFor="phone">Phone - 0 5** *** ** **</label>
                            </div>
                          </div>

                          <div className='col-sm-12 col-md-6 mb-3'>
                            <div className="form-floating mb-3">
                              <Cleave
                                className="form-control"
                                id="floatingCardNumber"
                                placeholder="Credit Card Number"
                                options={{ creditCard: true }}
                                required
                              />
                              <label htmlFor="floatingCardNumber">Credit Card Number</label>
                            </div>
                            <div className='row'>
                              <div className='col-sm-6'>
                                <div className="form-floating mb-3">
                                  <Cleave
                                    type="text"
                                    className="form-control"
                                    id="floatingCardExpiry"
                                    placeholder="MM/YY"
                                    options={{ date: true, datePattern: ['m', 'y'] }}
                                    required
                                  />
                                  <label htmlFor="floatingCardExpiry">Expiration Date</label>
                                </div>
                              </div>
                              <div className='col-sm-6'>
                                <div className="form-floating mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    maxLength="3"
                                    id="floatingCvv"
                                    placeholder="CVV"
                                    required
                                  />
                                  <label htmlFor="floatingCvv">Security Code</label>
                                </div>
                              </div>
                            </div>
                            <p className='text-start'>
                              <input
                                className="form-check-input me-3"
                                type="checkbox"
                                required
                              />
                              I have read and agree to the Preliminary Information Terms and Distance Sales Agreement.
                            </p>
                          </div>

                          <hr />
                          <div className='text-end mt-1'>
                            <button type='submit' className='btn btn-dark col-3'>
                              Pay
                            </button>
                          </div>
                        </Form>
                      </Formik>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
