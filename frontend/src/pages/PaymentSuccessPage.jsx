import React from 'react'

export default function PaymentSuccessPage() {
  return (
    <div>
      <div className='mt-5 p-5 container' style={{ height: "100vh" }}>
        <h2 className='mt-4'>Payment Successful</h2>
        <hr />
        <h5 className='mt-4'>
          Thank you for choosing CineVision. Your payment has been completed,
          and your ticket details have been sent to your email address.
        </h5>
        <h5 className='pt-3'>
          The CineVision team wishes you an enjoyable viewing experience.
        </h5>
      </div>
    </div>
  )
}
