// src/pages/FournisseursPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const API_SUPPLIERS_URL = 'http://localhost:8081/api/suppliers';
const API_CATEGORIES_URL = 'http://localhost:8081/api/categories';

// Les modales sont maintenant garanties de recevoir la bonne liste de catégories
const AddSupplierModal = ({ onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({ name: '', contactPerson: '', email: '', phone: '', categoryId: '' });
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un fournisseur</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label>Nom</label><input name="name" type="text" onChange={handleInputChange} className="input-style mt-1" required /></div>
            <div><label>Contact</label><input name="contactPerson" type="text" onChange={handleInputChange} className="input-style mt-1" /></div>
            <div><label>Email</label><input name="email" type="email" onChange={handleInputChange} className="input-style mt-1" /></div>
            <div><label>Téléphone</label><input name="phone" type="tel" onChange={handleInputChange} className="input-style mt-1" /></div>
          </div>
          <div>
            <label>Catégorie Principale</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="input-style mt-1" required>
              <option value="">Sélectionnez une catégorie...</option>
              {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditSupplierModal = ({ supplier, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({ ...supplier, categoryId: supplier.category?.id || '' });
  useEffect(() => { setFormData({ ...supplier, categoryId: supplier.category?.id || '' }); }, [supplier]);
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier le fournisseur</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label>Nom</label><input name="name" type="text" value={formData.name} onChange={handleInputChange} className="input-style mt-1" required /></div>
            <div><label>Contact</label><input name="contactPerson" type="text" value={formData.contactPerson} onChange={handleInputChange} className="input-style mt-1" /></div>
            <div><label>Email</label><input name="email" type="email" value={formData.email} onChange={handleInputChange} className="input-style mt-1" /></div>
            <div><label>Téléphone</label><input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="input-style mt-1" /></div>
          </div>
          <div>
            <label>Catégorie Principale</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="input-style mt-1" required>
              <option value="">Sélectionnez...</option>
              {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Modifier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteSupplierModal = ({ supplier, onClose, onConfirm }) => {
  return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"><h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2><p className="mt-4">Êtes-vous sûr de vouloir supprimer : <span className="font-semibold">{supplier?.name}</span> ?</p><div className="flex justify-end space-x-4 mt-8"><button onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button><button onClick={() => onConfirm(supplier)} className="px-6 py-2 bg-red-600 text-white rounded-lg">Supprimer</button></div></div></div> );
};

const FournisseursPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [suppliersRes, categoriesRes] = await Promise.all([
        axios.get(API_SUPPLIERS_URL),
        axios.get(API_CATEGORIES_URL)
      ]);
      setSuppliers(suppliersRes.data);
      setCategories(categoriesRes.data);
    } catch (error) { console.error("Erreur chargement:", error); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOpenEditModal = useCallback((supplier) => { setSelectedSupplier(supplier); setShowEditModal(true); }, []);
  const handleOpenDeleteModal = useCallback((supplier) => { setSelectedSupplier(supplier); setShowDeleteModal(true); }, []);

  const handleSaveSupplier = useCallback(async (supplierData) => {
    setShowAddModal(false);
    setShowEditModal(false);
    const payload = { ...supplierData, category: supplierData.categoryId ? { id: supplierData.categoryId } : null };
    try {
      if (payload.id) { await axios.put(`${API_SUPPLIERS_URL}/${payload.id}`, payload); } 
      else { await axios.post(API_SUPPLIERS_URL, payload); }
      fetchData();
    } catch (error) { console.error("Erreur sauvegarde:", error); }
  }, [fetchData]);

  const handleDeleteSupplier = useCallback(async (supplierToDelete) => {
    try {
      await axios.delete(`${API_SUPPLIERS_URL}/${supplierToDelete.id}`);
      fetchData();
      setShowDeleteModal(false);
    } catch (error) { console.error("Erreur suppression:", error); }
  }, [fetchData]);

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Fournisseurs</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <FiPlus className="mr-2" /> Ajouter un fournisseur
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr><th className="th-style">Nom</th><th className="th-style">Contact</th><th className="th-style">Email</th><th className="th-style">Téléphone</th><th className="th-style">Catégorie Principale</th><th className="th-style">Actions</th></tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="td-style font-medium">{supplier.name}</td>
                  <td className="td-style">{supplier.contactPerson}</td>
                  <td className="td-style">{supplier.email}</td>
                  <td className="td-style">{supplier.phone}</td>
                  <td className="td-style">{supplier.category?.name || 'N/A'}</td>
                  <td className="td-style">
                    <div className="flex gap-4">
                      <button onClick={() => handleOpenEditModal(supplier)}><FiEdit className="h-5 w-5 text-indigo-600" /></button>
                      <button onClick={() => handleOpenDeleteModal(supplier)}><FiTrash2 className="h-5 w-5 text-red-600" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showAddModal && <AddSupplierModal onClose={() => setShowAddModal(false)} onSave={handleSaveSupplier} categories={categories} />}
      {showEditModal && <EditSupplierModal supplier={selectedSupplier} onClose={() => setShowEditModal(false)} onSave={handleSaveSupplier} categories={categories} />}
      {showDeleteModal && <DeleteSupplierModal supplier={selectedSupplier} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteSupplier} />}
    </>
  );
};

export default FournisseursPage;