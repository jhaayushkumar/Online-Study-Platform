/**
 * @file OpenRoute.jsx
 * @description Route guard component for unauthenticated users only
 * @module components/core/Auth/OpenRoute
 * 
 * Protects routes that should only be accessible to non-logged-in users
 * like login and signup pages. Redirects authenticated users to home page
 * to prevent accessing auth pages when already logged in.
 */

import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
  const { token } = useSelector((state) => state.auth)

  if (token === null) {
    return children
  } else {
    // Redirect logged-in users to home page
    return <Navigate to="/" replace />
  }
}

export default OpenRoute