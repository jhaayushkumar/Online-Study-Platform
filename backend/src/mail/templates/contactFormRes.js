exports.contactUsEmail = (email, firstname, lastname, message, phoneNo, countrycode) => {
    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Contact Form Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: left;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
            <a href="https://studyx.com"><img class="logo"
                    src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyX Logo"></a>
            <div class="message">Contact Form Confirmation</div>
            <div class="body">
                <p>Dear ${firstname} ${lastname},</p>
                <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
                <p><strong>Here are the details you submitted:</strong></p>
                <p><strong>Name:</strong> ${firstname} ${lastname}</p>
                <p><strong>Email:</strong> ${email}</p>
                ${phoneNo ? `<p><strong>Phone:</strong> ${countrycode} ${phoneNo}</p>` : ''}
                <p><strong>Message:</strong> ${message}</p>
            </div>
            <div class="support">If you have any further questions or need immediate assistance, please feel free to reach out to us at
                <a href="mailto:jhaayushkumar@gmail.com">jhaayushkumar@gmail.com</a>. We are here to help!
            </div>
        </div>
    </body>
    
    </html>`;
};
