import React from 'react';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiGooglepay, SiPhonepe, SiPaytm } from 'react-icons/si';
import { IoClose } from 'react-icons/io5';

const PaymentMethodModal = ({ onClose, onSelectCard, onSelectUPI }) => {
    return (
        <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="w-11/12 max-w-lg rounded-lg border border-richblack-400 bg-richblack-800 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-richblack-5">
                        Choose Payment Method
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-richblack-200 hover:text-richblack-5"
                    >
                        <IoClose className="text-3xl" />
                    </button>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                    {/* Card Payment Option */}
                    <button
                        onClick={onSelectCard}
                        className="w-full p-6 rounded-lg border-2 border-richblack-600 hover:border-yellow-50 bg-richblack-700 hover:bg-richblack-600 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-richblack-5 mb-2">
                                    💳 Card Payment
                                </h3>
                                <p className="text-sm text-richblack-300">
                                    Credit Card, Debit Card, International Cards
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <RiVisaLine className="text-4xl text-blue-500" />
                                <RiMastercardLine className="text-4xl text-red-500" />
                            </div>
                        </div>
                    </button>

                    {/* UPI/QR Payment Option */}
                    <button
                        onClick={onSelectUPI}
                        className="w-full p-6 rounded-lg border-2 border-richblack-600 hover:border-yellow-50 bg-richblack-700 hover:bg-richblack-600 transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-richblack-5 mb-2">
                                    📱 UPI / QR Payment
                                </h3>
                                <p className="text-sm text-richblack-300">
                                    Google Pay, PhonePe, Paytm, Any UPI App
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <SiGooglepay className="text-3xl text-richblack-300" />
                                <SiPhonepe className="text-3xl text-richblack-300" />
                                <SiPaytm className="text-3xl text-richblack-300" />
                            </div>
                        </div>
                    </button>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-richblack-700 rounded-lg">
                    <p className="text-xs text-richblack-300 text-center">
                        🔒 All payments are secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodModal;
