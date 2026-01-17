/**
 * @file GoogleLoginButton.jsx
 * @description Google OAuth login component for the StudyX platform
 * @module components/core/Auth/GoogleLoginButton
 * 
 * Renders custom styled Google Sign-In button.
 * Handles authentication flow, sends credentials to backend for verification,
 * stores JWT token and user data, and redirects based on account type.
 */

import { useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '../../../slices/authSlice';
import { setUser } from '../../../slices/profileSlice';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../../services/apiConnector';
import { endpoints } from '../../../services/apis';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = ({ accountType }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const googleButtonRef = useRef(null);
    
    // Get accountType from props or URL parameter
    const accountTypeFromUrl = searchParams.get('accountType');
    const finalAccountType = accountType || accountTypeFromUrl || 'Student';

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

    const handleCustomClick = () => {
        const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]');
        if (googleBtn) {
            googleBtn.click();
        }
    };

    return (
        <div className="relative w-full">
            {/* Custom styled button */}
            <button
                type="button"
                onClick={handleCustomClick}
                className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-richblack-700 bg-richblack-800 py-3 px-4 font-medium text-richblack-5 hover:bg-richblack-700 hover:border-richblack-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
                <FcGoogle className="text-2xl" />
                <span className="text-base">Continue with Google</span>
            </button>
            
            {/* Hidden Google button */}
            <div 
                ref={googleButtonRef} 
                className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none overflow-hidden"
                style={{ zIndex: -1 }}
            >
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    useOneTap={false}
                />
            </div>
        </div>
    );
};

export default GoogleLoginButton;
