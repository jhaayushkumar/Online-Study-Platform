const express = require('express');
const router = express.Router();

// Import controllers from old structure (they still work with old models)
// These will be gradually migrated to new structure
const path = require('path');

// Use old controllers that reference old models
const courseController = require(path.join(__dirname, '../../controllers/course'));
const categoryController = require(path.join(__dirname, '../../controllers/category'));
const sectionController = require(path.join(__dirname, '../../controllers/section'));
const subSectionController = require(path.join(__dirname, '../../controllers/subSection'));
const ratingController = require(path.join(__dirname, '../../controllers/ratingAndReview'));
const progressController = require(path.join(__dirname, '../../controllers/courseProgress'));

const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth.middleware');

// ==================== Course Routes ====================

// Public routes
router.get('/getAllCourses', courseController.getAllCourses);
router.post('/getCourseDetails', courseController.getCourseDetails);

// Instructor routes
router.post('/createCourse', auth, isInstructor, courseController.createCourse);
router.post('/editCourse', auth, isInstructor, courseController.editCourse);
router.delete('/deleteCourse', auth, isInstructor, courseController.deleteCourse);
router.get('/getInstructorCourses', auth, isInstructor, courseController.getInstructorCourses);
router.post('/getFullCourseDetails', auth, courseController.getFullCourseDetails);

// ==================== Section Routes ====================

router.post('/addSection', auth, isInstructor, sectionController.createSection);
router.post('/updateSection', auth, isInstructor, sectionController.updateSection);
router.post('/deleteSection', auth, isInstructor, sectionController.deleteSection);

// ==================== SubSection Routes ====================

router.post('/addSubSection', auth, isInstructor, subSectionController.createSubSection);
router.post('/updateSubSection', auth, isInstructor, subSectionController.updateSubSection);
router.post('/deleteSubSection', auth, isInstructor, subSectionController.deleteSubSection);

// ==================== Category Routes ====================

router.get('/showAllCategories', categoryController.showAllCategories);
router.post('/createCategory', auth, isAdmin, categoryController.createCategory);
router.post('/getCategoryPageDetails', categoryController.getCategoryPageDetails);

// ==================== Rating & Review Routes ====================

router.get('/getReviews', ratingController.getAllRatingReview);
router.get('/getAverageRating', ratingController.getAverageRating);
router.post('/createRating', auth, isStudent, ratingController.createRating);

// ==================== Progress Routes ====================

router.post('/updateCourseProgress', auth, isStudent, progressController.updateCourseProgress);

module.exports = router;
