import React from 'react';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Student Dashboard</h1>
                <div style={styles.userInfo}>
                    <span>Welcome, {user?.name}!</span>
                    <button onClick={logout} style={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            </div>
            
            <div style={styles.content}>
                <div style={styles.card}>
                    <h2>Student Features</h2>
                    <ul style={styles.featureList}>
                        <li>View Course Syllabus</li>
                        <li>Check Exam Schedule</li>
                        <li>Download Hall Tickets</li>
                        <li>View Results</li>
                        <li>Access Study Materials</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#3498db',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        margin: 0,
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    content: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    card: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
    },
    featureListLi: {
        padding: '10px',
        borderBottom: '1px solid #eee',
    },
};

export default StudentDashboard;