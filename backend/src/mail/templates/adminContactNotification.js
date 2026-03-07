exports.adminContactNotification = (email, firstName, lastName, message, phoneNo, countrycode) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${firstName} ${lastName || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${countrycode || ''} ${phoneNo || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${message}</p>
    </body>
    </html>`;
};
