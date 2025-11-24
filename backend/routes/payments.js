const express = require('express');
const router = express.Router();

const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    checkPaymentStatus
} = require('../controllers/payments');
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth');

// Razorpay QR payment routes
router.post('/createRazorpayOrder', auth, isStudent, createRazorpayOrder);
router.post('/verifyRazorpayPayment', auth, isStudent, verifyRazorpayPayment);
router.get('/checkPaymentStatus/:orderId', auth, isStudent, checkPaymentStatus);

module.exports = router
