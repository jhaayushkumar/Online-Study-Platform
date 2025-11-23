// Google OAuth Login
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, given_name, family_name, picture, sub: googleId } = payload;

        // Check if user already exists
        let user = await User.findOne({ email }).populate('additionalDetails');

        if (!user) {
            // Create new user
            const profileDetails = await Profile.create({
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: null
            });

            user = await User.create({
                firstName: given_name,
                lastName: family_name || '',
                email: email,
                password: null, // Google users don't need password
                accountType: 'Student', // Default account type
                additionalDetails: profileDetails._id,
                approved: true,
                image: picture,
                googleId: googleId
            });

            // Populate additionalDetails for response
            user = await User.findById(user._id).populate('additionalDetails');
        }

        // Generate JWT token
        const jwtPayload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        };

        const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        user = user.toObject();
        user.token = authToken;
        user.password = undefined;

        // Set cookie
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true
        };

        res.cookie('token', authToken, cookieOptions).status(200).json({
            success: true,
            user,
            token: authToken,
            message: 'Google login successful'
        });

    } catch (error) {
        console.log('Error during Google login:', error);
        res.status(500).json({
            success: false,
            message: 'Google login failed',
            error: error.message
        });
    }
};
