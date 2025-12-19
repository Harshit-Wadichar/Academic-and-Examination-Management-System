const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
    );
};

// User Signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password, // Will be hashed by pre-save middleware
            role
        });

        await user.save();

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: user.toJSON(), // Password removed by toJSON method
                token
            }
        });

    } catch (error) {
        console.error('Signup Error:', error);
        
        // Mongoose validation error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during signup',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toJSON(), // Password removed by toJSON method
                token
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};