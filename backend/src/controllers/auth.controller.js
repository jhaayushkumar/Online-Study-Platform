/**
 * @file auth.controller.js
 * @description Authentication controller for the StudyX platform (new structure)
 * @module src/controllers/auth.controller
 * 
 * Handles all authentication operations including OTP generation and verification,
 * user registration with email verification, secure login with JWT tokens,
 * password change, and password reset via email with expiring tokens.
 */

const User = require('../models/user.model');
const Profile = require('../models/profile.model');
const OTP = require('../models/otp.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../services/email.service');
const { passwordUpdated } = require('../templates/passwordUpdate.template');

/**
 * Send OTP for email verification
 */
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered with this email'
            });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Save OTP to database
        await OTP.create({ email, otp });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            // Remove in production - only for testing
            ...(process.env.NODE_ENV === 'development' && { otp })
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP',
            error: error.message
        });
    }
};

/**
 * User signup
 */
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        // Verify OTP
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
        if (!recentOtp || String(otp) !== String(recentOtp.otp)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile
        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        });

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            additionalDetails: profile._id,
            approved: accountType === 'Instructor' ? false : true,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

/**
 * User login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        let user = await User.findOne({ email }).populate('additionalDetails');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { email: user.email, id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Prepare response
        user = user.toObject();
        user.token = token;
        user.password = undefined;

        // Set cookie
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        };

        res.cookie('token', token, cookieOptions).status(200).json({
            success: true,
            user,
            token,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

/**
 * Change password
 */
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const userId = req.user.id;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
        }

        const user = await User.findById(userId);
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        // Send email notification
        try {
            await sendEmail(
                user.email,
                'Password Changed Successfully',
                passwordUpdated(user.email, `${user.firstName} ${user.lastName}`)
            );
        } catch (emailError) {
            console.error('Failed to send password change email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
};

/**
 * Request password reset token
 */
exports.resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Email not registered'
            });
        }

        // Generate reset token
        const token = crypto.randomBytes(20).toString('hex');
        
        await User.findOneAndUpdate(
            { email },
            { 
                token,
                resetPasswordTokenExpires: Date.now() + 5 * 60 * 1000 // 5 minutes
            }
        );

        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/update-password/${token}`;
        await sendEmail(
            email,
            'Password Reset Request',
            `Click here to reset your password: ${resetUrl}\n\nThis link expires in 5 minutes.`
        );

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });

    } catch (error) {
        console.error('Reset password token error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send reset email',
            error: error.message
        });
    }
};

/**
 * Reset password with token
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid reset token'
            });
        }

        if (user.resetPasswordTokenExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Reset token has expired'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
            { token },
            { 
                password: hashedPassword,
                token: null,
                resetPasswordTokenExpires: null
            }
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password',
            error: error.message
        });
    }
};

/**
 * Logout
 */
exports.logout = (req, res) => {
    res.clearCookie('token').status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
