/**
 * @file courseProgress.js
 * @description Course Progress model schema for the StudyX platform
 * @module models/courseProgress
 * 
 * Tracks learning progress for each user-course combination.
 * Stores array of completed video (subsection) IDs to calculate
 * progress percentage and enable resume functionality.
 */

const mongoose = require("mongoose")

const courseProgressSchema = new mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        },
    ],
})



module.exports = mongoose.model("CourseProgress", courseProgressSchema)

