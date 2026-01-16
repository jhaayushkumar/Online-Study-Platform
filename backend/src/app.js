/**
 * @file app.js
 * @description Express application configuration for the StudyX platform
 * @module src/app
 * 
 * Configures Express app with security middleware (helmet, CORS),
 * body parsing, file uploads, cookie handling, and API routes.
 * Sets up health check endpoints and error handling middleware.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');

const courseRoutes = require('../routes/course');
const paymentRoutes = require('../routes/payments');
const contactRoutes = require('../routes/contact');

const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
    limits: { fileSize: 50 * 1024 * 1024 }
}));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'StudyX API is running',
        version: '1.0.2',
        environment: process.env.NODE_ENV || 'development',
        deployedAt: '2026-01-16T08:45:00Z'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/reach', contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
