import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, getUserRole, error, clearError } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            redirectBasedOnRole();
        }
    }, [isAuthenticated]);

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
    }, []);

    const redirectBasedOnRole = () => {
        const role = getUserRole();
        switch (role) {
            case 'student':
                navigate('/student');
                break;
            case 'admin':
                navigate('/admin');
                break;
            case 'seatingManager':
                navigate('/seating');
                break;
            case 'clubCoordinator':
                navigate('/club');
                break;
            default:
                navigate('/');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (loginError) setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginError('');

        const result = await login(formData.email, formData.password);
        
        if (!result.success) {
            setLoginError(result.message || 'Login failed');
        }
        
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>College Management System</h2>
                <h3 style={styles.subtitle}>Login</h3>
                
                {(error || loginError) && (
                    <div style={styles.errorAlert}>
                        {error || loginError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Enter your password"
                            minLength="6"
                        />
                    </div>

                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Don't have an account?{' '}
                        <Link to="/register" style={styles.link}>
                            Register here
                        </Link>
                    </p>
                    <div style={styles.demoInfo}>
                        <p style={styles.demoText}>Demo Roles:</p>
                        <ul style={styles.demoList}>
                            <li>Student: student@college.com</li>
                            <li>Admin: admin@college.com</li>
                            <li>Seating Manager: seating@college.com</li>
                            <li>Club Coordinator: club@college.com</li>
                            <li>Password: 123456 for all</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '10px',
        fontSize: '24px',
    },
    subtitle: {
        textAlign: 'center',
        color: '#7f8c8d',
        marginBottom: '30px',
        fontSize: '18px',
    },
    form: {
        width: '100%',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#2c3e50',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#2980b9',
    },
    buttonDisabled: {
        backgroundColor: '#95a5a6',
        cursor: 'not-allowed',
    },
    footer: {
        marginTop: '30px',
        textAlign: 'center',
    },
    footerText: {
        color: '#7f8c8d',
        marginBottom: '20px',
    },
    link: {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: '500',
    },
    linkHover: {
        textDecoration: 'underline',
    },
    errorAlert: {
        backgroundColor: '#ffeaea',
        color: '#e74c3c',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    demoInfo: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '20px',
        fontSize: '14px',
    },
    demoText: {
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#2c3e50',
    },
    demoList: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
        textAlign: 'left',
    },
    demoListLi: {
        marginBottom: '4px',
        color: '#7f8c8d',
    },
};

export default Login;