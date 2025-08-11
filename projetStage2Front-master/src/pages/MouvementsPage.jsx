// src/pages/MouvementsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';
import MovementModal from '../components/MovementModal';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE_URL = 'http://localhost:8081/api';

const MouvementsPage = () => {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('in');

  const fetchData = async () => {
    try {
      setLoading(true);
      // On charge toutes les listes nécessaires en parallèle
      const [movRes, prodRes, supRes, cliRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/movements`),
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/suppliers`),
        axios.get(`${API_BASE_URL}/clients`)
      ]);
      setMovements(movRes.data);
      setProducts(prodRes.data);
      setSuppliers(supRes.data);
      setClients(cliRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleSaveMovement = async (movementData) => {
    setShowModal(false);
    
    // On prépare l'objet à envoyer au backend, en liant les entités
    const payload = {
      ...movementData,
      product: { id: movementData.productId },
      supplier: movementData.type === 'in' ? { id: movementData.partyId } : null,
      client: movementData.type === 'out' ? { id: movementData.partyId } : null
    };

    try {
      await axios.post(`${API_BASE_URL}/movements`, payload);
      fetchData(); // On rafraîchit toutes les listes pour voir le nouveau mouvement et le stock mis à jour
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du mouvement:", error);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = movements.map(m => ({
      'Date': m.date,
      'Produit': m.product?.name,
      'Type': m.type === 'in' ? 'Entrée' : 'Sortie',
      'Quantité': m.quantity,
      'Fournisseur/Client': m.supplier?.name || m.client?.name || 'N/A',
      'Utilisateur': 'admin' // À remplacer par m.user?.name plus tard
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mouvements');
    XLSX.writeFile(workbook, 'Historique_Mouvements.xlsx');
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text('Historique des Mouvements de Stock', 14, 20);
    autoTable(doc, {
      head: [['Date', 'Produit', 'Type', 'Quantité', 'Fournisseur/Client']],
      body: movements.map(m => [
        m.date,
        m.product?.name,
        m.type === 'in' ? 'Entrée' : 'Sortie',
        m.quantity,
        m.supplier?.name || m.client?.name || 'N/A'
      ]),
      startY: 30,
    });
    doc.save('Historique_Mouvements.pdf');
  };

  if (loading) {
    return <div className="text-center p-8">Chargement des données...</div>;
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Historique des Mouvements</h1>
          <div className="flex gap-3">
            <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"><FaFileExcel /> Excel</button>
            <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"><FaFilePdf /> PDF</button>
            <button onClick={() => handleOpenModal('in')} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><FiArrowUpCircle /> Enregistrer une Entrée</button>
            <button onClick={() => handleOpenModal('out')} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><FiArrowDownCircle /> Enregistrer une Sortie</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr><th className="th-style">Date</th><th className="th-style">Produit</th><th className="th-style">Fournisseur / Client</th><th className="th-style">Type</th><th className="th-style">Quantité</th><th className="th-style">Utilisateur</th></tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movements.map((mov) => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="td-style">{mov.date}</td>
                  <td className="td-style font-medium">{mov.product?.name}</td>
                  <td className="td-style text-sm text-gray-500">{mov.supplier?.name || mov.client?.name || 'N/A'}</td>
                  <td className="td-style"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${mov.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{mov.type === 'in' ? 'Entrée' : 'Sortie'}</span></td>
                  <td className={`td-style font-bold ${mov.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>{mov.type === 'in' ? '+' : '-'}{mov.quantity}</td>
                  <td className="td-style">admin</td>
                </tr>
              ))}
            </tbody>
          </table>
           {movements.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-8">Aucun mouvement trouvé. Commencez par en ajouter un !</p>
          )}
        </div>
      </div>
      {showModal && ( <MovementModal type={modalType} onClose={() => setShowModal(false)} onSave={handleSaveMovement} products={products} suppliers={suppliers} clients={clients} /> )}
    </>
  );
};
export default MouvementsPage;