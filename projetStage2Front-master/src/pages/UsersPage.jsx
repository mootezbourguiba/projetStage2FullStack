// src/pages/UsersPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const API_URL = 'http://localhost:8081/api/users';

const AddUserModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: 'viewer', password: '' });
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un utilisateur</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label>Nom</label><input name="name" type="text" onChange={handleInputChange} className="input-style mt-1" required /></div>
            <div><label>Email</label><input name="email" type="email" onChange={handleInputChange} className="input-style mt-1" required /></div>
            <div><label>Mot de passe</label><input name="password" type="password" onChange={handleInputChange} className="input-style mt-1" required /></div>
            <div><label>Rôle</label><select name="role" value={formData.role} onChange={handleInputChange} className="input-style mt-1"><option value="viewer">Viewer</option><option value="admin">Admin</option></select></div>
          </div>
          <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button><button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Ajouter</button></div>
        </form>
      </div>
    </div>
  );
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = useCallback(async () => {
    try { setLoading(true); const response = await axios.get(API_URL); setUsers(response.data); } 
    catch (error) { console.error("Erreur chargement:", error); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveUser = useCallback(async (userData) => {
    setShowAddModal(false);
    try {
      await axios.post(API_URL, userData);
      fetchData();
    } catch (error) { console.error("Erreur sauvegarde:", error); }
  }, [fetchData]);

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <FiPlus className="mr-2" /> Ajouter un utilisateur
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr><th className="th-style">Nom</th><th className="th-style">Email</th><th className="th-style">Rôle</th><th className="th-style">Actions</th></tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="td-style font-medium">{user.name}</td>
                  <td className="td-style">{user.email}</td>
                  <td className="td-style"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>{user.role}</span></td>
                  <td className="td-style">
                    <div className="flex gap-4">
                      <button><FiEdit className="h-5 w-5 text-indigo-600" /></button>
                      <button><FiTrash2 className="h-5 w-5 text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onSave={handleSaveUser} />}
    </>
  );
};

export default UsersPage;