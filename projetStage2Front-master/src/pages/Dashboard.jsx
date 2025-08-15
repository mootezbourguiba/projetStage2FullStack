// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiAlertTriangle, FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import CategoryChart from '../components/charts/CategoryChart';
import MonthlyActivityChart from '../components/charts/MonthlyActivityChart';

// On n'a plus besoin de 'useNotifications' ici
// import { useNotifications } from '../context/NotificationContext';

const API_BASE_URL = 'http://localhost:8081/api';

const Dashboard = () => {
  // On supprime toute référence à 'addNotification'
  const [criticalProducts, setCriticalProducts] = useState([]);
  const [recentMovements, setRecentMovements] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [productsRes, movementsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products`),
          axios.get(`${API_BASE_URL}/movements`),
        ]);

        const allProducts = productsRes.data;
        const allMovements = movementsRes.data;
        
        // La logique des stocks critiques est uniquement pour l'affichage maintenant
        const critical = allProducts.filter(p => p.critical);
        setCriticalProducts(critical);

        // La logique pour les activités récentes reste
        const sortedMovements = [...allMovements].sort((a, b) => new Date(b.movementDate) - new Date(a.movementDate));
        setRecentMovements(sortedMovements.slice(0, 5));
        
        // La logique pour les cartes de stats reste
        const totalProducts = allProducts.length;
        const categories = new Set(allProducts.map(p => p.category?.name).filter(Boolean)).size;
        setStats({ totalProducts, categories });

      } catch (error) {
        console.error("Erreur chargement du dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []); // On supprime 'addNotification' des dépendances, car on ne l'utilise plus

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 rounded-lg p-6"><h3 className="text-lg font-medium mb-2 text-blue-600">Total Produits</h3><p className="text-3xl font-bold text-gray-700">{loading ? '...' : stats.totalProducts}</p></div>
        <div className="bg-green-100 rounded-lg p-6"><h3 className="text-lg font-medium mb-2 text-green-600">En Stock</h3><p className="text-3xl font-bold text-gray-700">À calculer</p></div>
        <div className="bg-yellow-100 rounded-lg p-6"><h3 className="text-lg font-medium mb-2 text-yellow-600">À Commander</h3><p className="text-3xl font-bold text-gray-700">{criticalProducts.length}</p></div>
        <div className="bg-purple-100 rounded-lg p-6"><h3 className="text-lg font-medium mb-2 text-purple-600">Catégories</h3><p className="text-3xl font-bold text-gray-700">{loading ? '...' : stats.categories}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm"><CategoryChart /></div>
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm"><MonthlyActivityChart /></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Stocks Critiques</h2>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-200">
              {loading ? <p className="p-4 text-gray-500">Chargement...</p> : 
               criticalProducts.length > 0 ? (
                criticalProducts.map(product => (
                  <div key={product.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center"><FiAlertTriangle className="h-5 w-5 text-red-500 mr-4" /><div><p className="font-medium text-gray-800">{product.name}</p><p className="text-sm text-gray-500">Seuil: {product.alertThreshold}</p></div></div>
                    <div className="text-right"><p className="font-bold text-red-600 text-lg">{product.currentStock}</p><p className="text-xs text-gray-500">en stock</p></div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500">Aucun produit en stock critique.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Activités récentes</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-2">
              {loading ? <p className="text-gray-500">Chargement...</p> :
               recentMovements.length > 0 ? (
                recentMovements.map((mov) => (
                  <div key={mov.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      {mov.type === 'ENTREE' ? <FiArrowUpCircle className="text-green-500" /> : <FiArrowDownCircle className="text-red-500" />}
                      <div>
                        <p className="font-medium text-gray-700">{mov.product?.name}</p>
                        <p className="text-sm text-gray-500">
                          {mov.type === 'ENTREE' ? `Entrée de ${mov.supplier?.name || 'N/A'}` : `Sortie vers ${mov.client?.name || 'N/A'}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${mov.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>{mov.type === 'ENTREE' ? '+' : '-'}{mov.quantity}</p>
                      <span className="text-xs text-gray-400">{format(new Date(mov.movementDate), 'p', { locale: fr })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aucune activité récente.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;