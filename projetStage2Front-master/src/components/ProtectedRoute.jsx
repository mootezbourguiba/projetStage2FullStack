// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Pour un débogage futur, vous pouvez décommenter cette ligne :
    // console.log("ProtectedRoute Check:", { loading, isAuthenticated });

    // --- Étape 1 : Gérer l'état de chargement (le plus important) ---
    // C'est crucial. On ne prend aucune décision tant que l'AuthContext n'a pas fini
    // de vérifier si un token valide existe déjà (au chargement de la page).
    // Sans cette vérification, un utilisateur déjà connecté pourrait être redirigé vers /login
    // le temps d'une fraction de seconde.
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Vérification de la session...</p>
            </div>
        );
    }

    // --- Étape 2 : Gérer la redirection ---
    // Une fois que `loading` est `false`, on peut être sûr de la valeur de `isAuthenticated`.
    // Si l'utilisateur est authentifié, on affiche le contenu de la route demandée (via <Outlet />).
    // Sinon, on le redirige de manière irréversible vers la page de connexion.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;