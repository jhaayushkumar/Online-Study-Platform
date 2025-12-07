const Stripe = require('stripe');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
require('dotenv').config();

const User = require('../models/user');
const Course = require('../models/course');
const CourseProgress = require("../models/courseProgress");

const { default: mongoose } = require('mongoose');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================ Enroll Students to Course After Payment ================
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({ success: false, message: "Please Provide data for Courses or UserId" });
    }

    console.log(`📚 Enrolling student in ${courses.length} course(s)...`);

    for (const courseId of courses) {
        try {
            // Find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            );

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not Found" });
            }
            console.log(`✅ Student enrolled in course: ${enrolledCourse.courseName}`);

            // Initialize course progress with 0 percent
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            });
            console.log('📊 Course progress initialized');

            // Find the student and add the course to their list of enrolled courses
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

            console.log(`👤 Updated student profile: ${enrolledStudent.firstName} ${enrolledStudent.lastName}`);

            // Send an email notification to the enrolled student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            );
            console.log(`📧 Enrollment email sent to: ${enrolledStudent.email}`);
        }
        catch (error) {
            console.log('❌ Enrollment error:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    console.log('🎉 All enrollments completed successfully!');
};

// ================ Create Stripe Checkout Session ================
exports.createStripeCheckout = async (req, res) => {
    const { coursesId } = req.body;
    const userId = req.user.id;

    console.log('🎯 Creating Stripe Checkout Session');
    console.log('Courses:', coursesId);
    console.log('User ID:', userId);

    if (!coursesId || coursesId.length === 0) {
        return res.status(400).json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;
    let courseDetails = [];

    // Fetch course details and calculate total
    for (const course_id of coursesId) {
        try {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            // Check if already enrolled
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
        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: courseDetails.map(course => ({
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: course.name,
                    },
                    unit_amount: course.price * 100, // amount in paise
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

        console.log('✅ Stripe Checkout Session Created:', session.id);
        console.log('💰 Amount:', totalAmount, 'INR');

        res.status(200).json({
            success: true,
            sessionId: session.id,
            checkoutUrl: session.url,
            amount: totalAmount,
            message: 'Stripe checkout session created successfully'
        });

    } catch (error) {
        console.log('❌ Stripe Checkout Error:', error.message);
        return res.status(500).json({
            success: false,
            message: "Could not create Stripe checkout session",
            error: error.message
        });
    }
};

// ================ Verify Stripe Payment ================
exports.verifyStripePayment = async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.user.id;

    console.log('🔍 Verifying Stripe Payment...');
    console.log('Session ID:', sessionId);
    console.log('User ID:', userId);

    if (!sessionId) {
        return res.status(400).json({
            success: false,
            message: "Missing session ID"
        });
    }

    try {
        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log('Session Status:', session.payment_status);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }

        // Verify userId matches
        if (session.metadata.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        const coursesId = JSON.parse(session.metadata.coursesId);
        console.log('✅ Payment verified!');
        console.log('📚 Enrolling in courses:', coursesId);

        // Enroll student
        await enrollStudents(coursesId, userId, res);

        return res.status(200).json({
            success: true,
            message: "Payment Verified and Enrollment Successful"
        });

    } catch (error) {
        console.log('❌ Stripe verification error:', error.message);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
};

// ================ Stripe Webhook Handler ================
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log('❌ Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        console.log('💳 Payment successful via webhook:', session.id);
        console.log('User ID:', session.metadata.userId);

        // You can optionally enroll here as well for redundancy
        // But we're handling it in verifyStripePayment for now
    }

    res.json({ received: true });
};

// ================ Create UPI Payment Order ================
exports.createUPIOrder = async (req, res) => {
    const { coursesId } = req.body;
    const userId = req.user.id;

    console.log('🎯 Creating UPI Payment Order');
    console.log('Courses:', coursesId);
    console.log('User ID:', userId);

    if (!coursesId || coursesId.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;
    let courseNames = [];

    for (const course_id of coursesId) {
        try {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            // Check if already enrolled
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
            courseNames.push(course.courseName);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    try {
        // Generate order ID
        const orderId = `ORDER_${Date.now()}_${userId}`;

        // Get user details
        const user = await User.findById(userId);

        // Create UPI intent string for QR code
        const upiId = process.env.UPI_ID || 'studyx@upi';
        const upiIntent = `upi://pay?pa=${upiId}&pn=StudyX&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Course Payment - ' + courseNames.join(', '))}&tr=${orderId}`;

        console.log('✅ UPI Order Created:', orderId);
        console.log('💰 Amount:', totalAmount, 'INR');

        res.status(200).json({
            success: true,
            orderId: orderId,
            amount: totalAmount,
            currency: 'INR',
            upiIntent: upiIntent,
            courseNames: courseNames,
            message: 'UPI payment order created successfully',
            coursesId: coursesId,
            userId: userId
        });

    } catch (error) {
        console.log('❌ UPI Order Error:', error.message);
        return res.status(500).json({
            success: false,
            message: "Could not create UPI order",
            error: error.message
        });
    }
};

// ================ Verify Manual UPI Payment ================
exports.verifyUPIPayment = async (req, res) => {
    const { orderId, transactionId } = req.body;
    const userId = req.user.id;

    console.log('🔍 Verifying UPI Payment...');
    console.log('Order ID:', orderId);
    console.log('Transaction ID:', transactionId);
    console.log('User ID:', userId);

    if (!orderId || !transactionId) {
        return res.status(400).json({
            success: false,
            message: "Missing payment details"
        });
    }

    try {
        // Extract coursesId from orderId metadata or session
        // For now, we'll accept manual verification
        // In production, you'd verify with your payment aggregator

        // For demo purposes, we're trusting the frontend
        // In production, NEVER do this - always verify server-side

        console.log('⚠️  Manual UPI verification - For demo only');
        console.log('✅ Payment assumed successful');

        // Note: You should store the orderId with coursesId in database 
        // or pass it securely. For now, we'll return success
        // but enrollment should happen through a separate verified flow

        return res.status(200).json({
            success: true,
            message: "Payment verification initiated. Please contact support for manual verification.",
            requiresManualVerification: true
        });

    } catch (error) {
        console.log('❌ UPI verification error:', error.message);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
};
