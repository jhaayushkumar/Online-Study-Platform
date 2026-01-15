const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters'],
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password not required for Google OAuth users
        },
        minlength: [6, 'Password must be at least 6 characters']
    },
    accountType: {
        type: String,
        enum: {
            values: ['Admin', 'Instructor', 'Student'],
            message: '{VALUE} is not a valid account type'
        },
        required: [true, 'Account type is required']
    },
    active: {
        type: Boolean,
        default: true
    },
    approved: {
        type: Boolean,
        default: true
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    image: {
        type: String,
        default: function() {
            return `https://api.dicebear.com/5.x/initials/svg?seed=${this.firstName} ${this.lastName}`;
        }
    },
    // Google OAuth
    googleId: {
        type: String,
        sparse: true
    },
    // Password reset
    token: String,
    resetPasswordTokenExpires: Date,
    // Course progress
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseProgress'
    }]
}, {
    timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

module.exports = mongoose.model('User', userSchema);
