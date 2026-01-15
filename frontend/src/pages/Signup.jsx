/**
 * @file Signup.jsx
 * @description Signup page component for new user registration
 * @module pages/Signup
 * 
 * Renders the signup page using the Template component with registration form.
 * Allows users to create Student or Instructor accounts with email verification.
 * Supports both email/password registration and Google OAuth signup methods.
 */

import signupImg from "../assets/Images/signup.png"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join the millions learning to code with StudyX for free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup