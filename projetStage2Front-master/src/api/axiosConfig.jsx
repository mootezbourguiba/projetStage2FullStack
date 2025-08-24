// src/api/axiosConfig.jsx

import axios from 'axios';

// Définir l'URL de base de votre API backend
const API_BASE_URL = 'http://localhost:8081/api';

// Créer une instance d'axios avec la configuration par défaut
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Intercepteur de requêtes pour ajouter le token JWT à chaque appel API.
 * Il récupère le token stocké (par exemple dans localStorage) et l'ajoute
 * à l'en-tête 'Authorization'.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Récupérez le token. Assurez-vous que la clé 'authToken' correspond
    // à celle que vous utilisez lors de la connexion.
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Si un token existe, l'ajouter aux en-têtes
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Gérer les erreurs de requête
    return Promise.reject(error);
  }
);

export default apiClient;