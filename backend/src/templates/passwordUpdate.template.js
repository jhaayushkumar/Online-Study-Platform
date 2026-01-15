const passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Updated</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>StudyX</h1>
            <p>Password Updated</p>
        </div>
        <div class="content">
            <p>Hi ${name || 'there'},</p>
            <div class="alert">
                <strong>Your password has been successfully updated.</strong>
            </div>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <p>Email: ${email}</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} StudyX. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};

module.exports = { passwordUpdated };
