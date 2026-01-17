/**
 * @file GoogleLoginButton.jsx
 * @description Google OAuth login component for the StudyX platform
 * @module components/core/Auth/GoogleLoginButton
 * 
 * Renders Google Sign-In button using @react-oauth/google library.
 * Handles authentication flow, sends credentials to backend for verification,
 * stores JWT token and user data, and redirects based on account type.
 */

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

    return (
        <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap={false}
                theme="filled_black"
                size="large"
                width="100%"
                text="continue_with"
                shape="rectangular"
            />
        </div>
    );
};

export default GoogleLoginButton;
