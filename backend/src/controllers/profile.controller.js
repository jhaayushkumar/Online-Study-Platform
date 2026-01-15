/**
 * @file profile.controller.js
 * @description User profile controller for the StudyX platform (new structure)
 * @module src/controllers/profile.controller
 * 
 * Manages user profile operations including fetching user details,
 * updating profile information and images, deleting accounts,
 * getting enrolled courses with progress, and instructor dashboard analytics.
 */

const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const CourseProgress = require('../models/courseProgress.model');
const Course = require('../models/course.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.service');
const { convertSecondsToDuration } = require('../utils/duration.util');

/**
 * Get user details
 */
exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findById(userId)
            .populate('additionalDetails')
            .select('-password');

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: userDetails,
            message: 'User details fetched successfully'
        });
    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user details',
            error: error.message
        });
    }
};

/**
 * Update profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const { gender, dateOfBirth, about, contactNumber, firstName, lastName } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        await user.save();

        // Update profile fields
        const profile = await Profile.findById(user.additionalDetails);
        if (profile) {
            if (gender !== undefined) profile.gender = gender;
            if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth;
            if (about !== undefined) profile.about = about;
            if (contactNumber !== undefined) profile.contactNumber = contactNumber;
            await profile.save();
        }

        const updatedUser = await User.findById(userId)
            .populate('additionalDetails')
            .select('-password');

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

/**
 * Update profile image
 */
exports.updateProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileImage = req.files?.profileImage || req.files?.displayPicture;

        if (!profileImage) {
            return res.status(400).json({
                success: false,
                message: 'Profile image is required'
            });
        }

        const uploadResult = await uploadToCloudinary(
            profileImage,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        if (!uploadResult?.secure_url) {
            return res.status(500).json({
                success: false,
                message: 'Failed to upload image'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { image: uploadResult.secure_url },
            { new: true }
        ).populate('additionalDetails').select('-password');

        res.status(200).json({
            success: true,
            data: updatedUser,
            message: 'Profile image updated successfully'
        });
    } catch (error) {
        console.error('Update profile image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile image',
            error: error.message
        });
    }
};

/**
 * Delete account
 */
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete profile image from Cloudinary
        if (user.image && !user.image.includes('dicebear')) {
            await deleteFromCloudinary(user.image);
        }

        // Remove user from enrolled courses
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(courseId, {
                $pull: { studentsEnrolled: userId }
            });
        }

        // Delete profile
        await Profile.findByIdAndDelete(user.additionalDetails);

        // Delete user
        await User.findByIdAndDelete(userId);

        res.clearCookie('token').status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message
        });
    }
};

/**
 * Get enrolled courses
 */
exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        let user = await User.findById(userId)
            .populate({
                path: 'courses',
                populate: {
                    path: 'courseContent',
                    populate: { path: 'subSection' }
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user = user.toObject();

        // Calculate progress for each course
        for (let course of user.courses) {
            let totalDurationInSeconds = 0;
            let totalSubsections = 0;

            for (const section of course.courseContent) {
                for (const subSection of section.subSection) {
                    totalDurationInSeconds += parseInt(subSection.timeDuration) || 0;
                    totalSubsections++;
                }
            }

            course.totalDuration = convertSecondsToDuration(totalDurationInSeconds);

            const progress = await CourseProgress.findOne({
                courseID: course._id,
                userId
            });

            const completedVideos = progress?.completedVideos?.length || 0;
            course.progressPercentage = totalSubsections === 0 
                ? 100 
                : Math.round((completedVideos / totalSubsections) * 100 * 100) / 100;
        }

        res.status(200).json({
            success: true,
            data: user.courses
        });
    } catch (error) {
        console.error('Get enrolled courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrolled courses',
            error: error.message
        });
    }
};

/**
 * Instructor dashboard
 */
exports.instructorDashboard = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const courses = await Course.find({ instructor: instructorId });

        const courseData = courses.map(course => ({
            _id: course._id,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            totalStudentsEnrolled: course.studentsEnrolled.length,
            totalAmountGenerated: course.studentsEnrolled.length * course.price
        }));

        const totalStudents = courseData.reduce((acc, course) => acc + course.totalStudentsEnrolled, 0);
        const totalRevenue = courseData.reduce((acc, course) => acc + course.totalAmountGenerated, 0);

        res.status(200).json({
            success: true,
            data: {
                courses: courseData,
                totalCourses: courses.length,
                totalStudents,
                totalRevenue
            },
            message: 'Instructor dashboard data fetched successfully'
        });
    } catch (error) {
        console.error('Instructor dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
};
