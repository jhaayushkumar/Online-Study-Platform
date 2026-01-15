const mongoose = require('mongoose');
const { sendEmail } = require('../services/email.service');
const { otpEmailTemplate } = require('../templates/otpEmail.template');

const otpSchema = new mongoose.Schema({
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
        expires: 300 // Auto-delete after 5 minutes
    }
});

// Send OTP email on save
otpSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const name = this.email.split('@')[0].replace(/[0-9]/g, '');
            await sendEmail(
                this.email,
                'Email Verification - StudyX',
                otpEmailTemplate(this.otp, name)
            );
            console.log('✅ OTP email sent to:', this.email);
        } catch (error) {
            console.log('⚠️ OTP email failed, but OTP saved:', error.message);
            // Don't block save if email fails
        }
    }
    next();
});

module.exports = mongoose.model('OTP', otpSchema);
