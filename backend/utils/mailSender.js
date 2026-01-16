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
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            pool: true, // Use connection pooling
            maxConnections: 5,
            maxMessages: 100
        });
    }
    return transporter;
};

const mailSender = async (email, title, body) => {
    try {
        const transporter = getTransporter();
        
        const info = await transporter.sendMail({
            from: `"StudyX" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        return info;
    }
    catch (error) {
        console.log('Error while sending mail:', error.message);
        throw error;
    }
}

module.exports = mailSender;
