// src/components/MovementModal.jsx

import React, { useState } from 'react';

// -- AJOUT -- : On accepte 'suppliers' et 'clients' en plus des props existantes
const MovementModal = ({ type, onClose, onSave, products, suppliers, clients }) => {
  // Détermine la couleur et le titre en fonction du type de mouvement
  const isEntry = type === 'in';
  const title = isEntry ? 'Enregistrer une Entrée' : 'Enregistrer une Sortie';
  const buttonColor = isEntry ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';
  // -- AJOUT -- : On détermine le label et la liste à utiliser dynamiquement
  const partyLabel = isEntry ? 'Fournisseur' : 'Client';
  const partyList = isEntry ? suppliers : clients;

  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    date: new Date().toISOString().slice(0, 10),
    notes: '',
    partyId: '', // -- AJOUT -- : Nouveau champ pour l'ID du fournisseur/client
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // -- AJOUT -- : On vérifie aussi que le fournisseur/client est sélectionné
    if (!formData.productId || !formData.partyId) {
      alert(`Veuillez sélectionner un produit et un ${partyLabel.toLowerCase()}.`);
      return;
    }
    onSave({ ...formData, type });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Produit</label>
              <select id="productId" name="productId" value={formData.productId} onChange={handleInputChange} className="input-style mt-1" required>
                <option value="" disabled>Sélectionnez un produit...</option>
                {products.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            
            {/* --- AJOUT DU CHAMP DYNAMIQUE: FOURNISSEUR OU CLIENT --- */}
            <div>
              <label htmlFor="partyId" className="block text-sm font-medium text-gray-700">{partyLabel}</label>
              <select id="partyId" name="partyId" value={formData.partyId} onChange={handleInputChange} className="input-style mt-1" required>
                <option value="" disabled>Sélectionnez un {partyLabel.toLowerCase()}...</option>
                {partyList.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantité</label>
              <input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} className="input-style mt-1" min="1" required />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date du mouvement</label>
              <input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} className="input-style mt-1" required />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (optionnel)</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows="2" className="input-style mt-1" placeholder="Ex: Bon de livraison n°123, retour fournisseur..."></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">Annuler</button>
            <button type="submit" className={`px-6 py-2 text-white rounded-lg shadow-sm transition-colors ${buttonColor}`}>{title}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementModal;