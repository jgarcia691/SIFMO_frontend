import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    if (user) {
        // Redirigir al dashboard si ya está logueado
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;
