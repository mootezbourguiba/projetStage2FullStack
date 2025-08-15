// src/context/NotificationContext.jsx

import React, { createContext, useState, useContext, useCallback } from 'react';

// 1. Création du contexte
const NotificationContext = createContext();

// 2. Création du fournisseur (Provider) avec une logique anti-doublons robuste
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([
        { id: 0, type: 'info', message: 'Bienvenue ! Votre session est active.', time: 'À l\'instant' }
    ]);

    // Fonction pour ajouter une notification (maintenant avec une VRAIE déduplication)
    const addNotification = useCallback((message, type = 'info') => {
        setNotifications(prevNotifications => {
            // --- LOGIQUE ANTI-DOUBLONS ---
            // On vérifie si une notification avec exactement le même message existe déjà.
            const messageExists = prevNotifications.some(notif => notif.message === message);

            // Si le message existe déjà, on ne fait rien et on retourne la liste précédente.
            if (messageExists) {
                return prevNotifications;
            }

            // Sinon, on crée la nouvelle notification
            const newNotification = {
                id: Date.now(),
                message,
                type,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            };

            // Et on l'ajoute au début de la liste, en gardant les 10 dernières.
            return [newNotification, ...prevNotifications].slice(0, 10);
        });
    }, []);

    // Fonction pour marquer tout comme lu
    const clearNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const value = { notifications, addNotification, clearNotifications };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// 3. Hook personnalisé (inchangé)
export const useNotifications = () => {
    return useContext(NotificationContext);
};