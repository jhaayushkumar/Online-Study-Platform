/**
 * @file mailSender.js
 * @description Email utility for the StudyX platform
 * @module utils/mailSender
 * 
 * Sends emails using Nodemailer with Gmail SMTP configuration.
 * Used for OTP verification, password reset links, course enrollment
 * confirmations, and contact form notifications.
 */

const nodemailer = require('nodemailer');

// Create transporter once and reuse
let transporter = null;

const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 15000
        });
    }
    return transporter;
};

const mailSender = async (email, title, body) => {
    try {
        const transporter = getTransporter();
        
        const info = await transporter.sendMail({
            from: `"StudyX" <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        console.log('Email sent successfully to:', email);
        return info;
    }
    catch (error) {
        console.log('Error while sending mail:', error.message);
        throw error;
    }
}

module.exports = mailSender;
