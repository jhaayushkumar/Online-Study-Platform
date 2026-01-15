const { OAuth2Client } = require('google-auth-library');

// Google OAuth2 Configuration
const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/v1/auth/google/callback'
};

// Create OAuth2 client
const createOAuth2Client = () => {
    return new OAuth2Client(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirectUri
    );
};

// Generate Google OAuth URL
const getGoogleAuthUrl = () => {
    const client = createOAuth2Client();
    
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ];

    return client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });
};

module.exports = {
    googleConfig,
    createOAuth2Client,
    getGoogleAuthUrl
};
