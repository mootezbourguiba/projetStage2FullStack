// src/pages/EmpruntsPage.jsx

import React, { useState, useEffect } from 'react'; // <<--- Ajoutez useEffect
import axios from 'axios'; // <<--- Importez axios
import { FiPlus, FiCheckCircle } from 'react-icons/fi';

// --- Les modales AddLoanModal et ReturnLoanModal ne changent pas pour l'instant ---
// ... (gardez le code des deux modales tel quel) ...


// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const EmpruntsPage = () => {
  // Remplacer les données statiques par des états vides
  const [loans, setLoans] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // --- FONCTION POUR CHARGER LES DONNÉES DEPUIS L'API ---
  const fetchData = async () => {
    try {
      setLoading(true);
      // Charger les emprunts ET les produits en parallèle
      const [loansResponse, productsResponse] = await Promise.all([
        axios.get('http://localhost:8081/api/emprunts'),
        axios.get('http://localhost:8081/api/products') // Assurez-vous que cette URL est correcte
      ]);
      setLoans(loansResponse.data);
      setProducts(productsResponse.data);
      setError(null);
    } catch (err) {
      console.error("Erreur de chargement des données:", err);
      setError("Impossible de charger les données depuis le serveur.");
    } finally {
      setLoading(false);
    }
  };

  // --- CHARGER LES DONNÉES AU MONTAGE DU COMPOSANT ---
  useEffect(() => {
    fetchData();
  }, []); // Le tableau vide signifie que cela s'exécute une seule fois

  // --- FONCTION POUR SAUVEGARDER UN NOUVEL EMPRUNT VIA L'API ---
  const handleSaveLoan = async (loanData) => {
    try {
      // NOTE: Le backend attend `nomEmprunteur`, pas `borrowerName`
      // NOTE: Le backend attend `dateRetourPrevue`, pas `returnDate`
      // NOTE: Le backend attend `quantite` et `notes`, qu'il faut ajouter au formulaire
      const newLoanPayload = {
        productId: parseInt(loanData.productId),
        nomEmprunteur: loanData.borrowerName,
        dateRetourPrevue: loanData.returnDate || null,
        quantite: 1, // <<--- IMPORTANT: à ajouter au formulaire plus tard
        notes: ''    // <<--- IMPORTANT: à ajouter au formulaire plus tard
      };

      await axios.post('http://localhost:8081/api/emprunts', newLoanPayload);
      
      // Après succès, recharger les données pour voir le nouvel emprunt
      fetchData();

    } catch (error) {
      console.error("Erreur lors de la création de l'emprunt:", error);
      alert("Une erreur est survenue. Vérifiez le stock disponible.");
    }
  };

  // --- FONCTION POUR MARQUER UN EMPRUNT COMME RENDU VIA L'API ---
  const handleConfirmReturn = async (loanToReturn, status) => {
    try {
      await axios.put(`http://localhost:8081/api/emprunts/${loanToReturn.id}/retour`);
      
      // Après succès, recharger les données
      fetchData();
      
    } catch (error) {
        console.error("Erreur lors du retour de l'emprunt:", error);
        alert("Une erreur est survenue lors du retour du produit.");
    } finally {
        setShowReturnModal(false);
    }
  };

  const getStatusBadge = (status) => {
    // Adapter au statut du backend: EN_COURS ou RETOURNE
    if (status === 'RETOURNE') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800'; // EN_COURS
  };

  // --- GESTION DE L'AFFICHAGE (chargement, erreur, données) ---
  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Le reste du JSX ne change pas beaucoup */}
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
                  {/* Utiliser les données de l'API */}
                  <td className="td-style font-medium">{loan.product.name}</td>
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