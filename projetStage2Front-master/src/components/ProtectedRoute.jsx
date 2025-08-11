// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Pour l'instant, on simule un utilisateur connecté.
  // Plus tard, tu remplaceras cette logique par une vraie vérification
  // (ex: vérifier la présence d'un token dans le localStorage).
  const isAuthenticated = true; // <-- CHANGE CECI en 'false' pour tester la redirection

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login.
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est authentifié, on affiche la page demandée (Dashboard, Products, etc.).
  // <Outlet /> est un placeholder pour la route enfant.
  return <Outlet />;
};

export default ProtectedRoute;