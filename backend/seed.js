const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/user');
const Profile = require('./models/profile');
const Category = require('./models/category');
const Course = require('./models/course');
const Section = require('./models/section');
const SubSection = require('./models/subSection');
const RatingAndReview = require('./models/ratingAndReview');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

// Clear existing data
const clearData = async () => {
    try {
        await User.deleteMany({});
        await Profile.deleteMany({});
        await Category.deleteMany({});
        await Course.deleteMany({});
        await Section.deleteMany({});
        await SubSection.deleteMany({});
        await RatingAndReview.deleteMany({});
        console.log('✅ Existing data cleared');
    } catch (error) {
        console.error('❌ Error clearing data:', error);
    }
};

// Seed data
const seedData = async () => {
    try {
        console.log('🌱 Starting to seed database...');

        // Create Categories
        const categories = await Category.insertMany([
            {
                name: 'Web Development',
                description: 'Learn to build modern web applications with the latest technologies'
            },
            {
                name: 'Mobile Development',
                description: 'Master mobile app development for iOS and Android'
            },
            {
                name: 'Data Science',
                description: 'Explore data analysis, machine learning, and AI'
            },
            {
                name: 'Programming Languages',
                description: 'Master various programming languages from basics to advanced'
            },
            {
                name: 'Cloud Computing',
                description: 'Learn cloud platforms like AWS, Azure, and Google Cloud'
            },
            {
                name: 'DevOps',
                description: 'Master DevOps practices and tools for modern software development'
            }
        ]);
        console.log('✅ Categories created');

        // Create Profiles
        const profiles = await Profile.insertMany([
            {
                gender: 'Male',
                dateOfBirth: '1990-05-15',
                about: 'Passionate educator with 10+ years of experience in web development',
                contactNumber: '+1-555-0101'
            },
            {
                gender: 'Female',
                dateOfBirth: '1988-08-22',
                about: 'Data Science expert and AI researcher',
                contactNumber: '+1-555-0102'
            },
            {
                gender: 'Male',
                dateOfBirth: '1992-03-10',
                about: 'Mobile app developer specializing in React Native',
                contactNumber: '+1-555-0103'
            },
            {
                gender: 'Male',
                dateOfBirth: '2000-01-15',
                about: 'Enthusiastic learner passionate about technology',
                contactNumber: '+1-555-0104'
            },
            {
                gender: 'Female',
                dateOfBirth: '1999-07-20',
                about: 'Computer Science student exploring web development',
                contactNumber: '+1-555-0105'
            }
        ]);
        console.log('✅ Profiles created');

        // Hash password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create Users (Instructors and Students)
        const users = await User.insertMany([
            {
                firstName: 'Ayush',
                lastName: 'Jha',
                email: 'ayush.jha@example.com',
                password: hashedPassword,
                accountType: 'Instructor',
                active: true,
                approved: true,
                additionalDetails: profiles[0]._id,
                image: 'https://api.dicebear.com/5.x/initials/svg?seed=Ayush Jha',
                courses: []
            },
            {
                firstName: 'Priya',
                lastName: 'Sharma',
                email: 'priya.sharma@example.com',
                password: hashedPassword,
                accountType: 'Instructor',
                active: true,
                approved: true,
                additionalDetails: profiles[1]._id,
                image: 'https://api.dicebear.com/5.x/initials/svg?seed=Priya Sharma',
                courses: []
            },
            {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahul.kumar@example.com',
                password: hashedPassword,
                accountType: 'Instructor',
                active: true,
                approved: true,
                additionalDetails: profiles[2]._id,
                image: 'https://api.dicebear.com/5.x/initials/svg?seed=Rahul Kumar',
                courses: []
            },
            {
                firstName: 'Amit',
                lastName: 'Verma',
                email: 'amit.verma@example.com',
                password: hashedPassword,
                accountType: 'Student',
                active: true,
                approved: true,
                additionalDetails: profiles[3]._id,
                image: 'https://api.dicebear.com/5.x/initials/svg?seed=Amit Verma',
                courses: []
            },
            {
                firstName: 'Sneha',
                lastName: 'Patel',
                email: 'sneha.patel@example.com',
                password: hashedPassword,
                accountType: 'Student',
                active: true,
                approved: true,
                additionalDetails: profiles[4]._id,
                image: 'https://api.dicebear.com/5.x/initials/svg?seed=Sneha Patel',
                courses: []
            }
        ]);
        console.log('✅ Users created (Password: password123)');

        const instructors = users.slice(0, 3);
        const students = users.slice(3);

        // Create SubSections for different courses
        const webDevSubSections = await SubSection.insertMany([
            {
                title: 'Introduction to HTML',
                timeDuration: '15:30',
                description: 'Learn the basics of HTML and structure web pages',
                videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU'
            },
            {
                title: 'CSS Fundamentals',
                timeDuration: '20:45',
                description: 'Master CSS styling and layouts',
                videoUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc'
            },
            {
                title: 'JavaScript Basics',
                timeDuration: '25:00',
                description: 'Introduction to JavaScript programming',
                videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk'
            },
            {
                title: 'React Components',
                timeDuration: '30:15',
                description: 'Building reusable React components',
                videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM'
            }
        ]);

        const dataScSubSections = await SubSection.insertMany([
            {
                title: 'Python for Data Science',
                timeDuration: '18:20',
                description: 'Introduction to Python programming for data analysis',
                videoUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI'
            },
            {
                title: 'Data Visualization',
                timeDuration: '22:30',
                description: 'Creating meaningful visualizations with matplotlib and seaborn',
                videoUrl: 'https://www.youtube.com/watch?v=DAQNHzOcO5A'
            },
            {
                title: 'Machine Learning Basics',
                timeDuration: '28:45',
                description: 'Introduction to machine learning algorithms',
                videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU'
            }
        ]);

        const mobileDevSubSections = await SubSection.insertMany([
            {
                title: 'React Native Setup',
                timeDuration: '12:15',
                description: 'Setting up React Native development environment',
                videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc'
            },
            {
                title: 'Building Mobile UI',
                timeDuration: '25:30',
                description: 'Creating beautiful mobile interfaces',
                videoUrl: 'https://www.youtube.com/watch?v=ur6I5m2nTvk'
            }
        ]);

        console.log('✅ SubSections created');

        // Create Sections
        const webDevSections = await Section.insertMany([
            {
                sectionName: 'Getting Started with Web Development',
                subSection: [webDevSubSections[0]._id, webDevSubSections[1]._id]
            },
            {
                sectionName: 'Advanced JavaScript and React',
                subSection: [webDevSubSections[2]._id, webDevSubSections[3]._id]
            }
        ]);

        const dataScSections = await Section.insertMany([
            {
                sectionName: 'Python Programming',
                subSection: [dataScSubSections[0]._id]
            },
            {
                sectionName: 'Data Analysis and ML',
                subSection: [dataScSubSections[1]._id, dataScSubSections[2]._id]
            }
        ]);

        const mobileDevSections = await Section.insertMany([
            {
                sectionName: 'React Native Fundamentals',
                subSection: [mobileDevSubSections[0]._id, mobileDevSubSections[1]._id]
            }
        ]);

        console.log('✅ Sections created');

        // Create Courses
        const courses = await Course.insertMany([
            {
                courseName: 'Complete Web Development Bootcamp',
                courseDescription: 'Master web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to build full-stack applications.',
                instructor: instructors[0]._id,
                whatYouWillLearn: 'Build responsive websites, Create dynamic web applications, Master React and Node.js, Deploy applications to production',
                courseContent: webDevSections.map(s => s._id),
                price: 4999,
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
                category: categories[0]._id,
                tag: ['Web Development', 'JavaScript', 'React', 'Node.js'],
                studentsEnrolled: [students[0]._id],
                instructions: ['Basic computer knowledge required', 'No prior programming experience needed', 'Dedication to learn'],
                status: 'Published',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                courseName: 'Data Science and Machine Learning',
                courseDescription: 'Comprehensive course covering Python, data analysis, visualization, and machine learning algorithms.',
                instructor: instructors[1]._id,
                whatYouWillLearn: 'Python programming, Data analysis with Pandas, Machine learning algorithms, Data visualization techniques',
                courseContent: dataScSections.map(s => s._id),
                price: 5999,
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
                category: categories[2]._id,
                tag: ['Data Science', 'Python', 'Machine Learning', 'AI'],
                studentsEnrolled: [students[1]._id],
                instructions: ['Basic mathematics knowledge', 'Computer with Python installed', 'Curiosity to learn'],
                status: 'Published',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                courseName: 'React Native Mobile Development',
                courseDescription: 'Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with a single codebase.',
                instructor: instructors[2]._id,
                whatYouWillLearn: 'React Native fundamentals, Mobile UI design, API integration, Publishing apps to stores',
                courseContent: mobileDevSections.map(s => s._id),
                price: 4499,
                thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
                category: categories[1]._id,
                tag: ['Mobile Development', 'React Native', 'iOS', 'Android'],
                studentsEnrolled: [],
                instructions: ['JavaScript knowledge required', 'React basics helpful', 'Mobile device for testing'],
                status: 'Published',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                courseName: 'Advanced JavaScript Mastery',
                courseDescription: 'Deep dive into JavaScript concepts including closures, promises, async/await, and modern ES6+ features.',
                instructor: instructors[0]._id,
                whatYouWillLearn: 'Advanced JavaScript concepts, Asynchronous programming, ES6+ features, Design patterns',
                courseContent: [],
                price: 3499,
                thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
                category: categories[3]._id,
                tag: ['JavaScript', 'Programming', 'ES6'],
                studentsEnrolled: [students[0]._id, students[1]._id],
                instructions: ['Basic JavaScript knowledge required'],
                status: 'Published',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                courseName: 'Cloud Computing with AWS',
                courseDescription: 'Learn Amazon Web Services from basics to advanced. Master EC2, S3, Lambda, and more.',
                instructor: instructors[1]._id,
                whatYouWillLearn: 'AWS services, Cloud architecture, Serverless computing, DevOps practices',
                courseContent: [],
                price: 6999,
                thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
                category: categories[4]._id,
                tag: ['AWS', 'Cloud', 'DevOps'],
                studentsEnrolled: [],
                instructions: ['Basic Linux knowledge helpful', 'AWS account required'],
                status: 'Published',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                courseName: 'DevOps Engineering Complete Guide',
                courseDescription: 'Master DevOps tools and practices including Docker, Kubernetes, Jenkins, and CI/CD pipelines.',
                instructor: instructors[2]._id,
                whatYouWillLearn: 'Docker containerization, Kubernetes orchestration, CI/CD pipelines, Infrastructure as Code',
                courseContent: [],
                price: 5499,
                thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
                category: categories[5]._id,
                tag: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
                studentsEnrolled: [students[0]._id],
                instructions: ['Linux basics required', 'Programming experience helpful'],
                status: 'Published',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log('✅ Courses created');

        // Create Ratings and Reviews
        const ratings = await RatingAndReview.insertMany([
            {
                user: students[0]._id,
                rating: 5,
                review: 'Excellent course! The instructor explains everything clearly and the projects are very practical.',
                course: courses[0]._id
            },
            {
                user: students[1]._id,
                rating: 4.5,
                review: 'Great content and well-structured. Learned a lot about data science and machine learning.',
                course: courses[1]._id
            },
            {
                user: students[0]._id,
                rating: 5,
                review: 'Best JavaScript course I have taken. Highly recommended!',
                course: courses[3]._id
            }
        ]);
        console.log('✅ Ratings and Reviews created');

        // Update courses with ratings
        await Course.findByIdAndUpdate(courses[0]._id, {
            $push: { ratingAndReviews: ratings[0]._id }
        });
        await Course.findByIdAndUpdate(courses[1]._id, {
            $push: { ratingAndReviews: ratings[1]._id }
        });
        await Course.findByIdAndUpdate(courses[3]._id, {
            $push: { ratingAndReviews: ratings[2]._id }
        });

        // Update categories with courses
        await Category.findByIdAndUpdate(categories[0]._id, {
            $push: { courses: courses[0]._id }
        });
        await Category.findByIdAndUpdate(categories[2]._id, {
            $push: { courses: courses[1]._id }
        });
        await Category.findByIdAndUpdate(categories[1]._id, {
            $push: { courses: courses[2]._id }
        });
        await Category.findByIdAndUpdate(categories[3]._id, {
            $push: { courses: courses[3]._id }
        });
        await Category.findByIdAndUpdate(categories[4]._id, {
            $push: { courses: courses[4]._id }
        });
        await Category.findByIdAndUpdate(categories[5]._id, {
            $push: { courses: courses[5]._id }
        });

        // Update instructors with their courses
        await User.findByIdAndUpdate(instructors[0]._id, {
            courses: [courses[0]._id, courses[3]._id]
        });
        await User.findByIdAndUpdate(instructors[1]._id, {
            courses: [courses[1]._id, courses[4]._id]
        });
        await User.findByIdAndUpdate(instructors[2]._id, {
            courses: [courses[2]._id, courses[5]._id]
        });

        // Update students with enrolled courses
        await User.findByIdAndUpdate(students[0]._id, {
            courses: [courses[0]._id, courses[3]._id, courses[5]._id]
        });
        await User.findByIdAndUpdate(students[1]._id, {
            courses: [courses[1]._id, courses[3]._id]
        });

        console.log('\n✅ Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Categories: ${categories.length}`);
        console.log(`   - Users: ${users.length} (3 Instructors, 2 Students)`);
        console.log(`   - Courses: ${courses.length}`);
        console.log(`   - Sections: ${webDevSections.length + dataScSections.length + mobileDevSections.length}`);
        console.log(`   - SubSections: ${webDevSubSections.length + dataScSubSections.length + mobileDevSubSections.length}`);
        console.log(`   - Ratings: ${ratings.length}`);
        console.log('\n👤 Login Credentials:');
        console.log('   Instructor: ayush.jha@example.com / password123');
        console.log('   Instructor: priya.sharma@example.com / password123');
        console.log('   Instructor: rahul.kumar@example.com / password123');
        console.log('   Student: amit.verma@example.com / password123');
        console.log('   Student: sneha.patel@example.com / password123');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await clearData();
    await seedData();
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
};

main();
