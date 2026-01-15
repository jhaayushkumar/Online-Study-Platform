const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say', null]
    },
    dateOfBirth: {
        type: String
    },
    about: {
        type: String,
        trim: true,
        maxlength: [500, 'About cannot exceed 500 characters']
    },
    contactNumber: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
