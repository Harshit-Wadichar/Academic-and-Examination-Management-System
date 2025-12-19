import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;