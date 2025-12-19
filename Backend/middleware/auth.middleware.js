const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 * Extracts user ID and role from token and attaches to request object
 */
const authMiddleware = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'your-secret-key-change-in-production'
        );

        // Attach user info to request object
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
        
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server authentication error'
        });
    }
};

module.exports = authMiddleware;