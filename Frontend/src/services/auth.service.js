import api from '../api/api';

// Auth service - handles authentication API calls
const authService = {
    // Register new user
    signup: async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            
            // Save token and user data to localStorage
            if (response.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Get current user profile
    getProfile: async () => {
        try {
            const response = await api.get('/users/me');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Logout user (clear localStorage)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Get user role
    getUserRole: () => {
        const user = authService.getCurrentUser();
        return user ? user.role : null;
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;