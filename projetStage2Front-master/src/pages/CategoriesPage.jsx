// src/pages/CategoriesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const API_URL = 'http://localhost:8081/api/categories';

const AddCategoryModal = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const handleSubmit = (e) => { e.preventDefault(); onSave({ name, description }); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter une catégorie</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-style mt-1" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="input-style mt-1"></textarea>
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

const EditCategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState(category);
  useEffect(() => { setFormData(category); }, [category]);
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier la catégorie</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} className="input-style mt-1" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows="3" className="input-style mt-1"></textarea>
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

const DeleteCategoryModal = ({ category, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2>
        <p className="mt-4">Êtes-vous sûr de vouloir supprimer : <span className="font-semibold">{category?.name}</span> ?</p>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button>
          <button onClick={() => onConfirm(category)} className="px-6 py-2 bg-red-600 text-white rounded-lg">Supprimer</button>
        </div>
      </div>
    </div>
  );
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveCategory = useCallback(async (categoryData) => {
    setShowAddModal(false);
    setShowEditModal(false);
    try {
      if (categoryData.id) {
        await axios.put(`${API_URL}/${categoryData.id}`, categoryData);
      } else {
        await axios.post(API_URL, categoryData);
      }
      fetchData();
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    }
  }, [fetchData]);

  const handleDeleteCategory = useCallback(async (categoryToDelete) => {
    try {
      await axios.delete(`${API_URL}/${categoryToDelete.id}`);
      fetchData();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  }, [fetchData]);

  const handleOpenEditModal = useCallback((category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  }, []);

  const handleOpenDeleteModal = useCallback((category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  }, []);

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Catégories</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <FiPlus className="mr-2" /> Ajouter une catégorie
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-style">Nom</th>
                <th className="th-style">Description</th>
                <th className="th-style">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="td-style font-medium">{category.name}</td>
                  <td className="td-style">{category.description || '-'}</td>
                  <td className="td-style">
                    <div className="flex gap-4">
                      <button onClick={() => handleOpenEditModal(category)}>
                        <FiEdit className="h-5 w-5 text-indigo-600" />
                      </button>
                      <button onClick={() => handleOpenDeleteModal(category)}>
                        <FiTrash2 className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8">Aucune catégorie trouvée. Commencez par en ajouter une !</p>
          )}
        </div>
      </div>

      {showAddModal && <AddCategoryModal onClose={() => setShowAddModal(false)} onSave={handleSaveCategory} />}
      {showEditModal && <EditCategoryModal category={selectedCategory} onClose={() => setShowEditModal(false)} onSave={handleSaveCategory} />}
      {showDeleteModal && <DeleteCategoryModal category={selectedCategory} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteCategory} />}
    </>
  );
};
export default CategoriesPage;