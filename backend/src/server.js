/**
 * @file server.js
 * @description Server entry point for the StudyX backend
 * @module src/server
 * 
 * Initializes the server by connecting to MongoDB database,
 * setting up Cloudinary for media storage, and starting the Express server.
 * Includes graceful shutdown handling and error management for production.
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const app = require('./app');
const { connectDB } = require('./config/database.config');
const { cloudinaryConnect } = require('./config/cloudinary.config');

const PORT = process.env.PORT || 4000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Connect to Cloudinary
        cloudinaryConnect();
        
        // Start server
        const server = app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════╗
║     StudyX Backend Server Started          ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                               ║
║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(24)}║
║  Database: Connected                       ║
║  Cloudinary: Connected                     ║
╚════════════════════════════════════════════╝
            `);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('UNHANDLED REJECTION! Shutting down...');
            console.error(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Process terminated.');
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
