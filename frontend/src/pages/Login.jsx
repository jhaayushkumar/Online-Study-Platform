/**
 * @file Login.jsx
 * @description Login page component for user authentication
 * @module pages/Login
 * 
 * Renders the login page using the Template component with login form.
 * Displays welcome message, educational taglines, and login image.
 * Supports both email/password and Google OAuth authentication methods.
 */

import loginImg from "../assets/Images/login.png"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
    />
  )
}

export default Login