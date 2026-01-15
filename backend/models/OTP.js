/**
 * @file OTP.js
 * @description OTP model schema for the StudyX platform
 * @module models/OTP
 * 
 * Stores one-time passwords for email verification during signup.
 * OTPs auto-expire after 5 minutes using MongoDB TTL index.
 * Pre-save hook automatically sends verification email to user.
 */

const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/templates/emailVerificationTemplate');

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
        default: Date.now(),
        expires: 5 * 60,
    }
});

async function sendVerificationEmail(email, otp) {
    try {
        const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
        const emailBody = emailTemplate(otp, name);
        const mailResponse = await mailSender(email, 'Verification Email from StudyX', emailBody);
        return mailResponse;
    }
    catch (error) {
        console.log('Error while sending OTP email:', error.message);
        throw error;
    }
}

OTPSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            await sendVerificationEmail(this.email, this.otp);
        } catch (error) {
            console.log('Email sending failed, but OTP saved for testing');
        }
    }
    next();
})

module.exports = mongoose.model('OTP', OTPSchema);
