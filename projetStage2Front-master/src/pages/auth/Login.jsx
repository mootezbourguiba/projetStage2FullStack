// src/pages/auth/Login.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    // On récupère `login` ET `isAuthenticated` depuis le contexte
    const { login, isAuthenticated } = useAuth();

    // --- LA MODIFICATION CLÉ EST ICI ---
    // Cet `useEffect` s'exécutera à chaque fois que `isAuthenticated` changera.
    useEffect(() => {
        // Si l'utilisateur devient authentifié (après une connexion réussie),
        // alors on le redirige vers le tableau de bord.
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]); // Dépendances de l'effet

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8081/api/auth/login', formData);
            if (response.data.token) {
                // On se contente d'appeler `login`.
                // Le `useEffect` ci-dessus s'occupera de la redirection
                // une fois que l'état `isAuthenticated` sera bien mis à jour.
                login(response.data.token);
            } else {
                // Cas peu probable où le serveur répond 200 OK mais sans token.
                setError("Une erreur est survenue lors de la connexion.");
            }
        } catch (err) {
            setError('Email ou mot de passe incorrect.');
        }
    };

    return (
        <div className="min-h-screen relative">
            <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/images/esprim-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.65)" }} />
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
                        <p className="mt-2 text-sm text-gray-600">Accédez à la gestion de stock ESPRIM</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" value={formData.email} required onChange={handleChange} className="input-style mt-1" />
                        </div>
                        <div>
                            <label htmlFor="password">Mot de passe</label>
                            <input id="password" name="password" type="password" value={formData.password} required onChange={handleChange} className="input-style mt-1" />
                        </div>
                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                        <button type="submit" className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Se connecter</button>
                        <div className="text-sm text-center">
                            <span className="text-gray-600">Vous n'avez pas de compte ? </span>
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Inscrivez-vous</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;