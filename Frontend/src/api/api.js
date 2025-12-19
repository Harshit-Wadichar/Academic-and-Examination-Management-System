import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            if (status === 401) {
                // Unauthorized - clear token and redirect
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            
            // Return error message from server or default
            return Promise.reject(data?.message || 'An error occurred');
        } else if (error.request) {
            // Request made but no response
            return Promise.reject('No response from server. Please check your connection.');
        } else {
            // Something else happened
            return Promise.reject(error.message || 'An unexpected error occurred');
        }
    }
);

export default api;