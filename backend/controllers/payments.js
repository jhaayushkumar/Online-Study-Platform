const stripe = require('../config/stripe');
const crypto = require('crypto');
const mailSender = require('../utils/mailSender');
const { courseEnrollmentEmail } = require('../mail/templates/courseEnrollmentEmail');
require('dotenv').config();

const User = require('../models/user');
const Course = require('../models/course');
const CourseProgress = require("../models/courseProgress")


const { default: mongoose } = require('mongoose')


// ================ capture the payment and Initiate the 'Stripe payment' ================
exports.capturePayment = async (req, res) => {

    // extract courseId & userId
    const { coursesId } = req.body;
    // console.log('coursesId = ', typeof (coursesId))
    // console.log('coursesId = ', coursesId)

    const userId = req.user.id;


    if (coursesId.length === 0) {
        return res.json({ success: false, message: "Please provide Course Id" });
    }

    let totalAmount = 0;

    for (const course_id of coursesId) {
        let course;
        try {
            // valid course Details
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ success: false, message: "Could not find the course" });
            }

            // check user already enrolled the course
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(400).json({ success: false, message: "Student is already Enrolled" });
            }

            totalAmount += course.price;
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // create order
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    // initiate payment using Stripe
    try {
        const paymentIntent = await stripe.instance.paymentIntents.create({
            amount: totalAmount * 100, // amount in cents
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId,
                coursesId: JSON.stringify(coursesId)
            },
            // For demo: auto-confirm the payment
            confirm: true,
            payment_method: 'pm_card_visa', // Test payment method
            return_url: `${process.env.FRONTEND_URL}/dashboard/enrolled-courses`,
        });
        
        console.log('✅ Payment Intent Created:', paymentIntent.id);
        console.log('💰 Amount:', totalAmount, 'INR');
        console.log('👤 User ID:', userId);
        console.log('📚 Courses:', coursesId);
        
        // return response
        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            message: 'Payment initiated successfully'
        })
    }
    catch (error) {
        console.log('❌ Payment Error:', error.message);
        return res.status(500).json({ success: false, message: "Could not Initiate Order", error: error.message });
    }

}



// ================ verify the payment ================
exports.verifyPayment = async (req, res) => {
    const { paymentIntentId, coursesId } = req.body;
    const userId = req.user.id;

    console.log('🔍 Verifying Payment...');
    console.log('Payment Intent ID:', paymentIntentId);
    console.log('Courses:', coursesId);
    console.log('User ID:', userId);

    if (!paymentIntentId || !coursesId || !userId) {
        return res.status(400).json({ success: false, message: "Payment Failed, data not found" });
    }

    try {
        // Retrieve payment intent from Stripe to verify
        const paymentIntent = await stripe.instance.paymentIntents.retrieve(paymentIntentId);
        
        console.log('💳 Payment Status:', paymentIntent.status);

        // Check if payment was successful
        if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
            console.log('✅ Payment verified! Enrolling student...');
            //enroll student
            await enrollStudents(coursesId, userId, res);
            //return res
            return res.status(200).json({ success: true, message: "Payment Verified and Enrollment Successful" });
        } else {
            console.log('❌ Payment not completed. Status:', paymentIntent.status);
            return res.status(400).json({ success: false, message: `Payment not completed. Status: ${paymentIntent.status}` });
        }
    } catch (error) {
        console.log('❌ Payment verification error:', error.message);
        return res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
    }
}


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