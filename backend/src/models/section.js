/**
 * @file section.js
 * @description Section model schema for the StudyX platform
 * @module models/section
 * 
 * Represents a chapter/section within a course. Each section has a name
 * and contains multiple subsections (lectures). Sections are referenced
 * by the Course model's courseContent array.
 */

const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubSection',
            required:true
        }
    ]

});

module.exports = mongoose.model('Section', sectionSchema);
