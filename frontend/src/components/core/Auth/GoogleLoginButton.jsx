/**
 * @file GoogleLoginButton.jsx
 * @description Google OAuth login component for the StudyX platform
 * @module components/core/Auth/GoogleLoginButton
 * 
 * Renders Google Sign-In button using @react-oauth/google library.
 * Handles authentication flow, sends credentials to backend for verification,
 * stores JWT token and user data, and redirects based on account type.
 */

import { useState, useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '../../../slices/authSlice';
import { setUser } from '../../../slices/profileSlice';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../../services/apiConnector';
import { endpoints } from '../../../services/apis';

const GoogleLoginButton = ({ accountType }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isReady, setIsReady] = useState(false);
    const containerRef = useRef(null);
    
    // Get accountType from props or URL parameter
    const accountTypeFromUrl = searchParams.get('accountType');
    const finalAccountType = accountType || accountTypeFromUrl || 'Student';

    useEffect(() => {
        // Check if Google script is loaded
        const checkGoogleLoaded = () => {
            if (window.google && window.google.accounts) {
                setIsReady(true);
            } else {
                // Retry after a short delay
                setTimeout(checkGoogleLoaded, 100);
            }
        };

        // Start checking after component mounts
        const timer = setTimeout(checkGoogleLoaded, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const handleSuccess = async (credentialResponse) => {
        const toastId = toast.loading('Signing in with Google...');
        
        try {
            const response = await apiConnector(
                'POST',
                endpoints.GOOGLE_AUTH_API,
                { 
                    credential: credentialResponse.credential,
                    accountType: finalAccountType
                }
            );

            if (response.data.success) {
                const { token, user } = response.data;
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                dispatch(setToken(token));
                dispatch(setUser(user));

                toast.dismiss(toastId);
                toast.success('Welcome to StudyX!');
                
                // Redirect based on account type
                if (user.accountType === "Instructor") {
                    navigate('/dashboard/instructor');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast.dismiss(toastId);
            toast.error(error?.response?.data?.message || 'Google login failed. Please try again.');
        }
    };

    const handleError = () => {
        toast.error('Google login failed. Please try again.');
    };

    return (
        <div ref={containerRef} className="w-full flex justify-center min-h-[44px] items-center">
            {!isReady ? (
                <div className="w-full flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-50"></div>
                </div>
            ) : (
                <div className="w-full flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        useOneTap={false}
                        theme="filled_black"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                    />
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;
