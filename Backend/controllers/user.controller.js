const User = require('../models/User.model');

// Get user profile (current user)
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all users (admin only - will be protected in routes)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};