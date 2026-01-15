const jwt = require('jsonwebtoken');

/**
 * Authentication middleware - verifies JWT token
 */
const auth = (req, res, next) => {
    try {
        // Extract token from multiple sources
        const token = 
            req.body?.token || 
            req.cookies?.token || 
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

/**
 * Role-based authorization middleware
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.accountType)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. This route is only accessible to: ${roles.join(', ')}`
            });
        }
        next();
    };
};

// Convenience middleware for specific roles
const isStudent = authorize('Student');
const isInstructor = authorize('Instructor');
const isAdmin = authorize('Admin');

module.exports = {
    auth,
    authorize,
    isStudent,
    isInstructor,
    isAdmin
};
