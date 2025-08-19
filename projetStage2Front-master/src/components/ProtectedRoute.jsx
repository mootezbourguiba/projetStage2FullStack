// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Si on est en train de vérifier le token, on affiche un message de chargement
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Vérification de la session...</p>
            </div>
        );
    }

    // Une fois la vérification terminée, on prend la décision
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;