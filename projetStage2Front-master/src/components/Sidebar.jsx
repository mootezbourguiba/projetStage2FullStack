// src/components/Sidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // localStorage.removeItem('authToken'); // Tu activeras ça plus tard
    navigate('/login');
  };

  // On utilise les emojis comme tu le souhaites
  const navItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: '📊' },
    { name: 'Produits', path: '/products', icon: '📦' },
    { name: 'Catégories', path: '/categories', icon: '🏷️' },
    { name: 'Mouvements', path: '/mouvements', icon: '🔄' },
    { name: 'Fournisseurs', path: '/fournisseurs', icon: '🏬' }, // Ou 'groups', ou 'apartment'
    { name: 'Emprunts', path: '/emprunts', icon: '⏳' },
  ];

  return (
    // On utilise la couleur de fond que tu préfères
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col fixed left-0 top-0">
      
      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">ESPRIM Stock</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                // On garde NavLink pour la fonctionnalité, mais on change le style
                // pour qu'il corresponde à ton design souhaité
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-700 text-white' // Style pour le lien actif
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white' // Style pour les autres liens
                  }`
                }
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center p-2 w-full rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors text-left"
        >
          <span className="mr-3 text-xl">🚪</span>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;