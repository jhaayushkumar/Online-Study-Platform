const express = require('express');
const router = express.Router();

// Import controller
const { contactUs } = require('../controllers/contactUs');

// Route for contact us
router.post('/contact', contactUs);

module.exports = router;
