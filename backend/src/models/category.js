/**
 * @file category.js
 * @description Category model schema for the StudyX platform
 * @module models/category
 * 
 * Defines course categories for organizing courses by topic.
 * Each category has a name, description, and array of course references.
 * Used for catalog pages and course filtering/discovery.
 */

const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
});

module.exports = mongoose.model('Category', categorySchema);