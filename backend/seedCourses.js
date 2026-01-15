/**
 * @file seedCourses.js
 * @description Seed script to populate sample courses with categories
 * 
 * Run with: node seedCourses.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/course');
const Category = require('./models/category');
const User = require('./models/user');
const Profile = require('./models/profile');
const Section = require('./models/section');
const SubSection = require('./models/subSection');

async function seedCourses() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        // Check if courses already exist
        const existingCourses = await Course.countDocuments();
        if (existingCourses > 0) {
            console.log('Courses already exist. Skipping seed.');
            process.exit(0);
        }

        // Get or create an instructor
        let instructor = await User.findOne({ accountType: 'Instructor' });
        
        if (!instructor) {
            console.log('Creating sample instructor...');
            const profile = await Profile.create({
                gender: 'Male',
                dateOfBirth: null,
                about: 'Experienced instructor with 10+ years in software development',
                contactNumber: null
            });

            instructor = await User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'instructor@studyx.com',
                password: '$2a$10$YourHashedPasswordHere', // This won't work for login, just for display
                accountType: 'Instructor',
                additionalDetails: profile._id,
                approved: true,
                image: 'https://api.dicebear.com/5.x/initials/svg?seed=John Doe'
            });
            console.log('Instructor created:', instructor.email);
        }

        // Get all categories
        const categories = await Category.find();
        if (categories.length === 0) {
            console.log('No categories found. Please run seedCategories.js first.');
            process.exit(1);
        }

        console.log(`Found ${categories.length} categories`);

        // Sample courses data
        const coursesData = [
            {
                courseName: "Complete Web Development Bootcamp",
                courseDescription: "Master web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and build real-world projects.",
                category: "Web Development",
                price: 4999,
                thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                tag: ["Web Development", "JavaScript", "React", "Node.js"],
                whatYouWillLearn: "Build responsive websites\nMaster React and Node.js\nCreate full-stack applications\nDeploy projects to production",
                status: "Published"
            },
            {
                courseName: "React JS - Complete Guide",
                courseDescription: "Learn React from basics to advanced. Build modern, reactive user interfaces with React Hooks, Context API, and Redux.",
                category: "Web Development",
                price: 2999,
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
                tag: ["React", "JavaScript", "Frontend"],
                whatYouWillLearn: "Master React fundamentals\nWork with Hooks and Context\nState management with Redux\nBuild production-ready apps",
                status: "Published"
            },
            {
                courseName: "Python for Data Science",
                courseDescription: "Learn Python programming for data science. Master NumPy, Pandas, Matplotlib, and machine learning basics.",
                category: "Data Science",
                price: 3999,
                thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
                tag: ["Python", "Data Science", "Machine Learning"],
                whatYouWillLearn: "Python programming basics\nData analysis with Pandas\nData visualization\nMachine learning fundamentals",
                status: "Published"
            },
            {
                courseName: "Mobile App Development with React Native",
                courseDescription: "Build cross-platform mobile apps for iOS and Android using React Native. Learn navigation, state management, and API integration.",
                category: "Mobile Development",
                price: 4499,
                thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
                tag: ["React Native", "Mobile", "iOS", "Android"],
                whatYouWillLearn: "Build mobile apps\nCross-platform development\nAPI integration\nPublish to app stores",
                status: "Published"
            },
            {
                courseName: "AWS Cloud Practitioner Complete Course",
                courseDescription: "Master AWS cloud services. Learn EC2, S3, Lambda, RDS, and prepare for AWS certification.",
                category: "Cloud Computing",
                price: 3499,
                thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
                tag: ["AWS", "Cloud", "DevOps"],
                whatYouWillLearn: "AWS core services\nCloud architecture\nSecurity best practices\nCertification preparation",
                status: "Published"
            },
            {
                courseName: "Ethical Hacking & Cybersecurity",
                courseDescription: "Learn ethical hacking, penetration testing, and cybersecurity fundamentals. Protect systems from cyber threats.",
                category: "Cybersecurity",
                price: 5999,
                thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
                tag: ["Security", "Hacking", "Network Security"],
                whatYouWillLearn: "Penetration testing\nNetwork security\nEthical hacking tools\nSecurity best practices",
                status: "Published"
            },
            {
                courseName: "Java Programming Masterclass",
                courseDescription: "Complete Java programming course from beginner to advanced. Learn OOP, data structures, and build real applications.",
                category: "Programming Languages",
                price: 3999,
                thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
                tag: ["Java", "Programming", "OOP"],
                whatYouWillLearn: "Java fundamentals\nObject-oriented programming\nData structures\nBuild Java applications",
                status: "Published"
            },
            {
                courseName: "MongoDB - Complete Developer Guide",
                courseDescription: "Master MongoDB database. Learn CRUD operations, aggregation, indexing, and build scalable applications.",
                category: "Database Management",
                price: 2499,
                thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
                tag: ["MongoDB", "Database", "NoSQL"],
                whatYouWillLearn: "MongoDB basics\nCRUD operations\nAggregation framework\nDatabase optimization",
                status: "Published"
            },
            {
                courseName: "UI/UX Design Complete Course",
                courseDescription: "Learn UI/UX design from scratch. Master Figma, design principles, user research, and create stunning interfaces.",
                category: "UI/UX Design",
                price: 3499,
                thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
                tag: ["UI/UX", "Design", "Figma"],
                whatYouWillLearn: "Design principles\nFigma mastery\nUser research\nPrototyping and testing",
                status: "Published"
            },
            {
                courseName: "Node.js Backend Development",
                courseDescription: "Build scalable backend applications with Node.js and Express. Learn REST APIs, authentication, and database integration.",
                category: "Web Development",
                price: 3999,
                thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
                tag: ["Node.js", "Backend", "Express", "API"],
                whatYouWillLearn: "Node.js fundamentals\nREST API development\nAuthentication & authorization\nDatabase integration",
                status: "Published"
            }
        ];

        console.log('Creating courses...');
        let createdCount = 0;

        for (const courseData of coursesData) {
            // Find category
            const category = categories.find(cat => cat.name === courseData.category);
            if (!category) {
                console.log(`Category not found: ${courseData.category}`);
                continue;
            }

            // Create course
            const course = await Course.create({
                courseName: courseData.courseName,
                courseDescription: courseData.courseDescription,
                instructor: instructor._id,
                whatYouWillLearn: courseData.whatYouWillLearn,
                courseContent: [],
                ratingAndReviews: [],
                price: courseData.price,
                thumbnail: courseData.thumbnail,
                tag: courseData.tag,
                category: category._id,
                studentsEnrolled: [],
                instructions: ["Complete all lectures", "Practice with projects", "Ask questions in discussion"],
                status: courseData.status
            });

            // Add course to category
            await Category.findByIdAndUpdate(
                category._id,
                { $push: { courses: course._id } }
            );

            // Create sample sections and subsections
            const section1 = await Section.create({
                sectionName: "Introduction",
                subSection: []
            });

            const subsection1 = await SubSection.create({
                sectionId: section1._id,
                title: "Welcome to the Course",
                description: "Introduction to the course and what you'll learn",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                timeDuration: "10:30"
            });

            section1.subSection.push(subsection1._id);
            await section1.save();

            course.courseContent.push(section1._id);
            await course.save();

            createdCount++;
            console.log(`✓ Created: ${courseData.courseName}`);
        }

        console.log(`\nSuccessfully created ${createdCount} courses!`);
        console.log('\nYou can now browse courses in the catalog.');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
}

seedCourses();
