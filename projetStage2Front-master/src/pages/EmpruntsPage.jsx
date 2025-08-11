// src/pages/EmpruntsPage.jsx

import React, { useState } from 'react';
import { FiPlus, FiCheckCircle } from 'react-icons/fi';

// --- MODALE POUR AJOUTER UN NOUVEL EMPRUNT ---
const AddLoanModal = ({ onClose, onSave, products }) => {
  const [formData, setFormData] = useState({
    productId: '',
    borrowerName: '',
    returnDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.borrowerName) {
      alert("Veuillez remplir tous les champs requis.");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Enregistrer un nouvel emprunt</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label htmlFor="productId" className="block text-sm font-medium text-gray-700">Produit emprunté</label><select id="productId" name="productId" value={formData.productId} onChange={handleInputChange} className="input-style mt-1" required><option value="" disabled>Sélectionnez un produit...</option>{products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}</select></div>
          <div><label htmlFor="borrowerName" className="block text-sm font-medium text-gray-700">Nom de l'emprunteur</label><input id="borrowerName" name="borrowerName" type="text" value={formData.borrowerName} onChange={handleInputChange} className="input-style mt-1" placeholder="Ex: Jean Dupont, Projet X..." required /></div>
          <div><label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Date de retour prévue (optionnel)</label><input id="returnDate" name="returnDate" type="date" value={formData.returnDate} onChange={handleInputChange} className="input-style mt-1" /></div>
          <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Annuler</button><button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Enregistrer l'emprunt</button></div>
        </form>
      </div>
    </div>
  );
};

// --- MODALE POUR MARQUER UN EMPRUNT COMME RENDU ---
const ReturnLoanModal = ({ loan, onClose, onConfirm }) => {
  const [returnStatus, setReturnStatus] = useState('Bon état');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800">Retour de produit</h2>
        <p className="mt-4 text-gray-600">Confirmez le retour de : <span className="font-semibold">{loan?.productName}</span></p>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">État du produit au retour :</label>
          <select value={returnStatus} onChange={(e) => setReturnStatus(e.target.value)} className="input-style mt-1">
            <option>Bon état</option>
            <option>Endommagé</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Annuler</button>
          <button onClick={() => onConfirm(loan, returnStatus)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirmer le retour</button>
        </div>
      </div>
    </div>
  );
};


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const EmpruntsPage = () => {
  const [loans, setLoans] = useState([
    { id: 1, productName: 'Ordinateur portable de démo', borrowerName: 'Alice', loanDate: '2023-10-20', returnDate: '2023-10-27', status: 'En cours' },
    { id: 2, productName: 'Projecteur vidéo', borrowerName: 'Service Marketing', loanDate: '2023-10-15', returnDate: '2023-10-22', status: 'Rendu (Bon état)' },
    { id: 3, productName: 'Perceuse sans fil', borrowerName: 'Bob (Maintenance)', loanDate: '2023-10-18', returnDate: '2023-10-25', status: 'Rendu (Endommagé)' },
  ]);
  const [products] = useState([ { id: 1, name: 'Ordinateur portable de démo' }, { id: 2, name: 'Projecteur vidéo' }, { id: 3, name: 'Perceuse sans fil' }, ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const handleSaveLoan = (loanData) => {
    const product = products.find(p => p.id === parseInt(loanData.productId));
    const newLoan = {
      id: Date.now(),
      productName: product ? product.name : 'Inconnu',
      borrowerName: loanData.borrowerName,
      loanDate: new Date().toISOString().slice(0, 10),
      returnDate: loanData.returnDate,
      status: 'En cours',
    };
    setLoans([newLoan, ...loans]);
  };

  const handleOpenReturnModal = (loan) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  const handleConfirmReturn = (loanToReturn, status) => {
    setLoans(loans.map(l => l.id === loanToReturn.id ? { ...l, status: `Rendu (${status})` } : l));
    setShowReturnModal(false);
  };

  const getStatusBadge = (status) => {
    if (status.includes('Bon état')) return 'bg-green-100 text-green-800';
    if (status.includes('Endommagé')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800'; // En cours
  };

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
              <tr>
                <th className="th-style">Produit</th><th className="th-style">Emprunteur</th><th className="th-style">Date d'emprunt</th><th className="th-style">Date de retour prévue</th><th className="th-style">Statut</th><th className="th-style">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="td-style font-medium">{loan.productName}</td>
                  <td className="td-style">{loan.borrowerName}</td>
                  <td className="td-style">{loan.loanDate}</td>
                  <td className="td-style">{loan.returnDate || 'N/A'}</td>
                  <td className="td-style"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(loan.status)}`}>{loan.status}</span></td>
                  <td className="td-style">
                    {loan.status === 'En cours' && (
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