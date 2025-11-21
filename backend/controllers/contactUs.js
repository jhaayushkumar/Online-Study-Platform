const mailSender = require('../utils/mailSender');
const { contactUsEmail } = require('../mail/templates/contactFormRes');

// ================ CONTACT US ================
exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNo, message, countrycode } = req.body;

        // Validation
        if (!firstName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all required fields'
            });
        }

        // Send email to user
        try {
            const emailRes = await mailSender(
                email,
                "Your Data sent successfully",
                contactUsEmail(email, firstName, lastName, message, phoneNo, countrycode)
            );
            console.log("Email Res ", emailRes);
        } catch (error) {
            console.log("Error while sending email ", error);
            return res.status(500).json({
                success: false,
                message: "Error while sending email"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        console.log("Error while contacting us");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while processing contact request",
            error: error.message
        });
    }
};
