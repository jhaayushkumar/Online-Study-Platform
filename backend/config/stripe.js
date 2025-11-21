const stripe = require('stripe');
require('dotenv').config();

// Initialize Stripe with secret key (only if key is provided)
exports.instance = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_dummy_key' 
    ? stripe(process.env.STRIPE_SECRET_KEY)
    : null;