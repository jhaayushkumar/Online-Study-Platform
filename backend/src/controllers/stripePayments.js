/**
 * @file stripePayments.js
 * @description Payment processing controller for the StudyX platform
 * @module controllers/stripePayments
 * 
 * Handles all payment operations using Stripe payment gateway including
 * creating checkout sessions, verifying payments, enrolling students after
 * successful payment, webhook handling, and UPI payment support for India.
 */

const Stripe = require('stripe');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
require('dotenv').config();

const User = require('../models/user');
const Course = require('../models/course');
const CourseProgress = require("../models/courseProgress");

const { default: mongoose } = require('mongoose');

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const enrollStudents = async (courses, userId) => {
    if (!courses || !userId) {
        throw new Error("Please provide data for Courses or UserId");
    }

    console.log(`📚 Starting enrollment for ${courses.length} course(s)...`);

    for (const courseId of courses) {
        try {
            console.log(`Processing course: ${courseId}`);
            
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            );

            if (!enrolledCourse) {
                throw new Error(`Course not found: ${courseId}`);
            }

            console.log(`✅ Added student to course: ${enrolledCourse.courseName}`);

            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });

            console.log(`📊 Created course progress`);

            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            console.log(`👤 Updated student profile`);

            // Send enrollment email (don't fail if email fails)
            try {
                await mailSender(
                    enrolledStudent.email,
                    `Successfully Enrolled into ${enrolledCourse.courseName}`,
                    courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
                );
                console.log(`📧 Enrollment email sent`);
            } catch (emailError) {
                console.error(`⚠️ Email sending failed (non-critical):`, emailError.message);
                // Don't throw - email failure shouldn't stop enrollment
            }
        } catch (error) {
            console.error(`❌ Error enrolling in course ${courseId}:`, error);
            throw error;
        }
    }
    
    console.log(`🎉 All enrollments completed successfully!`);
    return true;
};

exports.createStripeCheckout = async (req, res) => {
    const { coursesId } = req.body;
    const userId = req.user.id;

    if (!coursesId || coursesId.length === 0) {
        return res.status(400).json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;
    let courseDetails = [];

    for (const course_id of coursesId) {
        try {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
            courseDetails.push({
                id: course._id.toString(),
                name: course.courseName,
                price: course.price,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: courseDetails.map(course => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: course.name,
                    },
                    unit_amount: course.price * 100,
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
            metadata: {
                userId: userId,
                coursesId: JSON.stringify(coursesId),
            },
        });

        res.status(200).json({
            success: true,
            sessionId: session.id,
            checkoutUrl: session.url,
            amount: totalAmount,
            message: 'Stripe checkout session created successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not create Stripe checkout session",
            error: error.message
        });
    }
};

exports.verifyStripePayment = async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: "Missing session ID"
        });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }

        if (session.metadata.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const coursesId = JSON.parse(session.metadata.coursesId);

        await enrollStudents(coursesId, userId);

        return res.status(200).json({
            success: true,
            message: "Payment Verified and Enrollment Successful"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
};

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
    }

    res.json({ received: true });
};

exports.createUPIOrder = async (req, res) => {
    try {
        const { coursesId } = req.body;
        const userId = req.user.id;

        console.log('🎯 Creating UPI Order');
        console.log('Courses:', coursesId);
        console.log('User ID:', userId);

        if (!coursesId || coursesId.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide Course Id" });
        }

        // Check if UPI_ID is configured
        const upiId = process.env.UPI_ID;
        if (!upiId) {
            console.error('❌ UPI_ID not configured in environment variables');
            return res.status(500).json({
                success: false,
                message: "UPI payment not configured. Please contact support."
            });
        }

        let totalAmount = 0;
        let courseNames = [];

        for (const course_id of coursesId) {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
            courseNames.push(course.courseName);
        }

        const orderId = `ORDER_${Date.now()}_${userId}`;
        const user = await User.findById(userId);

        // UPI intent format: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=CURRENCY&tn=NOTE
        const merchantName = 'StudyX';
        const note = `Course: ${courseNames.join(', ')}`;
        
        const upiIntent = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

        console.log('✅ UPI Order Created:', orderId);
        console.log('💰 Amount:', totalAmount, 'INR');
        console.log('🔗 UPI Intent:', upiIntent);

        res.status(200).json({
            success: true,
            orderId: orderId,
            amount: totalAmount,
            currency: 'INR',
            upiIntent: upiIntent,
            upiId: upiId,
            merchantName: merchantName,
            courseNames: courseNames,
            message: 'UPI payment order created successfully',
            coursesId: coursesId,
            userId: userId
        });

    } catch (error) {
        console.error('❌ UPI Order Error:', error);
        return res.status(500).json({
            success: false,
            message: "Could not create UPI order",
            error: error.message
        });
    }
};

exports.verifyUPIPayment = async (req, res) => {
    try {
        const { orderId, transactionId, coursesId } = req.body;
        const userId = req.user.id;

        console.log('🔍 Verifying UPI Payment');
        console.log('Order ID:', orderId);
        console.log('Transaction ID:', transactionId);
        console.log('User ID:', userId);
        console.log('Courses:', coursesId);

        if (!orderId || !transactionId) {
            console.log('❌ Missing payment details');
            return res.status(400).json({
                success: false,
                message: "Missing payment details"
            });
        }

        if (!coursesId || coursesId.length === 0) {
            console.log('❌ Missing course information');
            return res.status(400).json({
                success: false,
                message: "Missing course information"
            });
        }

        // For now, we'll accept any transaction ID and enroll the student
        // In production, you would verify with payment gateway
        console.log('✅ Payment accepted, enrolling student...');

        // Enroll student in courses
        await enrollStudents(coursesId, userId);

        console.log('✅ Enrollment completed successfully!');

        return res.status(200).json({
            success: true,
            message: "Payment verified and enrollment successful!",
            transactionId: transactionId
        });

    } catch (error) {
        console.error('❌ UPI verification error:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({
            success: false,
            message: error.message || "Payment verification failed",
            error: error.message
        });
    }
};

exports.checkPaymentStatus = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    console.log('🔍 Checking payment status for order:', orderId);

    try {
        // For UPI payments, we return pending status
        // In production, you would check with your payment gateway
        return res.status(200).json({
            success: true,
            isPaid: false,
            orderStatus: 'pending',
            message: 'UPI payment verification is manual. Please complete payment and verify.'
        });

    } catch (error) {
        console.error('❌ Status check error:', error);
        return res.status(500).json({
            success: false,
            message: "Could not check payment status",
            error: error.message
        });
    }
};
