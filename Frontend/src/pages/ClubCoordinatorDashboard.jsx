import React from 'react';
import { useAuth } from '../context/AuthContext';

const ClubCoordinatorDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Club Coordinator Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default ClubCoordinatorDashboard;