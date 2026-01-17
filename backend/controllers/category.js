/**
 * @file category.js
 * @description Category management controller for the StudyX platform
 * @module controllers/category
 * 
 * Handles course category operations including creating new categories,
 * fetching all categories, and getting category page details with
 * associated courses, different category suggestions, and top selling courses.
 */

const Category = require('../models/category')

// get Random Integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

// ================ create Category ================
exports.createCategory = async (req, res) => {
    try {
        // extract data
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const categoryDetails = await Category.create({
            name: name, description: description
        });

        res.status(200).json({
            success: true,
            message: 'Category created successfully'
        });
    }
    catch (error) {
        console.log('Error while creating Category');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while creating Category',
            error: error.message
        })
    }
}


// ================ get All Category ================
exports.showAllCategories = async (req, res) => {
    try {
        // get all category from DB
        const allCategories = await Category.find({}, { name: true, description: true });

        // return response
        res.status(200).json({
            success: true,
            data: allCategories,
            message: 'All allCategories fetched successfully'
        })
    }
    catch (error) {
        console.log('Error while fetching all allCategories');
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error while fetching all allCategories'
        })
    }
}



// ================ Get Category Page Details ================
exports.getCategoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body

        // Get courses for the specified category (optimized with lean and select)
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" },
                select: "courseName courseDescription thumbnail price instructor studentsEnrolled ratingAndReviews",
                populate: [
                    { path: "instructor", select: "firstName lastName email image" }
                ],
            })
            .lean()
            .exec()

        if (!selectedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" })
        }

        if (selectedCategory.courses.length === 0) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories (optimized)
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        }).select('_id').lean()

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
                select: "courseName courseDescription thumbnail price instructor studentsEnrolled",
                populate: { path: "instructor", select: "firstName lastName email image" }
            })
            .lean()
            .exec()

        // Get top-selling courses (optimized - only fetch needed data)
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                select: "courseName courseDescription thumbnail price instructor studentsEnrolled",
                populate: {
                    path: "instructor",
                    select: "firstName lastName email image"
                },
            })
            .lean()
            .exec()

        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.studentsEnrolled.length - a.studentsEnrolled.length)
            .slice(0, 10)

        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}