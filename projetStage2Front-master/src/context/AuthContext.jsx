import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token')); // Initialise depuis le localStorage

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Vérifie si le token a expiré
                if (decodedToken.exp * 1000 > Date.now()) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    setUser({ email: decodedToken.sub, role: decodedToken.authorities[0] });
                } else {
                    // Si le token est expiré, on nettoie
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error("Token invalide", error);
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const value = { user, token, login, logout, isAuthenticated: !!token };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};