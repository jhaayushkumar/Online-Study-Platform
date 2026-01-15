const otpEmailTemplate = (otp, name) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Verification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 10px; letter-spacing: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>StudyX</h1>
            <p>Email Verification</p>
        </div>
        <div class="content">
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for registering with StudyX. Please use the following OTP to verify your email address:</p>
            <div class="otp-box">${otp}</div>
            <p><strong>This OTP is valid for 5 minutes.</strong></p>
            <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} StudyX. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

module.exports = { otpEmailTemplate };
