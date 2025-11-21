require('dotenv').config();
const mailSender = require('./utils/mailSender');

async function testEmail() {
    console.log('🧪 Testing Email Configuration...\n');
    
    console.log('📋 Configuration:');
    console.log('MAIL_HOST:', process.env.MAIL_HOST);
    console.log('MAIL_USER:', process.env.MAIL_USER);
    console.log('MAIL_FROM:', process.env.MAIL_FROM);
    console.log('MAIL_PASS:', process.env.MAIL_PASS ? '***configured***' : 'NOT SET');
    console.log('\n');

    try {
        const testEmail = 'jha44481@gmail.com'; // Change this to your email
        const testOTP = '123456';
        
        console.log('📧 Sending test email to:', testEmail);
        
        const emailBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Test Email from StudyX</h2>
                <p>This is a test email to verify your email configuration.</p>
                <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Test OTP: ${testOTP}</h3>
                </div>
                <p>If you received this email, your email configuration is working correctly!</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    MAIL_HOST: ${process.env.MAIL_HOST}<br>
                    MAIL_USER: ${process.env.MAIL_USER}<br>
                    MAIL_FROM: ${process.env.MAIL_FROM}
                </p>
            </div>
        `;
        
        const result = await mailSender(
            testEmail,
            'Test Email - StudyX Email Configuration',
            emailBody
        );
        
        console.log('\n✅ SUCCESS! Email sent successfully!');
        console.log('Message ID:', result.messageId);
        console.log('\n📬 Check your inbox (and spam folder) at:', testEmail);
        
    } catch (error) {
        console.log('\n❌ ERROR! Failed to send email');
        console.log('Error:', error.message);
        console.log('\nFull error:', error);
    }
}

testEmail();
