const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    completedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSection'
    }]
}, {
    timestamps: true
});

// Compound index for faster queries
courseProgressSchema.index({ courseID: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('CourseProgress', courseProgressSchema);
