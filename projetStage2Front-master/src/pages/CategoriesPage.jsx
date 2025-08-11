// src/pages/CategoriesPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const API_URL = 'http://localhost:8081/api/categories';

// --- MODAL COMPONENTS (Aucun changement ici) ---

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
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

// --- MAIN PAGE COMPONENT ---

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
      console.error("Erreur lors du chargement des catégories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveCategory = useCallback(async (categoryData) => {
    const isEditing = !!categoryData.id;
    const url = isEditing ? `${API_URL}/${categoryData.id}` : API_URL;
    const method = isEditing ? 'put' : 'post';

    try {
      await axios[method](url, categoryData);
      fetchData(); // Rafraîchir les données en cas de succès
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la catégorie:", error);
      alert("Une erreur est survenue lors de la sauvegarde.");
    } finally {
        setShowAddModal(false);
        setShowEditModal(false);
    }
  }, [fetchData]);
  
  // ==================================================================
  // --- MISE À JOUR DE LA MÉTHODE DE SUPPRESSION ---
  // ==================================================================
  const handleDeleteCategory = useCallback(async (categoryToDelete) => {
    try {
      // Tente de supprimer la catégorie via l'API
      await axios.delete(`${API_URL}/${categoryToDelete.id}`);
      
      // Si la suppression réussit :
      alert('Catégorie supprimée avec succès !'); // Informe l'utilisateur du succès
      fetchData(); // Met à jour la liste des catégories à l'écran
      setShowDeleteModal(false); // Ferme la modale de confirmation
      setSelectedCategory(null); // Nettoie la sélection

    } catch (error) {
      // Si la suppression échoue :
      console.error("Erreur lors de la suppression:", error.response || error);

      // Affiche le message d'erreur spécifique renvoyé par le backend (ex: 409 Conflict)
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Erreur : ${error.response.data.message}`);
      } else {
        // Affiche un message générique si aucune information spécifique n'est disponible
        alert("Une erreur inattendue est survenue. Impossible de supprimer la catégorie.");
      }
      // IMPORTANT : On ne ferme PAS la modale en cas d'erreur pour que l'utilisateur comprenne le contexte.
    }
  }, [fetchData]);
  // ==================================================================

  const handleOpenEditModal = useCallback((category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  }, []);

  const handleOpenDeleteModal = useCallback((category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  }, []);

  if (loading) return <div className="text-center p-8">Chargement des données...</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Catégories</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
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
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="td-style font-medium">{category.name}</td>
                  <td className="td-style text-gray-600">{category.description || <span className="text-gray-400">-</span>}</td>
                  <td className="td-style">
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleOpenEditModal(category)} title="Modifier la catégorie">
                        <FiEdit className="h-5 w-5 text-indigo-600 hover:text-indigo-800 transition-colors pointer-events-none" />
                      </button>
                      <button onClick={() => handleOpenDeleteModal(category)} title="Supprimer la catégorie">
                        <FiTrash2 className="h-5 w-5 text-red-600 hover:text-red-800 transition-colors pointer-events-none" />
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
      {showEditModal && selectedCategory && <EditCategoryModal category={selectedCategory} onClose={() => setShowEditModal(false)} onSave={handleSaveCategory} />}
      {showDeleteModal && selectedCategory && <DeleteCategoryModal category={selectedCategory} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteCategory} />}
    </>
  );
};

export default CategoriesPage;