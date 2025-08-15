// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// NOUVEAU: On importe notre fournisseur de notifications
import { NotificationProvider } from './context/NotificationContext';

// Pages d'authentification
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Pages du tableau de bord
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import MouvementsPage from './pages/MouvementsPage.jsx';
import FournisseursPage from './pages/FournisseursPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import EmpruntsPage from './pages/EmpruntsPage.jsx';
// import UsersPage from './pages/UsersPage.jsx'; 

// Composants de structure
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

function App() {
  return (
    <Router>
      {/* On enveloppe toute l'application avec le fournisseur de notifications */}
      <NotificationProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/mouvements" element={<MouvementsPage />} />
              <Route path="/fournisseurs" element={<FournisseursPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/emprunts" element={<EmpruntsPage />} />
              {/* <Route path="/users" element={<UsersPage />} /> */}
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;