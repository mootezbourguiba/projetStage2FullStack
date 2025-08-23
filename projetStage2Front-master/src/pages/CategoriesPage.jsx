// src/pages/EmpruntsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPlus, FiCheckCircle } from 'react-icons/fi';

const API_URL = 'http://localhost:8081/api/emprunts';
const PRODUCTS_API_URL = 'http://localhost:8081/api/products';

// --- MODAL D'AJOUT ET DE MODIFICATION (combiné) ---
const LoanFormModal = ({ loan, products, onClose, onSave }) => {
  const isEditing = !!loan;
  const initialData = {
    productId: '',
    nomEmprunteur: '',
    quantite: 1,
    dateRetourPrevue: '',
    notes: '',
    ...(loan || {}) // Fusionne l'emprunt existant s'il est fourni (pour l'édition)
  };
  
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    // Transformer l'objet `product` en `productId` pour le formulaire
    const dataToSet = loan ? { ...loan, productId: loan.product?.id || '' } : initialData;
    setFormData(dataToSet);
  }, [loan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.nomEmprunteur || formData.quantite < 1) {
      alert("Veuillez remplir tous les champs requis et vérifier la quantité.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Modifier' : 'Ajouter'} un emprunt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Produit</label>
            <select id="productId" name="productId" value={formData.productId} onChange={handleInputChange} className="input-style mt-1" required disabled={isEditing}>
              <option value="" disabled>Sélectionnez un produit...</option>
              {products.map(p => (<option key={p.id} value={p.id}>{p.name} (Stock: {p.currentStock})</option>))}
            </select>
            {isEditing && <p className="text-xs text-gray-500 mt-1">Le produit ne peut pas être modifié après la création de l'emprunt.</p>}
          </div>
          <div><label htmlFor="nomEmprunteur">Nom de l'emprunteur</label><input id="nomEmprunteur" name="nomEmprunteur" type="text" value={formData.nomEmprunteur} onChange={handleInputChange} className="input-style mt-1" required /></div>
          <div><label htmlFor="quantite">Quantité</label><input id="quantite" name="quantite" type="number" min="1" value={formData.quantite} onChange={handleInputChange} className="input-style mt-1" required disabled={isEditing} /></div>
          <div><label htmlFor="dateRetourPrevue">Date de retour prévue</label><input id="dateRetourPrevue" name="dateRetourPrevue" type="date" value={formData.dateRetourPrevue || ''} onChange={handleInputChange} className="input-style mt-1" /></div>
          <div><label htmlFor="notes">Notes</label><textarea id="notes" name="notes" value={formData.notes || ''} onChange={handleInputChange} rows="2" className="input-style mt-1"></textarea></div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">{isEditing ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MODAL DE SUPPRESSION ---
const DeleteLoanModal = ({ loan, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2>
      <p className="mt-4">Êtes-vous sûr de vouloir supprimer l'emprunt du produit <span className="font-semibold">{loan?.product?.name}</span> par <span className="font-semibold">{loan?.nomEmprunteur}</span> ?</p>
      {loan?.statut === 'EN_COURS' && <p className="mt-2 text-sm text-orange-600">Attention : Le stock du produit sera réajusté.</p>}
      <div className="flex justify-end space-x-4 mt-8">
        <button onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button>
        <button onClick={() => onConfirm(loan)} className="px-6 py-2 bg-red-600 text-white rounded-lg">Supprimer</button>
      </div>
    </div>
  </div>
);


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const EmpruntsPage = () => {
  const [loans, setLoans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [loansRes, productsRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(PRODUCTS_API_URL)
      ]);
      setLoans(loansRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Erreur de chargement des données:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveLoan = useCallback(async (loanData) => {
    const isEditing = !!loanData.id;
    const payload = { ...loanData, productId: loanData.productId };

    const url = isEditing ? `${API_URL}/${loanData.id}` : API_URL;
    const method = isEditing ? 'put' : 'post';

    try {
      await axios[method](url, payload);
      fetchData();
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setShowFormModal(false);
      setSelectedLoan(null);
    }
  }, [fetchData]);

  const handleDeleteLoan = useCallback(async (loanToDelete) => {
    try {
      await axios.delete(`${API_URL}/${loanToDelete.id}`);
      fetchData();
    } catch (error) {
      alert("Impossible de supprimer cet emprunt.");
    } finally {
      setShowDeleteModal(false);
      setSelectedLoan(null);
    }
  }, [fetchData]);

  const handleReturnLoan = useCallback(async (loanToReturn) => {
    if (window.confirm("Confirmez-vous le retour de ce produit ?")) {
      try {
        await axios.put(`${API_URL}/${loanToReturn.id}/retour`);
        fetchData();
      } catch (error) {
        alert("Erreur lors du retour du produit.");
      }
    }
  }, [fetchData]);

  const handleOpenFormModal = (loan = null) => {
    setSelectedLoan(loan);
    setShowFormModal(true);
  };
  
  const handleOpenDeleteModal = (loan) => {
    setSelectedLoan(loan);
    setShowDeleteModal(true);
  };
  
  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Emprunts</h1>
          <button onClick={() => handleOpenFormModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
            <FiPlus className="mr-2" /> Ajouter un emprunt
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="th-style">Produit</th>
                <th className="th-style">Emprunteur</th>
                <th className="th-style">Qté</th>
                <th className="th-style">Date d'emprunt</th>
                <th className="th-style">Retour prévu</th>
                <th className="th-style">Statut</th>
                <th className="th-style">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="td-style font-medium">{loan.product?.name || 'N/A'}</td>
                  <td className="td-style">{loan.nomEmprunteur}</td>
                  <td className="td-style">{loan.quantite}</td>
                  <td className="td-style">{loan.dateEmprunt}</td>
                  <td className="td-style">{loan.dateRetourPrevue || '-'}</td>
                  <td className="td-style">
                    <span className={`px-2 py-1 text-xs rounded-full ${loan.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {loan.statut === 'EN_COURS' ? 'En cours' : 'Retourné'}
                    </span>
                  </td>
                  <td className="td-style">
                    <div className="flex items-center gap-4">
                      {loan.statut === 'EN_COURS' && (
                        <button onClick={() => handleReturnLoan(loan)} title="Marquer comme retourné">
                          <FiCheckCircle className="h-5 w-5 text-green-600 hover:text-green-800" />
                        </button>
                      )}
                      <button onClick={() => handleOpenFormModal(loan)} title="Modifier">
                        <FiEdit className="h-5 w-5 text-indigo-600 hover:text-indigo-800" />
                      </button>
                      <button onClick={() => handleOpenDeleteModal(loan)} title="Supprimer">
                        <FiTrash2 className="h-5 w-5 text-red-600 hover:text-red-800" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* C'est ici que l'appel est fait. Il faut bien utiliser les noms définis en haut du fichier */}
      {showFormModal && <LoanFormModal loan={selectedLoan} products={products} onClose={() => setShowFormModal(false)} onSave={handleSaveLoan} />}
      {showDeleteModal && selectedLoan && <DeleteLoanModal loan={selectedLoan} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteLoan} />}
    </>
  );
};

export default EmpruntsPage;