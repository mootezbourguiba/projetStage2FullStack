// src/pages/NotificationsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Package } from 'lucide-react'; // Belles icônes
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:8081/api/products/alerts';

const NotificationsPage = () => {
    const [alertProducts, setAlertProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                // On appelle le nouvel endpoint que nous avons créé
                const response = await axios.get(API_URL);
                setAlertProducts(response.data);
                setError(null);
            } catch (err) {
                console.error("Erreur lors du chargement des alertes de stock:", err);
                setError("Impossible de charger les alertes de stock. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Chargement des notifications...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <AlertTriangle className="mr-3 text-yellow-500" />
                Notifications - Stocks Critiques
            </h1>

            {alertProducts.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold">Tout est en ordre !</h2>
                    <p>Aucun produit n'a atteint son seuil d'alerte pour le moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-gray-600 mb-4">
                        Les produits suivants nécessitent votre attention car leur stock est bas.
                    </p>
                    {alertProducts.map((product) => (
                        <div key={product.id} className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg flex items-center justify-between gap-4">
                            <div className="flex items-center">
                                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-gray-800">{product.name}</p>
                                    <p className="text-sm text-red-600 font-semibold">
                                        Stock actuel : {product.currentStock} (Seuil d'alerte : {product.alertThreshold})
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to={`/products`}
                                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0"
                            >
                                Gérer les produits
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;