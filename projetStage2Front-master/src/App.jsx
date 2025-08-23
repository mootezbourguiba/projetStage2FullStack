// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
// L'import de AuthProvider est ici
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import MouvementsPage from './pages/MouvementsPage.jsx';
import FournisseursPage from './pages/FournisseursPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import EmpruntsPage from './pages/EmpruntsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

function App() {
  return (
    <Router>
      {/* AuthProvider englobe tout, c'est parfait */}
      <AuthProvider>
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
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;