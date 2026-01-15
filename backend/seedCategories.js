/**
 * @file seedCategories.js
 * @description Seed script to populate initial course categories
 * 
 * Run with: node seedCategories.js
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Category = require('./models/category');

const categories = [
    {
        name: "Web Development",
        description: "Learn web development with HTML, CSS, JavaScript, React, Node.js and more. Build modern responsive websites and web applications."
    },
    {
        name: "Mobile Development",
        description: "Master mobile app development for iOS and Android using React Native, Flutter, Swift, and Kotlin."
    },
    {
        name: "Data Science",
        description: "Explore data science, machine learning, and AI. Learn Python, TensorFlow, and data visualization techniques."
    },
    {
        name: "Cloud Computing",
        description: "Learn cloud platforms like AWS, Azure, and Google Cloud. Master DevOps, containerization, and serverless architecture."
    },
    {
        name: "Cybersecurity",
        description: "Understand cybersecurity fundamentals, ethical hacking, network security, and penetration testing."
    },
    {
        name: "Programming Languages",
        description: "Master programming languages like Python, Java, C++, Go, and Rust from beginner to advanced level."
    },
    {
        name: "Database Management",
        description: "Learn SQL, NoSQL, MongoDB, PostgreSQL, and database design principles for efficient data management."
    },
    {
        name: "UI/UX Design",
        description: "Create beautiful user interfaces and experiences. Learn Figma, Adobe XD, and design principles."
    }
];

async function seedCategories() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');

        // Check existing categories
        const existingCount = await Category.countDocuments();
        console.log(`Existing categories: ${existingCount}`);

        if (existingCount > 0) {
            console.log('Categories already exist. Skipping seed.');
            process.exit(0);
        }

        // Insert categories
        const result = await Category.insertMany(categories);
        console.log(`Successfully created ${result.length} categories:`);
        result.forEach(cat => console.log(`  - ${cat.name}`));

        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
}

seedCategories();
