/**
 * @file PaymentSuccess.jsx
 * @description Payment success page for Stripe checkout completion
 * @module pages/PaymentSuccess
 * 
 * Displays payment confirmation after successful Stripe checkout.
 * Verifies payment session with backend, enrolls student in purchased
 * courses, and shows success message with navigation options to
 * enrolled courses or home page.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const [verifying, setVerifying] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');

            if (!sessionId || !token) {
                toast.error('Invalid payment session');
                navigate('/dashboard/enrolled-courses');
                return;
            }

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_APP_BASE_URL}/payment/verifyStripePayment`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ sessionId }),
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setSuccess(true);
                    toast.success('Payment successful! You are now enrolled.');
                } else {
                    toast.error(data.message || 'Payment verification failed');
                }
            } catch (error) {
                console.error('Verification error:', error);
                toast.error('Could not verify payment');
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams, token, navigate]);

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-richblack-900">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-yellow-50 border-t-transparent rounded-full"></div>
                    <p className="text-richblack-5 mt-4 text-xl">Verifying payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6">
                    <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-richblack-5 mb-4">
                    Payment Successful!
                </h1>
                <p className="text-richblack-300 mb-8">
                    Congratulations! You have successfully enrolled in the course.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate('/dashboard/enrolled-courses')}
                        className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-25 transition"
                    >
                        Go to My Courses
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-richblack-700 text-richblack-5 px-6 py-3 rounded-md font-semibold hover:bg-richblack-600 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
