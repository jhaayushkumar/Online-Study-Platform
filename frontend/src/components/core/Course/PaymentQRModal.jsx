import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { FaCheckCircle } from 'react-icons/fa';
import { MdQrCodeScanner } from 'react-icons/md';

const PaymentQRModal = ({ onClose, onPaymentComplete, amount, courseName }) => {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success

  const handlePaymentConfirm = () => {
    setPaymentStatus('processing');
    // After 2 seconds, mark as success
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        onPaymentComplete();
      }, 1500);
    }, 2000);
  };

  // Use the actual PhonePe QR code image
  const qrCodeUrl = 'https://i.ibb.co/9ZGqK8Y/phonepe-qr.png';

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-black bg-opacity-90 backdrop-blur-sm">
      <div className="relative w-11/12 max-w-[500px] rounded-2xl bg-gradient-to-b from-richblack-900 to-richblack-800 p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-richblack-300 hover:text-richblack-5 transition-colors"
        >
          <RxCross2 size={28} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-6">
          {paymentStatus === 'pending' && (
            <>
              {/* PhonePe Logo and Header */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-600">
                    <span className="text-3xl font-bold text-white">₹</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    StudyX
                  </h2>
                </div>
                <div className="rounded-full bg-purple-600 bg-opacity-20 px-6 py-2">
                  <p className="text-lg font-semibold text-purple-400">
                    ACCEPTED HERE
                  </p>
                </div>
              </div>

              <p className="text-center text-lg text-richblack-100 font-medium">
                Scan & Pay Using PhonePe App
              </p>

              {/* QR Code - Actual PhonePe QR */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-full h-auto max-w-[400px]"
                />
              </div>

              {/* User Name */}
              <div className="text-center">
                <p className="text-xl font-bold text-white tracking-wide">
                  AYUSH KUMAR JHA
                </p>
              </div>

              {/* UPI ID */}
              <div className="w-full rounded-lg bg-richblack-700 p-4">
                <p className="text-sm text-richblack-300">UPI ID</p>
                <p className="font-mono text-lg text-richblack-5">
                  studyx@paytm
                </p>
              </div>

              {/* Amount Display */}
              <div className="w-full rounded-xl bg-gradient-to-r from-purple-900 to-purple-800 p-4 text-center">
                <p className="text-sm text-purple-200 mb-1">Amount to Pay</p>
                <p className="text-4xl font-bold text-white">₹{amount}</p>
              </div>

              {/* Confirm Payment Button */}
              <button
                onClick={handlePaymentConfirm}
                className="w-full rounded-xl bg-gradient-to-r from-caribbeangreen-500 to-caribbeangreen-400 py-4 px-6 font-bold text-lg text-richblack-900 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <MdQrCodeScanner size={28} />
                  <span>I have paid</span>
                </div>
              </button>

              {/* Info message */}
              <div className="w-full rounded-lg bg-blue-900 bg-opacity-30 border border-blue-700 p-3 text-center">
                <p className="text-sm text-blue-200">
                  💡 Click "I have paid" after completing the payment
                </p>
              </div>

              {/* Copyright Footer */}
              <div className="mt-4 text-center border-t border-richblack-700 pt-4 w-full">
                <p className="text-xs text-richblack-400">
                  © 2025, All rights reserved, StudyX Platform
                </p>
                <p className="text-xs text-richblack-500 mt-1">
                  (Powered by PhonePe & UPI)
                </p>
              </div>
            </>
          )}

          {paymentStatus === 'processing' && (
            <>
              <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-richblack-700 border-t-yellow-50"></div>
                <h2 className="text-2xl font-semibold text-richblack-5">
                  Processing Payment...
                </h2>
                <p className="text-richblack-300">Please wait</p>
              </div>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                <FaCheckCircle className="text-6xl text-green-500" />
                <h2 className="text-2xl font-semibold text-richblack-5">
                  Payment Successful!
                </h2>
                <p className="text-center text-richblack-300">
                  You have been enrolled in the course
                </p>
                <div className="mt-4 rounded-lg bg-green-900 bg-opacity-30 p-4">
                  <p className="text-center text-green-200">
                    ✅ Payment of ₹{amount} completed
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentQRModal;
