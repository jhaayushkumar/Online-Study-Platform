const express = require('express');
const router = express.Router();

// Import controller (using old controller)
const contactController = require('../../controllers/contactUs');

// Contact form route
router.post('/contact', contactController.contactUs);

module.exports = router;
