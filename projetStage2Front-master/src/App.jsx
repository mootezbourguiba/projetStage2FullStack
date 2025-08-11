// src/App.jsx

import React, { useState } from 'react'; // --- MODIFICATION ICI --- : On importe useState
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
// On commente UsersPage pour le moment pour éviter les erreurs
// import UsersPage from './pages/UsersPage.jsx'; 

// Composants de structure
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

function App() {
  // --- MODIFICATION ICI --- : On crée l'état central pour les notifications
  const [notifications, setNotifications] = useState([
    { type: 'in', message: 'Bienvenue ! Votre session est active.', time: 'À l\'instant' }
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications([]); // On vide la liste pour simuler "marquer comme lu"
    alert("Toutes les notifications ont été marquées comme lues.");
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* --- MODIFICATION ICI --- : On passe les props aux pages qui en ont besoin */}
            <Route path="/dashboard" element={<Dashboard setNotifications={setNotifications} />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/mouvements" element={<MouvementsPage />} />
            <Route path="/fournisseurs" element={<FournisseursPage />} />
            <Route path="/notifications" element={<NotificationsPage notifications={notifications} onMarkAllAsRead={handleMarkAllAsRead} />} />
            <Route path="/emprunts" element={<EmpruntsPage />} />
            {/* <Route path="/users" element={<UsersPage />} /> */}
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;