/**
 * @file Contact.jsx
 * @description Contact page with form and platform information
 * @module pages/Contact
 * 
 * Renders the contact page with a contact form for user inquiries,
 * tech stack showcase GIF, contact details section, and review slider.
 * Allows users to reach out for support, partnerships, or general questions
 * about the StudyX platform and its services.
 */

import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/core/ContactPage/ContactDetails"
import ContactForm from "../components/core/ContactPage/ContactForm"
import ReviewSlider from './../components/common/ReviewSlider';
import techStackGif from '../assets/Images/tech-stack.gif';



const Contact = () => {
  return (
    <div>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>

        {/* Tech Stack GIF - Right Side */}
        <div className="lg:w-[40%] flex flex-col justify-center">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-6 text-center lg:text-left">
            Built with Modern Technologies
          </h2>
          <div className="flex justify-center">
            <img
              src={techStackGif}
              alt="Tech Stack"
              className="w-[110%] max-w-none rounded-xl shadow-[0_0_30px_rgba(255,214,10,0.3)] hover:shadow-[0_0_50px_rgba(255,214,10,0.5)] hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Contact Details - Moved Below */}
      <div className="mx-auto my-20 flex w-11/12 max-w-maxContent justify-center text-white">
        <div className="lg:w-[70%]">
          <ContactDetails />
        </div>
      </div>

      {/* Reviws from Other Learner */}
      <div className=" my-20 px-5 text-white ">
        <h1 className="text-center text-4xl font-semibold mt-8 mb-8">
          Reviews from other learners
        </h1>
        <div className="mx-auto max-w-maxContent">
          <ReviewSlider />
        </div>
      </div>

      {/* footer */}
      <Footer />
    </div>
  )
}

export default Contact