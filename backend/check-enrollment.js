require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/course');
const User = require('./models/user');

async function checkEnrollment() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Database connected\n');

        // Get email from command line
        const email = process.argv[2];
        
        if (!email) {
            console.log('❌ Please provide email address');
            console.log('Usage: node check-enrollment.js <email>');
            process.exit(1);
        }

        // Find user
        const user = await User.findOne({ email }).populate('courses', 'courseName');
        if (!user) {
            console.log('❌ User not found:', email);
            process.exit(1);
        }

        console.log('👤 User:', user.firstName, user.lastName);
        console.log('📧 Email:', user.email);
        console.log('👥 Role:', user.accountType);
        console.log('🆔 User ID:', user._id);
        console.log('');

        // Get all courses and check enrollment
        const allCourses = await Course.find().select('courseName studentsEnrolled');
        
        console.log('📚 Course Enrollment Status:\n');
        allCourses.forEach((course, i) => {
            const isEnrolled = course.studentsEnrolled.some(id => id.equals(user._id));
            console.log(`${i + 1}. ${course.courseName}`);
            console.log(`   ${isEnrolled ? '✅ Enrolled' : '❌ Not Enrolled'}`);
            console.log(`   Course ID: ${course._id}`);
            console.log('');
        });

        if (user.accountType === 'Student') {
            console.log('💡 To enroll this student in all courses, run:');
            console.log(`   node enroll-student-test.js ${email}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkEnrollment();
