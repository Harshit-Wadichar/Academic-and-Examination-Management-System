import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';

// Create Auth Context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const token = authService.getToken();
            const storedUser = authService.getCurrentUser();
            
            if (token && storedUser) {
                try {
                    // Verify token is valid by fetching profile
                    const response = await authService.getProfile();
                    setUser(response.data);
                } catch (err) {
                    // Token invalid or expired
                    authService.logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authService.login({ email, password });
            
            if (response.success) {
                setUser(response.data.user);
                return { success: true, data: response.data };
            }
            
            return { success: false, message: response.message };
        } catch (err) {
            setError(err.message || 'Login failed');
            return { success: false, message: err.message || 'Login failed' };
        }
    };

    // Signup function
    const signup = async (userData) => {
        try {
            setError(null);
            const response = await authService.signup(userData);
            
            if (response.success) {
                // Auto login after signup
                await login(userData.email, userData.password);
                return { success: true, data: response.data };
            }
            
            return { success: false, message: response.message };
        } catch (err) {
            setError(err.message || 'Signup failed');
            return { success: false, message: err.message || 'Signup failed' };
        }
    };

    // Logout function
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Clear error
    const clearError = () => setError(null);

    // Get user role
    const getUserRole = () => user?.role || null;

    // Value to be provided by context
    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        isAuthenticated: !!user,
        getUserRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;