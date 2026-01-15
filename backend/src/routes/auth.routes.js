/**
 * @file auth.routes.js
 * @description Authentication routes for the StudyX API
 * @module src/routes/auth.routes
 * 
 * Defines all authentication-related API endpoints including
 * OTP sending, user signup/login, password management,
 * and Google OAuth routes for social authentication.
 */

const express = require('express');
const router = express.Router();

const oldAuthController = require('../../controllers/auth');
const oldResetController = require('../../controllers/resetPassword');
const googleController = require('../controllers/google.controller');
const { auth } = require('../../middleware/auth');

router.post('/sendotp', oldAuthController.sendOTP);
router.post('/signup', oldAuthController.signup);
router.post('/login', oldAuthController.login);

router.post('/changepassword', auth, oldAuthController.changePassword);
router.post('/reset-password-token', oldResetController.resetPasswordToken);
router.post('/reset-password', oldResetController.resetPassword);

router.get('/google', googleController.getGoogleAuthUrl);
router.get('/google/callback', googleController.googleCallback);
router.post('/google-login', googleController.googleLogin);

module.exports = router;
