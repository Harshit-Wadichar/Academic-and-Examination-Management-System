/**
 * Middleware to check if user has required role(s)
 * @param {Array} allowedRoles - Array of allowed roles
 * @returns {Function} Middleware function
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Check if user is authenticated
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const userRole = req.user.role;
            
            // Check if user's role is in allowed roles
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
                });
            }

            next();
            
        } catch (error) {
            console.error('Role Middleware Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error in role validation'
            });
        }
    };
};

module.exports = roleMiddleware;