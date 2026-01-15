const express = require('express');
const router = express.Router();

// Import controller (using old controller)
const paymentController = require('../../controllers/stripePayments');
const { auth, isStudent } = require('../middleware/auth.middleware');

// Stripe payment routes
router.post('/createStripeCheckout', auth, isStudent, paymentController.createStripeCheckout);
router.post('/verifyStripePayment', auth, isStudent, paymentController.verifyStripePayment);

// UPI payment routes
router.post('/createUPIOrder', auth, isStudent, paymentController.createUPIOrder);
router.post('/verifyUPIPayment', auth, isStudent, paymentController.verifyUPIPayment);

// Webhook (no auth - Stripe verifies via signature)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;
