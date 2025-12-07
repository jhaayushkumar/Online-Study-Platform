const mailSender = require('../utils/mailSender');
const { contactUsEmail } = require('../mail/templates/contactFormRes');
const { adminContactNotification } = require('../mail/templates/adminContactNotification');

// Admin email for receiving contact form submissions
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jha44481@gmail.com';

// ================ CONTACT US ================
exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNo, message, countrycode } = req.body;

        console.log('📧 Contact form submission received from:', email);

        // Validation
        if (!firstName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Send confirmation email to user
        try {
            await mailSender(
                email,
                "Your Data sent successfully",
                contactUsEmail(email, firstName, lastName, message, phoneNo, countrycode)
            );
            console.log('✅ Confirmation email sent to user:', email);
        } catch (error) {
            console.log('❌ Error sending confirmation email to user:', error.message);
            // Continue even if user email fails
        }

        // Send notification email to admin
        try {
            await mailSender(
                ADMIN_EMAIL,
                `New Contact Form Submission from ${firstName} ${lastName || ''}`,
                adminContactNotification(email, firstName, lastName, message, phoneNo, countrycode)
            );
            console.log('✅ Notification email sent to admin:', ADMIN_EMAIL);
        } catch (error) {
            console.log('❌ Error sending notification email to admin:', error.message);
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
        console.log("❌ Error while processing contact request:", error);
        return res.status(500).json({
            success: false,
            message: "Error while processing contact request",
            error: error.message
        });
    }
};
