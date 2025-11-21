const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('./models/category');
const Course = require('./models/course');
const User = require('./models/user');

// Connect to database
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Database connected'))
.catch((error) => {
    console.log('❌ Database connection failed');
    console.error(error);
    process.exit(1);
});

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');


        const categories = await Category.insertMany([
            {
                name: 'Web Development',
                description: 'Learn to build modern web applications'
            },
            {
                name: 'Data Science',
                description: 'Master data analysis and machine learning'
            },
            {
                name: 'Mobile Development',
                description: 'Build iOS and Android applications'
            },
            {
                name: 'Programming',
                description: 'Learn programming fundamentals'
            }
        ]);

        console.log('✅ Categories created:', categories.length);

        // Find or create a demo instructor
        let instructor = await User.findOne({ accountType: 'Instructor' });
        
        if (!instructor) {
            console.log('⚠️ No instructor found. Please create an instructor account first.');
            console.log('Seeding completed with categories only.');
            process.exit(0);
        }

        // Create sample courses
        const courses = [
            {
                courseName: 'Complete Web Development Bootcamp',
                courseDescription: 'Learn HTML, CSS, JavaScript, React, Node.js and build real-world projects',
                instructor: instructor._id,
                whatYouWillLearn: 'Build full-stack web applications from scratch',
                price: 4999,
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
                category: categories[0]._id,
                tag: ['Web Development', 'Full Stack', 'JavaScript'],
                status: 'Published',
                instructions: ['Basic computer knowledge', 'Passion to learn'],
                studentsEnrolled: [],
                sold: 150
            },
            {
                courseName: 'Python for Data Science',
                courseDescription: 'Master Python programming and data analysis with pandas, numpy, and matplotlib',
                instructor: instructor._id,
                whatYouWillLearn: 'Analyze data and build machine learning models',
                price: 3999,
                thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
                category: categories[1]._id,
                tag: ['Python', 'Data Science', 'Machine Learning'],
                status: 'Published',
                instructions: ['Basic programming knowledge'],
                studentsEnrolled: [],
                sold: 200
            },
            {
                courseName: 'React Native - Mobile App Development',
                courseDescription: 'Build iOS and Android apps using React Native and JavaScript',
                instructor: instructor._id,
                whatYouWillLearn: 'Create cross-platform mobile applications',
                price: 4499,
                thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
                category: categories[2]._id,
                tag: ['React Native', 'Mobile Development', 'JavaScript'],
                status: 'Published',
                instructions: ['JavaScript basics', 'React knowledge helpful'],
                studentsEnrolled: [],
                sold: 120
            },
            {
                courseName: 'JavaScript Mastery',
                courseDescription: 'Deep dive into JavaScript - from basics to advanced concepts',
                instructor: instructor._id,
                whatYouWillLearn: 'Master JavaScript programming language',
                price: 2999,
                thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
                category: categories[3]._id,
                tag: ['JavaScript', 'Programming', 'Web Development'],
                status: 'Published',
                instructions: ['Basic programming concepts'],
                studentsEnrolled: [],
                sold: 180
            }
        ];

        const createdCourses = await Course.insertMany(courses);
        console.log('✅ Courses created:', createdCourses.length);

        // Update categories with course references
        for (let i = 0; i < createdCourses.length; i++) {
            await Category.findByIdAndUpdate(
                createdCourses[i].category,
                { $push: { courses: createdCourses[i]._id } }
            );
        }

        console.log('✅ Categories updated with course references');
        console.log('🎉 Database seeding completed successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
