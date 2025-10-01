import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
    const token = localStorage.getItem('authToken');

    try {
        const decoded = jwtDecode(token);
        const isExpired = Date.now() >= decoded.exp * 1000;

        if (isExpired) {
            throw new Error('Token expired');
        }

        return <Outlet />;
    } catch (error) {
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;
