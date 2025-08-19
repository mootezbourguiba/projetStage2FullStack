// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // --- CORRECTION FINALE ET DÉFINITIVE ---
                    // Le champ dans le token s'appelle "auth", comme défini dans votre JwtTokenProvider.java
                    setUser({ email: decodedToken.sub, role: decodedToken.auth[0] });

                } else {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error("Token invalide ou erreur de décodage", error);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
        setLoading(false); 
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = { 
        user, 
        token, 
        loading, 
        login, 
        logout, 
        isAuthenticated: !!token && !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};