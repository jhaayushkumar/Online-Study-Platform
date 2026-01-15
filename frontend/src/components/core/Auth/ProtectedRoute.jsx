/**
 * @file ProtectedRoute.jsx
 * @description Route guard component for authenticated users only
 * @module components/core/Auth/ProtectedRoute
 * 
 * Protects routes that require authentication like dashboard, profile,
 * and enrolled courses. Redirects unauthenticated users to login page
 * and renders children components only when valid token exists in state.
 */

import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const { token } = useSelector(state => state.auth);

    // user logged in
    if (token !== null) {
        return children;
    }

    return <Navigate to='/login' />

}

export default ProtectedRoute