/**
 * @file google.controller.js
 * @description Google OAuth 2.0 authentication controller for the StudyX platform
 * @module src/controllers/google.controller
 * 
 * Handles Google authentication including generating OAuth URLs for redirect flow,
 * processing OAuth callbacks, and verifying ID tokens from frontend Google Sign-In.
 * Creates new users or links Google accounts to existing users automatically.
 */

const { OAuth2Client } = require('google-auth-library');
const User = require('../../models/user');
const Profile = require('../../models/profile');
const jwt = require('jsonwebtoken');

const getOAuth2Client = () => {
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/v1/auth/google/callback`
    );
};

exports.getGoogleAuthUrl = (req, res) => {
    try {
        const client = getOAuth2Client();
        
        const authUrl = client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ],
            prompt: 'consent',
            state: req.query.redirect || '/'
        });

        res.status(200).json({
            success: true,
            authUrl
        });
    } catch (error) {
        console.error('Get Google Auth URL error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate Google auth URL',
            error: error.message
        });
    }
};

exports.googleCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        
        if (!code) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
        }

        const client = getOAuth2Client();
        
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, given_name, family_name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email }).populate('additionalDetails');

        if (!user) {
            const profile = await Profile.create({
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: null
            });

            user = await User.create({
                firstName: given_name || 'User',
                lastName: family_name || '',
                email,
                password: null,
                accountType: 'Student',
                additionalDetails: profile._id,
                approved: true,
                image: picture || `https://api.dicebear.com/5.x/initials/svg?seed=${given_name}`,
                googleId
            });

            user = await User.findById(user._id).populate('additionalDetails');
        } else {
            // Update existing user
            let needsUpdate = false;
            
            if (!user.googleId) {
                user.googleId = googleId;
                needsUpdate = true;
            }
            
            if (picture && (!user.image || user.image.includes('dicebear'))) {
                user.image = picture;
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                await user.save();
                user = await User.findById(user._id).populate('additionalDetails');
            }
        }

        const token = jwt.sign(
            { email: user.email, id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        };

        res.cookie('token', token, cookieOptions);

        const redirectUrl = state || '/';
        res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}?token=${token}`);

    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { credential, googleId, email, firstName, lastName, image, accountType } = req.body;
        
        console.log('Google Login Request - accountType:', accountType);

        let userEmail, userFirstName, userLastName, userImage, userGoogleId, userAccountType;

        if (credential) {
            console.log('Verifying Google credential...');
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            console.log('Google payload email:', payload.email);
            userEmail = payload.email;
            userFirstName = payload.given_name || 'User';
            userLastName = payload.family_name || '';
            userImage = payload.picture;
            userGoogleId = payload.sub;
            userAccountType = accountType || 'Student';
            console.log('Setting accountType to:', userAccountType);
        } else if (googleId && email) {
            userEmail = email;
            userFirstName = firstName || 'User';
            userLastName = lastName || '';
            userImage = image;
            userGoogleId = googleId;
            userAccountType = accountType || 'Student';
        } else {
            return res.status(400).json({
                success: false,
                message: 'Google credential or user info is required'
            });
        }

        let user = await User.findOne({ email: userEmail }).populate('additionalDetails');
        
        console.log('Found existing user:', user ? 'Yes' : 'No');
        if (user) {
            console.log('Existing user accountType:', user.accountType);
            console.log('Requested accountType:', userAccountType);
        }

        if (!user) {
            const profile = await Profile.create({
                gender: null,
                dateOfBirth: null,
                about: null,
                contactNumber: null
            });

            user = await User.create({
                firstName: userFirstName || 'User',
                lastName: userLastName || '',
                email: userEmail,
                password: null,
                accountType: userAccountType,
                additionalDetails: profile._id,
                approved: true,
                image: userImage || `https://api.dicebear.com/5.x/initials/svg?seed=${userFirstName}`,
                googleId: userGoogleId
            });

            user = await User.findById(user._id).populate('additionalDetails');
        } else {
            // Update existing user
            let needsUpdate = false;
            
            if (!user.googleId) {
                user.googleId = userGoogleId;
                needsUpdate = true;
            }
            
            if (userImage && (!user.image || user.image.includes('dicebear'))) {
                user.image = userImage;
                needsUpdate = true;
            }
            
            // Update accountType if provided and different from current
            if (userAccountType && user.accountType !== userAccountType) {
                console.log(`Updating accountType from ${user.accountType} to ${userAccountType}`);
                user.accountType = userAccountType;
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                await user.save();
                user = await User.findById(user._id).populate('additionalDetails');
                console.log('User updated. New accountType:', user.accountType);
            }
        }

        console.log('Final user accountType before sending response:', user.accountType);

        const token = jwt.sign(
            { email: user.email, id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userResponse = user.toObject();
        userResponse.token = token;
        userResponse.password = undefined;

        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        };

        res.cookie('token', token, cookieOptions).status(200).json({
            success: true,
            user: userResponse,
            token,
            message: 'Google login successful'
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed',
            error: error.message
        });
    }
};
