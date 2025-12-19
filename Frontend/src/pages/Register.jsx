import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { signup, isAuthenticated, getUserRole, error, clearError } = useAuth();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    
    const [loading, setLoading] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Available roles
    const roles = [
        { value: 'student', label: 'Student' },
        { value: 'admin', label: 'Administrator' },
        { value: 'seatingManager', label: 'Seating Manager' },
        { value: 'clubCoordinator', label: 'Club Coordinator' }
    ];

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
        
        // Clear errors when user starts typing
        if (registerError) setRegisterError('');
        if (passwordError && e.target.name.includes('password')) {
            setPasswordError('');
        }
    };

    const validateForm = () => {
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }

        // Check password length
        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setRegisterError('');
        setPasswordError('');

        // Prepare data for API (exclude confirmPassword)
        const { confirmPassword, ...userData } = formData;

        const result = await signup(userData);
        
        if (!result.success) {
            setRegisterError(result.message || 'Registration failed');
        }
        
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>College Management System</h2>
                <h3 style={styles.subtitle}>Create Account</h3>
                
                {(error || registerError) && (
                    <div style={styles.errorAlert}>
                        {error || registerError}
                    </div>
                )}

                {passwordError && (
                    <div style={styles.errorAlert}>
                        {passwordError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Enter your full name"
                            minLength="2"
                        />
                    </div>

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
                        <small style={styles.helpText}>Minimum 6 characters</small>
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            style={styles.input}
                            placeholder="Confirm your password"
                            minLength="6"
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="role" style={styles.label}>Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        <small style={styles.helpText}>
                            Choose your role in the system
                        </small>
                    </div>

                    <button 
                        type="submit" 
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Login here
                        </Link>
                    </p>
                    
                    <div style={styles.roleInfo}>
                        <h4 style={styles.roleTitle}>Role Descriptions:</h4>
                        <ul style={styles.roleList}>
                            <li><strong>Student:</strong> View syllabus, exams, hall tickets</li>
                            <li><strong>Administrator:</strong> Full system management</li>
                            <li><strong>Seating Manager:</strong> Manage exam seating arrangements</li>
                            <li><strong>Club Coordinator:</strong> Manage college events and clubs</li>
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
        maxWidth: '500px',
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
    select: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#27ae60',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        marginTop: '10px',
    },
    buttonHover: {
        backgroundColor: '#219653',
    },
    buttonDisabled: {
        backgroundColor: '#95a5a6',
        cursor: 'not-allowed',
    },
    footer: {
        marginTop: '30px',
    },
    footerText: {
        textAlign: 'center',
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
    helpText: {
        display: 'block',
        marginTop: '5px',
        color: '#7f8c8d',
        fontSize: '12px',
    },
    roleInfo: {
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginTop: '20px',
    },
    roleTitle: {
        marginBottom: '10px',
        color: '#2c3e50',
        fontSize: '14px',
    },
    roleList: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
        fontSize: '13px',
        color: '#7f8c8d',
    },
    roleListLi: {
        marginBottom: '5px',
        paddingLeft: '15px',
        position: 'relative',
    },
    roleListLiBefore: {
        content: '"•"',
        position: 'absolute',
        left: '0',
        color: '#3498db',
    },
};

export default Register;