const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true
    },
    courseDescription: {
        type: String,
        required: [true, 'Course description is required']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReview'
    }],
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    thumbnail: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tag: [{
        type: String
    }],
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    instructions: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    }
}, {
    timestamps: true
});

// Indexes
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1 });

module.exports = mongoose.model('Course', courseSchema);
