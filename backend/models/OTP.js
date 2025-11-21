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
        expires: 5 * 60, // The document will be automatically deleted after 5 minutes of its creation time
    }

});

//  function to send email
async function sendVerificationEmail(email, otp) {
    try {
        console.log('📧 Attempting to send OTP email to:', email);
        console.log('🔢 OTP:', otp);
        
        // Extract name from email
        const name = email.split('@')[0].split('.').map(part => part.replace(/\d+/g, '')).join(' ');
        
        const emailBody = emailTemplate(otp, name);
        const mailResponse = await mailSender(
            email, 
            'Verification Email from StudyX', 
            emailBody
        );
        
        console.log('✅ OTP Email sent successfully to:', email);
        return mailResponse;
    }
    catch (error) {
        console.log('❌ Error while sending OTP email to:', email);
        console.log('Error:', error.message);
        throw error;
    }
}

// pre middleware
OTPSchema.pre('save', async function(next) {
    console.log("📝 New OTP document being saved");

    // Only send an email when a new document is created
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
})



module.exports = mongoose.model('OTP', OTPSchema);