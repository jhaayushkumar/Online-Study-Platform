/**
 * @file contactUs.js
 * @description Contact form controller for the StudyX platform
 * @module controllers/contactUs
 * 
 * Processes contact form submissions from users. Sends confirmation
 * email to the user and notification email to admin with all form details
 * including name, email, phone, and message content.
 */

const mailSender = require('../utils/mailSender');
const { contactUsEmail } = require('../mail/templates/contactFormRes');
const { adminContactNotification } = require('../mail/templates/adminContactNotification');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNo, message, countrycode } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        try {
            await mailSender(
                email,
                "Your Data sent successfully",
                contactUsEmail(email, firstName, lastName, message, phoneNo, countrycode)
            );
        } catch (error) {
            console.log('Error sending confirmation email to user:', error.message);
        }

        try {
            await mailSender(
                ADMIN_EMAIL,
                `New Contact Form Submission from ${firstName} ${lastName || ''}`,
                adminContactNotification(email, firstName, lastName, message, phoneNo, countrycode)
            );
        } catch (error) {
            console.log('Error sending notification email to admin:', error.message);
            return res.status(500).json({
                success: false,
                message: "Error while sending admin notification"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        console.log("Error while processing contact request:", error);
        return res.status(500).json({
            success: false,
            message: "Error while processing contact request",
            error: error.message
        });
    }
};
