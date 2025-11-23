import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../../slices/authSlice';
import { setUser } from '../../../slices/profileSlice';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../../services/apiConnector';
import { endpoints } from '../../../services/apis';

const GoogleLoginButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            // Send Google token to backend for verification
            const response = await apiConnector(
                'POST',
                endpoints.GOOGLE_AUTH_API,
                { token: credentialResponse.credential }
            );

            if (response.data.success) {
                // Store token and user data
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                dispatch(setToken(token));
                dispatch(setUser(user));

                toast.success('Logged in successfully!');
                navigate('/dashboard/my-profile');
            }
        } catch (error) {
            console.error('Google login error:', error);
            toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const handleError = () => {
        toast.error('Google login failed. Please try again.');
    };

    return (
        <div className="w-full">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
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
