/**
 * @file user.js
 * @description User model schema for the StudyX platform
 * @module models/user
 * 
 * Defines the user document structure including personal info (name, email),
 * authentication data (password, googleId), account type (Student/Instructor/Admin),
 * enrolled courses, course progress tracking, and profile image URL.
 */

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: false,
            trim: true,
            default: ''
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: false  // Optional for Google OAuth users
        },
        googleId: {
            type: String,
            default: null
        },
        accountType: {
            type: String,
            enum: ['Admin', 'Instructor', 'Student'],
            reuired: true
        },
        active: {
            type: Boolean,
            default: true,
        },
        approved: {
            type: Boolean,
            default: true,
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
            required: true
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        image: {
            type: String,
            required: true
        },
        token: {
            type: String
        },
        resetPasswordTokenExpires: {
            type: Date
        },
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'CourseProgress'

            }
        ]
    },// Add timestamps for when the document is created and last modified
    { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);