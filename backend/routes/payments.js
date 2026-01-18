const express = require('express');
const router = express.Router();

const {
    createStripeCheckout,
    verifyStripePayment,
    handleStripeWebhook,
    createUPIOrder,
    verifyUPIPayment,
    checkPaymentStatus
} = require('../controllers/stripePayments');
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth');

// Stripe payment routes
router.post('/createStripeCheckout', auth, isStudent, createStripeCheckout);
router.post('/verifyStripePayment', auth, isStudent, verifyStripePayment);

// UPI payment routes
router.post('/createUPIOrder', auth, isStudent, createUPIOrder);
router.post('/verifyUPIPayment', auth, isStudent, verifyUPIPayment);
router.get('/checkPaymentStatus/:orderId', auth, checkPaymentStatus);

// Webhook endpoint (no auth middleware, Stripe will verify via signature)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router
