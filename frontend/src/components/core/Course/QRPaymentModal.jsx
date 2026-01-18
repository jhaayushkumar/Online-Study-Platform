import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle, AlertCircle, Loader, Copy } from 'lucide-react';
import { apiConnector } from '../../../services/apiConnector';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const QRPaymentModal = ({ onClose, amount, courseName, orderId, upiIntent, coursesId, upiId }) => {
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed
    const [transactionId, setTransactionId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerifyPayment = async () => {
        if (!transactionId.trim()) {
            toast.error('Please enter transaction ID');
            return;
        }

        setIsVerifying(true);
        try {
            const token = localStorage.getItem('token');
            const response = await apiConnector(
                'POST',
                `${BASE_URL}/payment/verifyUPIPayment`,
                {
                    orderId,
                    transactionId: transactionId.trim(),
                    coursesId
                },
                {
                    Authorization: `Bearer ${token}`
                }
            );

            if (response.data.success) {
                setPaymentStatus('success');
                toast.success('Payment verified successfully!');
                
                // Reload after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error(error.response?.data?.message || 'Payment verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const copyUpiId = () => {
        navigator.clipboard.writeText(upiId || 'Not available');
        toast.success('UPI ID copied!');
    };

    // Remove auto-polling, use manual verification instead
    /*
    // Poll for payment status  
    useEffect(() => {
        if (!orderId || !isPolling) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await apiConnector(
                    'GET',
                    `${BASE_URL}/payment/checkPaymentStatus/${orderId}`,
                    null,
                    {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                );

                if (response.data.isPaid) {
                    setPaymentStatus('success');
                    setIsPolling(false);

                    // Auto close after 3 seconds
                    setTimeout(() => {
                        onClose();
                        window.location.reload(); // Reload to show enrolled course
                    }, 3000);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 3000); // Poll every 3 seconds

        // Stop polling after 10 minutes
        const timeout = setTimeout(() => {
            setIsPolling(false);
            if (paymentStatus === 'pending') {
                setPaymentStatus('failed');
            }
        }, 600000);

        return () => {
            clearInterval(pollInterval);
            clearTimeout(timeout);
        };
    }, [orderId, isPolling, paymentStatus, onClose]);
    */

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="relative w-full max-w-md bg-richblack-800 rounded-xl shadow-2xl p-8 mx-4">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-richblack-300 hover:text-richblack-5 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-richblack-5 mb-2">
                        {paymentStatus === 'success' ? '🎉 Payment Successful!' :
                            paymentStatus === 'failed' ? '❌ Payment Failed' :
                                '📱 Scan QR to Pay'}
                    </h2>
                    <p className="text-richblack-300 text-sm">
                        {courseName}
                    </p>
                </div>

                {/* Payment Status Content */}
                {paymentStatus === 'pending' && (
                    <>
                        {/* QR Code */}
                        <div className="flex justify-center mb-6 bg-white p-4 rounded-lg">
                            <QRCodeSVG
                                value={upiIntent}
                                size={256}
                                level="H"
                                includeMargin={true}
                            />
                        </div>

                        {/* Amount */}
                        <div className="text-center mb-6">
                            <p className="text-3xl font-bold text-caribbeangreen-200">
                                ₹{amount}
                            </p>
                        </div>

                        {/* Instructions */}
                        <div className="bg-richblack-700 rounded-lg p-4 mb-4">
                            <h3 className="text-richblack-5 font-semibold mb-3">
                                How to pay:
                            </h3>
                            <ol className="text-richblack-300 text-sm space-y-2 list-decimal list-inside">
                                <li>Open any UPI app (PhonePe, Google Pay, Paytm)</li>
                                <li>Scan the QR code above</li>
                                <li>Verify amount and complete payment</li>
                                <li>Copy the transaction ID from your UPI app</li>
                                <li>Enter it below and click Verify</li>
                            </ol>
                        </div>

                        {/* UPI ID Display */}
                        {upiId && (
                            <div className="bg-richblack-700 rounded-lg p-3 mb-4 flex items-center justify-between">
                                <div>
                                    <p className="text-richblack-400 text-xs">Pay to UPI ID:</p>
                                    <p className="text-richblack-5 font-mono text-sm">{upiId}</p>
                                </div>
                                <button
                                    onClick={copyUpiId}
                                    className="text-caribbeangreen-200 hover:text-caribbeangreen-100 transition-colors"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        )}

                        {/* Transaction ID Input */}
                        <div className="mb-4">
                            <label className="text-richblack-5 text-sm font-semibold mb-2 block">
                                Enter Transaction ID / UTR Number
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="e.g., 123456789012"
                                className="w-full bg-richblack-700 text-richblack-5 border border-richblack-600 rounded-lg px-4 py-3 focus:outline-none focus:border-caribbeangreen-200 transition-colors"
                            />
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={handleVerifyPayment}
                            disabled={isVerifying || !transactionId.trim()}
                            className="w-full bg-yellow-50 text-richblack-900 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader className="animate-spin" size={20} />
                                    Verifying...
                                </>
                            ) : (
                                'Verify Payment'
                            )}
                        </button>

                        {/* Note */}
                        <p className="text-richblack-400 text-xs text-center mt-3">
                            After payment, enter your transaction ID above to complete enrollment
                        </p>
                    </>
                )}

                {paymentStatus === 'success' && (
                    <div className="text-center py-8">
                        <CheckCircle size={64} className="text-caribbeangreen-300 mx-auto mb-4" />
                        <p className="text-richblack-5 text-lg mb-2">
                            Payment completed successfully!
                        </p>
                        <p className="text-richblack-300 text-sm">
                            You are now enrolled in the course.
                        </p>
                    </div>
                )}

                {paymentStatus === 'failed' && (
                    <div className="text-center py-8">
                        <AlertCircle size={64} className="text-pink-200 mx-auto mb-4" />
                        <p className="text-richblack-5 text-lg mb-2">
                            Payment timeout or failed
                        </p>
                        <p className="text-richblack-300 text-sm mb-4">
                            Please try again or contact support.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-yellow-50 text-richblack-900 px-6 py-2 rounded-md font-semibold hover:bg-yellow-100 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Order ID */}
                <div className="mt-6 pt-4 border-t border-richblack-700">
                    <p className="text-richblack-400 text-xs text-center">
                        Order ID: {orderId}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRPaymentModal;

