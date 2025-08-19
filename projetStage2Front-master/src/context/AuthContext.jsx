// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true, // On ajoute loading à la valeur par défaut
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // État pour savoir si on vérifie le token

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser({ email: decodedToken.sub, role: decodedToken.authorities[0].authority });
                } else {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } catch (error) {
                console.error("Token invalide ou expiré", error);
                localStorage.removeItem('token');
                setToken(null);
            }
        }
        setLoading(false); // On a fini de vérifier, on arrête de charger
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const value = { user, token, loading, login, logout, isAuthenticated: !!token };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};