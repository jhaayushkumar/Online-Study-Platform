const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const info = await transporter.sendMail({
            from: `"StudyX" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        console.log('✅ Email sent successfully to:', email);
        console.log('Message ID:', info.messageId);
        return info;
    }
    catch (error) {
        console.log('❌ Error while sending mail to:', email);
        console.log('Error details:', error.message);
        throw error;
    }
}

module.exports = mailSender;