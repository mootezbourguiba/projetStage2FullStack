// src/components/DashboardLayout.jsx

import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // On importe la nouvelle Navbar
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-1 p-8 overflow-y-auto">
          <Navbar /> {/* La Navbar est maintenant ici */}
          <Outlet /> {/* Le contenu de la page vient après */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;