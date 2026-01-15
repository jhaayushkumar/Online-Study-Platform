const express = require('express');
const router = express.Router();

// Use old profile controller
const profileController = require('../../controllers/profile');

// Old middleware
const { auth, isInstructor } = require('../../middleware/auth');

// Profile routes
router.get('/getUserDetails', auth, profileController.getUserDetails);
router.put('/updateProfile', auth, profileController.updateProfile);
router.put('/updateUserProfileImage', auth, profileController.updateUserProfileImage);
router.delete('/deleteProfile', auth, profileController.deleteAccount);

// Student routes
router.get('/getEnrolledCourses', auth, profileController.getEnrolledCourses);

// Instructor routes
router.get('/instructorDashboard', auth, isInstructor, profileController.instructorDashboard);

module.exports = router;
