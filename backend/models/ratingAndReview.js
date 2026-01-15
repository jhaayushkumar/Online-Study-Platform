/**
 * @file ratingAndReview.js
 * @description Rating and Review model schema for the StudyX platform
 * @module models/ratingAndReview
 * 
 * Stores course ratings and reviews submitted by enrolled students.
 * Each review includes user reference, course reference, numeric rating,
 * and text review. Used for course quality assessment and social proof.
 */

const mongoose = require('mongoose')

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: String,
        reqired: true
    },
    review: {
        type: String,
        required: true
    },
    course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},

});

module.exports = mongoose.model('RatingAndReview', ratingAndReviewSchema);