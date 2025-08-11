// src/pages/Dashboard.jsx

import React, { useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
// --- AJOUT : On importe les nouveaux composants de graphiques ---
import CategoryChart from '../components/charts/CategoryChart';
import MonthlyActivityChart from '../components/charts/MonthlyActivityChart';

const Dashboard = () => {
  // Vos données existantes (inchangées)
  const recentActivities = [
    { action: "Entrée de stock", product: "Produit A", quantity: "+50", time: "Il y a 2 heures" },
    { action: "Sortie de stock", product: "Produit B", quantity: "-20", time: "Il y a 4 heures" },
    { action: "Nouveau produit ajouté", product: "Produit C", time: "Il y a 1 jour" }
  ];

  // Vos données de stocks critiques (inchangées)
  const [criticalProducts] = useState([
    { id: 4, name: 'Souris gaming', currentStock: 4, alertThreshold: 5 },
    { id: 2, name: 'Imprimante Canon', currentStock: 3, alertThreshold: 3 },
  ]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-6">Tableau de bord</h1>

      {/* Votre grille de stats existante (inchangée) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2 text-blue-600">Total Produits</h3>
          <p className="text-3xl font-bold text-gray-700">150</p>
        </div>
        <div className="bg-green-100 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2 text-green-600">En Stock</h3>
          <p className="text-3xl font-bold text-gray-700">120</p>
        </div>
        <div className="bg-yellow-100 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2 text-yellow-600">À Commander</h3>
          <p className="text-3xl font-bold text-gray-700">15</p>
        </div>
        <div className="bg-purple-100 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2 text-purple-600">Catégories</h3>
          <p className="text-3xl font-bold text-gray-700">8</p>
        </div>
      </div>

      {/* --- AJOUT DE LA NOUVELLE GRILLE POUR LES GRAPHIQUES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <CategoryChart />
        </div>
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
          <MonthlyActivityChart />
        </div>
      </div>
      
      {/* --- AJOUT D'UNE GRILLE POUR LES DEUX DERNIERS BLOCS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Votre section de stocks critiques existante (inchangée) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Stocks Critiques</h2>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="divide-y divide-gray-200">
              {criticalProducts.length > 0 ? (
                criticalProducts.map(product => (
                  <div key={product.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div className="flex items-center"><FiAlertTriangle className="h-5 w-5 text-red-500 mr-4" /><div><p className="font-medium text-gray-800">{product.name}</p><p className="text-sm text-gray-500">Seuil d'alerte: {product.alertThreshold}</p></div></div>
                    <div className="text-right"><p className="font-bold text-red-600 text-lg">{product.currentStock}</p><p className="text-xs text-gray-500">en stock</p></div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-gray-500">Aucun produit en stock critique.</p>
              )}
            </div>
          </div>
        </div>

        {/* Votre section d'activités récentes existante (inchangée) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Activités récentes</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div><p className="font-medium text-gray-700">{activity.action} - {activity.product}</p>{activity.quantity && <p className="text-sm text-gray-500">Quantité: {activity.quantity}</p>}</div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;