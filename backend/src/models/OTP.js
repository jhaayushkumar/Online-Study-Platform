/**
 * @file OTP.js
 * @description OTP model schema for the StudyX platform
 * @module models/OTP
 * 
 * Stores one-time passwords for email verification during signup.
 * OTPs auto-expire after 5 minutes using MongoDB TTL index.
 */

const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5 minutes
    }
});

module.exports = mongoose.model('OTP', OTPSchema);
