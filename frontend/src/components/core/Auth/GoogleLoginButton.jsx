/**
 * @file GoogleLoginButton.jsx
 * @description Google OAuth login component for the StudyX platform
 * @module components/core/Auth/GoogleLoginButton
 * 
 * Renders a custom-styled Google Sign-In button that triggers Google OAuth.
 * Handles authentication flow, sends credentials to backend for verification,
 * stores JWT token and user data, and redirects to home page on success.
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
    const googleButtonRef = useRef(null);
    const [searchParams] = useSearchParams();
    
    // Get accountType from props or URL parameter
    const accountTypeFromUrl = searchParams.get('accountType');
    const finalAccountType = accountType || accountTypeFromUrl || 'Student';
    
    console.log('GoogleLoginButton - Props accountType:', accountType);
    console.log('GoogleLoginButton - URL accountType:', accountTypeFromUrl);
    console.log('GoogleLoginButton - Final accountType:', finalAccountType);

    const handleSuccess = async (credentialResponse) => {
        const toastId = toast.loading('Signing in with Google...');
        
        try {
            console.log('Google Login - accountType:', finalAccountType);
            
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
                console.log('Google Login - User from backend:', user);
                console.log('Google Login - User accountType:', user.accountType);
                
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                dispatch(setToken(token));
                dispatch(setUser(user));

                toast.dismiss(toastId);
                toast.success('Welcome to StudyX!');
                
                // Redirect based on account type
                if (user.accountType === "Instructor") {
                    console.log('Redirecting to instructor dashboard');
                    navigate('/dashboard/instructor');
                } else {
                    console.log('Redirecting to home');
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
        } else {
            console.error('Google button not found');
        }
    };

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={handleCustomClick}
                className="w-full flex items-center justify-center gap-3 rounded-[8px] border border-richblack-600 bg-richblack-800 py-[10px] px-[12px] font-medium text-richblack-5 hover:bg-richblack-700 hover:border-richblack-500 transition-all duration-200"
            >
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
            </button>
            
            <div ref={googleButtonRef} className="absolute opacity-0 h-0 w-0 overflow-hidden" style={{ pointerEvents: 'auto' }}>
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
