/**
 * @file profile.js
 * @description Profile model schema for the StudyX platform
 * @module models/profile
 * 
 * Stores additional user profile information separate from auth data.
 * Includes optional fields like gender, date of birth, about section,
 * and contact number. Referenced by User model via additionalDetails.
 */

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: String,
        trim: true
    }

});


module.exports = mongoose.model('Profile', profileSchema);