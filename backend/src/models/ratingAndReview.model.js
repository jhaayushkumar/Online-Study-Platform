const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    review: {
        type: String,
        required: [true, 'Review is required']
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    }
}, {
    timestamps: true
});

// Compound index to ensure one review per user per course
ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('RatingAndReview', ratingAndReviewSchema);
