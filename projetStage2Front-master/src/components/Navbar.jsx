// src/components/Navbar.jsx

import React from 'react';
import { FiBell } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm p-4 flex justify-between items-center rounded-lg mb-6">
      {/* Le titre sera ici plus tard, pour l'instant on le laisse vide */}
      <div>
        {/* <h1 className="text-xl font-semibold text-gray-700">Tableau de bord</h1> */}
      </div>

      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative text-gray-600 hover:text-indigo-600">
          <FiBell className="h-6 w-6" />
          {/* Petite bulle de notification */}
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        </Link>
        {/* On pourra ajouter le profil utilisateur ici plus tard */}
      </div>
    </nav>
  );
};

export default Navbar;