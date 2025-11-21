require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/course');
const User = require('./models/user');

async function enrollStudent() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('✅ Database connected\n');

        // Get student email from command line or use default
        const studentEmail = process.argv[2] || 'amit.verma@example.com';
        
        // Find student
        const student = await User.findOne({ email: studentEmail });
        if (!student) {
            console.log('❌ Student not found:', studentEmail);
            process.exit(1);
        }
        console.log('👤 Student found:', student.firstName, student.lastName);
        console.log('📧 Email:', student.email);
        console.log('🆔 Student ID:', student._id);
        console.log('');

        // Get all courses
        const courses = await Course.find().select('courseName studentsEnrolled');
        console.log('📚 Available Courses:');
        courses.forEach((course, i) => {
            const isEnrolled = course.studentsEnrolled.includes(student._id);
            console.log(`${i + 1}. ${course.courseName} ${isEnrolled ? '✅ (Enrolled)' : '❌ (Not Enrolled)'}`);
        });
        console.log('');

        // Enroll student in all courses
        console.log('🔄 Enrolling student in all courses...\n');
        
        for (const course of courses) {
            if (!course.studentsEnrolled.includes(student._id)) {
                await Course.findByIdAndUpdate(
                    course._id,
                    { $addToSet: { studentsEnrolled: student._id } }
                );
                console.log(`✅ Enrolled in: ${course.courseName}`);
            } else {
                console.log(`⏭️  Already enrolled in: ${course.courseName}`);
            }
        }

        // Update user's courses
        const courseIds = courses.map(c => c._id);
        await User.findByIdAndUpdate(
            student._id,
            { $addToSet: { courses: { $each: courseIds } } }
        );

        console.log('\n✅ Student successfully enrolled in all courses!');
        console.log('\n📝 Now the student can add reviews to any course.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

enrollStudent();
