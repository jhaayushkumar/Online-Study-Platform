const express = require('express');
const router = express.Router();

// Controllers
const {
    signup,
    login,
    sendOTP,
    changePassword
} = require('../controllers/auth');

const { googleLogin } = require('../controllers/googleAuth');

// Resetpassword controllers
const {
    resetPasswordToken,
    resetPassword,
} = require('../controllers/resetPassword');


// Middleware
const { auth } = require('../middleware/auth');


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route for Google OAuth login
router.post('/google-login', googleLogin);

// Route for sending OTP to the user's email
router.post('/sendotp', sendOTP);

// Route for Changing the password
router.post('/changepassword', auth, changePassword);



// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post('/reset-password-token', resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


module.exports = router
