// src/pages/EmpruntsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiPlus, FiCheckCircle } from 'react-icons/fi';

const API_EMPRUNTS_URL = 'http://localhost:8081/api/emprunts';
const API_PRODUCTS_URL = 'http://localhost:8081/api/products';

const AddLoanModal = ({ onClose, onSave, products }) => {
  // --- SYNCHRONISATION : On utilise les noms de champs attendus par le backend ---
  const [formData, setFormData] = useState({ productId: '', nomEmprunteur: '', dateRetourPrevue: '' });
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); onClose(); };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Enregistrer un nouvel emprunt</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="productId" className="block text-sm font-medium">Produit emprunté</label>
            <select id="productId" name="productId" value={formData.productId} onChange={handleInputChange} className="input-style mt-1" required>
              <option value="" disabled>Sélectionnez un produit...</option>
              {products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>
          <div>
            {/* --- SYNCHRONISATION : Le 'name' est 'nomEmprunteur' --- */}
            <label htmlFor="nomEmprunteur" className="block text-sm font-medium">Nom de l'emprunteur</label>
            <input id="nomEmprunteur" name="nomEmprunteur" type="text" value={formData.nomEmprunteur} onChange={handleInputChange} className="input-style mt-1" required />
          </div>
          <div>
            {/* --- SYNCHRONISATION : Le 'name' est 'dateRetourPrevue' --- */}
            <label htmlFor="dateRetourPrevue" className="block text-sm font-medium">Date de retour prévue</label>
            <input id="dateRetourPrevue" name="dateRetourPrevue" type="date" value={formData.dateRetourPrevue} onChange={handleInputChange} className="input-style mt-1" />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReturnLoanModal = ({ loan, onClose, onConfirm }) => {
  const [returnStatus, setReturnStatus] = useState('Bon état');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800">Retour de produit</h2>
        <p className="mt-4 text-gray-600">Confirmez le retour de : <span className="font-semibold">{loan?.product.name}</span></p>
        <div className="mt-6">
          <label htmlFor="returnStatus" className="block text-sm font-medium text-gray-700">État du produit au retour :</label>
          <select id="returnStatus" value={returnStatus} onChange={(e) => setReturnStatus(e.target.value)} className="input-style mt-1 w-full">
            <option>Bon état</option>
            <option>Endommagé</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button>
          <button onClick={() => onConfirm(loan, returnStatus)} className="px-6 py-2 bg-green-600 text-white rounded-lg">Confirmer le retour</button>
        </div>
      </div>
    </div>
  );
};

const EmpruntsPage = () => {
  const [loans, setLoans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const fetchData = useCallback(async () => { try { setLoading(true); const [loansResponse, productsResponse] = await Promise.all([ axios.get(API_EMPRUNTS_URL), axios.get(API_PRODUCTS_URL) ]); setLoans(loansResponse.data); setProducts(productsResponse.data); setError(null); } catch (err) { console.error("Erreur:", err); setError("Impossible de charger les données."); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveLoan = useCallback(async (loanData) => {
    try {
      // --- SYNCHRONISATION : Le payload correspond maintenant au DTO du backend ---
      await axios.post(API_EMPRUNTS_URL, loanData);
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Vérifiez que le stock est suffisant.";
      console.error("Erreur création emprunt:", error.response || error);
      alert(`Erreur : ${errorMessage}`);
    }
  }, [fetchData]);

  const handleConfirmReturn = useCallback(async (loanToReturn, status) => {
    setShowReturnModal(false);
    try {
      await axios.put(`${API_EMPRUNTS_URL}/${loanToReturn.id}/retour`);
      fetchData();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Une erreur est survenue.";
      console.error("Erreur retour emprunt:", error.response || error);
      alert(`Erreur : ${errorMessage}`);
    }
  }, [fetchData]);

  const handleOpenReturnModal = useCallback((loan) => { setSelectedLoan(loan); setShowReturnModal(true); }, []);
  
  const getStatusBadge = (status) => {
    // Le statut vient maintenant du backend (EN_COURS, RETOURNE)
    if (status === 'RETOURNE') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800'; // EN_COURS
  };

  if (loading) return <div className="text-center p-8">Chargement...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Emprunts</h1>
          <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <FiPlus className="mr-2" /> Enregistrer un emprunt
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr><th className="th-style">Produit</th><th className="th-style">Emprunteur</th><th className="th-style">Date d'emprunt</th><th className="th-style">Retour Prévu</th><th className="th-style">Statut</th><th className="th-style">Actions</th></tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td className="td-style font-medium">{loan.product?.name}</td>
                  {/* --- SYNCHRONISATION : Utilisation des noms de champs du backend --- */}
                  <td className="td-style">{loan.nomEmprunteur}</td>
                  <td className="td-style">{loan.dateEmprunt}</td>
                  <td className="td-style">{loan.dateRetourPrevue || 'N/A'}</td>
                  <td className="td-style"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(loan.statut)}`}>{loan.statut}</span></td>
                  <td className="td-style">
                    {loan.statut === 'EN_COURS' && (
                      <button onClick={() => handleOpenReturnModal(loan)} className="flex items-center text-green-600 hover:text-green-900 text-sm">
                        <FiCheckCircle className="mr-1" /> Marquer comme Rendu
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showAddModal && <AddLoanModal onClose={() => setShowAddModal(false)} onSave={handleSaveLoan} products={products} />}
      {showReturnModal && <ReturnLoanModal loan={selectedLoan} onClose={() => setShowReturnModal(false)} onConfirm={handleConfirmReturn} />}
    </>
  );
};

export default EmpruntsPage;