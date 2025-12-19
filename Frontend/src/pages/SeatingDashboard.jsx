import React from 'react';
import { useAuth } from '../context/AuthContext';

const SeatingDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '20px' }}>
            <h1>Seating Manager Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default SeatingDashboard;