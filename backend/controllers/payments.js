const Razorpay = require('razorpay');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
require('dotenv').config();

const User = require('../models/user');
const Course = require('../models/course');
const CourseProgress = require("../models/courseProgress")


const { default: mongoose } = require('mongoose')

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});



// ================ Razorpay QR Code Payment ================



// ================ enroll Students to course after payment ================
const enrollStudents = async (courses, userId, res) => {

    if (!courses || !userId) {
        return res.status(400).json({ success: false, message: "Please Provide data for Courses or UserId" });
    }

    console.log(`📚 Enrolling student in ${courses.length} course(s)...`);

    for (const courseId of courses) {
        try {
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true },
            )

            if (!enrolledCourse) {
                return res.status(500).json({ success: false, message: "Course not Found" });
            }
            console.log(`✅ Student enrolled in course: ${enrolledCourse.courseName}`);

            // Initialize course progress with 0 percent
            const courseProgress = await CourseProgress.create({
                courseID: courseId,
                userId: userId,
                completedVideos: [],
            })
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
            )

            console.log(`👤 Updated student profile: ${enrolledStudent.firstName} ${enrolledStudent.lastName}`);

            // Send an email notification to the enrolled student
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )
            console.log(`📧 Enrollment email sent to: ${enrolledStudent.email}`);
        }
        catch (error) {
            console.log('❌ Enrollment error:', error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    console.log('🎉 All enrollments completed successfully!');
}



exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({ success: false, message: "Please provide all the fields" });
    }

    try {
        // find student
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
                amount / 100, orderId, paymentId)
        )
    }
    catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({ success: false, message: "Could not send email" })
    }
}


// ================ verify Signature ================
// exports.verifySignature = async (req, res) => {
//     const webhookSecret = '12345678';

//     const signature = req.headers['x-rajorpay-signature'];

//     const shasum = crypto.createHmac('sha256', webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest('hex');


//     if (signature === digest) {
//         console.log('Payment is Authorized');

//         const { courseId, userId } = req.body.payload.payment.entity.notes;

//         try {
//             const enrolledCourse = await Course.findByIdAndUpdate({ _id: courseId },
//                 { $push: { studentsEnrolled: userId } },
//                 { new: true });

//             // wrong upper ?

//             if (!enrolledCourse) {
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Course not found'
//                 });
//             }

//             // add course id to user course list
//             const enrolledStudent = await User.findByIdAndUpdate(userId,
//                 { $push: { courses: courseId } },
//                 { new: true });

//             // send enrolled mail

//             // return response
//             res.status(200).json({
//                 success: true,
//                 message: 'Signature Verified and Course Added'
//             })
//         }

//         catch (error) {
//             console.log('Error while verifing rajorpay signature');
//             console.log(error);
//             return res.status(500).json({
//                 success: false,
//                 error: error.messsage,
//                 message: 'Error while verifing rajorpay signature'
//             });
//         }
//     }

//     else {
//         return res.status(400).json({
//             success: false,
//             message: 'Invalid signature'
//         });
//     }
// }


// ================ Razorpay QR Code Payment ================

// Create Razorpay Order for QR Payment
exports.createRazorpayOrder = async (req, res) => {
    const { coursesId } = req.body;
    const userId = req.user.id;

    console.log('🎯 Creating Razorpay Order for QR Payment');
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
        // Create Razorpay order
        const options = {
            amount: totalAmount * 100, // amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: userId,
                coursesId: JSON.stringify(coursesId),
                courseNames: courseNames.join(', ')
            }
        };

        const order = await razorpay.orders.create(options);

        console.log('✅ Razorpay Order Created:', order.id);
        console.log('💰 Amount:', totalAmount, 'INR');

        // Get user details for UPI intent
        const user = await User.findById(userId);

        // Create UPI intent string for QR code
        const upiIntent = `upi://pay?pa=${process.env.UPI_ID || 'merchant@upi'}&pn=StudyX&am=${totalAmount}&cu=INR&tn=${encodeURIComponent('Course Payment - ' + courseNames.join(', '))}&tr=${order.id}`;

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: totalAmount,
            currency: 'INR',
            upiIntent: upiIntent,
            courseNames: courseNames,
            message: 'Razorpay order created successfully'
        });

    } catch (error) {
        console.log('❌ Razorpay Order Error:', error.message);
        return res.status(500).json({
            success: false,
            message: "Could not create Razorpay order",
            error: error.message
        });
    }
};


// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {
    const { orderId, paymentId, signature } = req.body;
    const userId = req.user.id;

    console.log('🔍 Verifying Razorpay Payment...');
    console.log('Order ID:', orderId);
    console.log('Payment ID:', paymentId);
    console.log('User ID:', userId);

    if (!orderId || !paymentId || !signature) {
        return res.status(400).json({
            success: false,
            message: "Missing payment details"
        });
    }

    try {
        // Verify signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(orderId + '|' + paymentId)
            .digest('hex');

        if (generatedSignature !== signature) {
            console.log('❌ Invalid payment signature');
            return res.status(400).json({
                success: false,
                message: "Payment verification failed - Invalid signature"
            });
        }

        // Fetch order details to get course IDs
        const order = await razorpay.orders.fetch(orderId);
        const coursesId = JSON.parse(order.notes.coursesId);

        console.log('✅ Payment signature verified!');
        console.log('📚 Enrolling in courses:', coursesId);

        // Enroll student
        await enrollStudents(coursesId, userId, res);

        return res.status(200).json({
            success: true,
            message: "Payment Verified and Enrollment Successful"
        });

    } catch (error) {
        console.log('❌ Razorpay verification error:', error.message);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message
        });
    }
};


// Check Payment Status (for polling)
exports.checkPaymentStatus = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await razorpay.orders.fetch(orderId);

        // Fetch payments for this order
        const payments = await razorpay.orders.fetchPayments(orderId);

        const isPaid = payments.items && payments.items.length > 0 &&
            payments.items[0].status === 'captured';

        res.status(200).json({
            success: true,
            isPaid: isPaid,
            orderStatus: order.status,
            paymentDetails: isPaid ? payments.items[0] : null
        });

    } catch (error) {
        console.log('❌ Status check error:', error.message);
        return res.status(500).json({
            success: false,
            message: "Could not check payment status",
            error: error.message
        });
    }
};