import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdCancel } from 'react-icons/md';

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-richblack-900">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6">
                    <MdCancel className="w-20 h-20 text-red-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-richblack-5 mb-4">
                    Payment Cancelled
                </h1>
                <p className="text-richblack-300 mb-8">
                    Your payment was cancelled. No charges have been made to your account.
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-25 transition"
                    >
                        Try Again
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

export default PaymentCancel;
