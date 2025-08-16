import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', formData);
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token); // On stocke le vrai token
        // Il faudra aussi configurer axios pour envoyer ce token à chaque requête
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/dashboard');
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
              <input id="email" name="email" type="email" required onChange={handleChange} className="input-style mt-1" />
            </div>
            <div>
              <label htmlFor="password">Mot de passe</label>
              <input id="password" name="password" type="password" required onChange={handleChange} className="input-style mt-1" />
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