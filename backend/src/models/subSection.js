/**
 * @file subSection.js
 * @description SubSection (Lecture) model schema for the StudyX platform
 * @module models/subSection
 * 
 * Represents individual lectures within a course section. Stores lecture
 * title, description, video URL (Cloudinary), and duration. SubSections
 * are the actual learning content that students watch.
 */

const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title: {
        type: String
    },
    timeDuration: {
        type: String
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String
    }

});

module.exports = mongoose.model('SubSection', subSectionSchema) 