// src/pages/FournisseursPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const API_SUPPLIERS_URL = 'http://localhost:8081/api/suppliers';
const API_CATEGORIES_URL = 'http://localhost:8081/api/categories';

// --- MODALE MISE À JOUR AVEC CHECKLIST ---
const SupplierModal = ({ onClose, onSave, categories, supplierToEdit }) => {
    // Détermine si on est en mode édition
    const isEditing = !!supplierToEdit;

    // Initialise le formulaire avec les données du fournisseur à éditer, ou des valeurs vides
    const [formData, setFormData] = useState({
        name: supplierToEdit?.name || '',
        contactPerson: supplierToEdit?.contactPerson || '',
        email: supplierToEdit?.email || '',
        phone: supplierToEdit?.phone || '',
    });

    // Initialise les catégories cochées à partir du fournisseur à éditer
    const [selectedCategoryIds, setSelectedCategoryIds] = useState(
        new Set(supplierToEdit?.categories?.map(cat => cat.id) || [])
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategoryIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            id: supplierToEdit?.id, // Inclut l'ID si on est en mode édition
            categoryIds: Array.from(selectedCategoryIds),
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {isEditing ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div><label className="block text-sm font-medium text-gray-600">Nom du fournisseur</label><input name="name" type="text" value={formData.name} onChange={handleInputChange} className="input-style mt-1" required /></div>
                        <div><label className="block text-sm font-medium text-gray-600">Personne à contacter</label><input name="contactPerson" type="text" value={formData.contactPerson} onChange={handleInputChange} className="input-style mt-1" /></div>
                        <div><label className="block text-sm font-medium text-gray-600">Email</label><input name="email" type="email" value={formData.email} onChange={handleInputChange} className="input-style mt-1" /></div>
                        <div><label className="block text-sm font-medium text-gray-600">Téléphone</label><input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="input-style mt-1" /></div>
                    </div>
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Catégories Fournies</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 border rounded-lg max-h-40 overflow-y-auto">
                            {Array.isArray(categories) && categories.map(cat => (
                                <label key={cat.id} className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={selectedCategoryIds.has(cat.id)} onChange={() => handleCategoryChange(cat.id)} />
                                    <span className="text-gray-700">{cat.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">{isEditing ? 'Modifier' : 'Ajouter'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ... La modale de suppression reste identique ...
const DeleteSupplierModal = ({ supplier, onClose, onConfirm }) => {
    return (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"><h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2><p className="mt-4">Êtes-vous sûr de vouloir supprimer : <span className="font-semibold">{supplier?.name}</span> ?</p><div className="flex justify-end space-x-4 mt-8"><button onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button><button onClick={() => onConfirm(supplier)} className="px-6 py-2 bg-red-600 text-white rounded-lg">Supprimer</button></div></div></div>);
};

const FournisseursPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [deletingSupplier, setDeletingSupplier] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [suppliersRes, categoriesRes] = await Promise.all([
                axios.get(API_SUPPLIERS_URL).catch(() => ({ data: [] })),
                axios.get(API_CATEGORIES_URL).catch(() => ({ data: [] })),
            ]);
            setSuppliers(suppliersRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSaveSupplier = useCallback(async (payload) => {
        const isEditing = !!payload.id;
        const url = isEditing ? `${API_SUPPLIERS_URL}/${payload.id}` : API_SUPPLIERS_URL;
        const method = isEditing ? 'put' : 'post';
        try {
            await axios[method](url, payload);
            alert(`Fournisseur ${isEditing ? 'modifié' : 'ajouté'} avec succès !`);
            setShowModal(false);
            setEditingSupplier(null);
            fetchData();
        } catch (error) {
            console.error("Erreur sauvegarde:", error.response || error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        }
    }, [fetchData]);

    const handleDeleteSupplier = useCallback(async (supplierToDelete) => {
        try {
            await axios.delete(`${API_SUPPLIERS_URL}/${supplierToDelete.id}`);
            alert("Fournisseur supprimé avec succès !");
            setDeletingSupplier(null);
            fetchData();
        } catch (error) {
            const message = error.response?.data?.message || "Impossible de supprimer. Ce fournisseur est peut-être lié à des mouvements de stock.";
            alert(`Erreur: ${message}`);
        }
    }, [fetchData]);
    
    const handleOpenModal = (supplier = null) => {
        setEditingSupplier(supplier);
        setShowModal(true);
    };

    if (loading) return <div className="text-center p-8">Chargement...</div>;

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Gestion des Fournisseurs</h1>
                    <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><FiPlus className="mr-2" /> Ajouter un fournisseur</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="th-style">Nom</th>
                                <th className="th-style">Contact</th>
                                <th className="th-style">Catégories Fournies</th>
                                <th className="th-style">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id}>
                                    <td className="td-style font-medium">{supplier.name}</td>
                                    <td className="td-style">{supplier.contactPerson || '-'}</td>
                                    <td className="td-style">
                                        <div className="flex flex-wrap gap-1">
                                            {supplier.categories.map(cat => (
                                                <span key={cat.id} className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">{cat.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="td-style">
                                        <div className="flex gap-4">
                                            <button onClick={() => handleOpenModal(supplier)}><FiEdit className="h-5 w-5 text-indigo-600" /></button>
                                            <button onClick={() => setDeletingSupplier(supplier)}><FiTrash2 className="h-5 w-5 text-red-600" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <SupplierModal onClose={() => { setShowModal(false); setEditingSupplier(null); }} onSave={handleSaveSupplier} categories={categories} supplierToEdit={editingSupplier} />}
            {deletingSupplier && <DeleteSupplierModal supplier={deletingSupplier} onClose={() => setDeletingSupplier(null)} onConfirm={handleDeleteSupplier} />}
        </>
    );
};

export default FournisseursPage;