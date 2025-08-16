// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // --- MODIFICATION MAJEURE ---
  // On ne simule plus. On vérifie la présence réelle d'un token
  // que la page de Login aura stocké après une connexion réussie.
  const token = localStorage.getItem('token');

  // Si le token n'existe pas (l'utilisateur n'est pas connecté),
  // on le redirige vers la page de login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si le token existe, on autorise l'accès.
  // <Outlet /> représente la page protégée que l'utilisateur essaie de visiter
  // (Dashboard, Products, etc.).
  return <Outlet />;
};

export default ProtectedRoute;