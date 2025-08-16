import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'VIEWER' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:8081/api/auth/register', formData);
      alert('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      setError('Erreur lors de la création du compte. Cet email est peut-être déjà utilisé.');
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/images/esprim-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.65)" }} />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
            <p className="mt-2 text-sm text-gray-600">Rejoignez la plateforme de gestion de stock ESPRIM</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nom complet</label>
              <input id="name" name="name" type="text" required onChange={handleChange} className="input-style mt-1" />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required onChange={handleChange} className="input-style mt-1" />
            </div>
            <div>
              <label htmlFor="password">Mot de passe</label>
              <input id="password" name="password" type="password" required onChange={handleChange} className="input-style mt-1" />
            </div>
            <div>
              <label htmlFor="role">Rôle</label>
              <select id="role" name="role" onChange={handleChange} value={formData.role} className="input-style mt-1">
                <option value="VIEWER">Viewer</option>
                <option value="OPERATEUR">Opérateur</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button type="submit" className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">S'inscrire</button>
            <div className="text-sm text-center">
              <span className="text-gray-600">Vous avez déjà un compte ? </span>
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Connectez-vous</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;