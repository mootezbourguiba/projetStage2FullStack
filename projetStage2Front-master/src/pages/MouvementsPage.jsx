// src/pages/MouvementsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FiArrowUpCircle, FiArrowDownCircle } from 'react-icons/fi';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNotifications } from '../context/NotificationContext';

const API_BASE_URL = 'http://localhost:8081/api';

// --- Le composant MovementModal ---
const MovementModal = ({ type, onClose, onSave, products, suppliers, clients }) => {
    const isEntree = type === 'ENTREE';
    const [formData, setFormData] = useState({
        productId: '',
        partyId: '',
        quantity: 1,
        movementDate: new Date().toISOString().slice(0, 16),
        notes: '',
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, type });
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
                <h2 className={`text-2xl font-bold mb-6 ${isEntree ? 'text-green-600' : 'text-red-600'}`}>
                    Enregistrer une {isEntree ? 'Entrée' : 'Sortie'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label>Produit</label>
                            <select
                                name="productId"
                                value={formData.productId}
                                onChange={handleInputChange}
                                className="input-style mt-1"
                                required
                            >
                                <option value="">Sélectionnez un produit...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>{isEntree ? 'Fournisseur' : 'Client'}</label>
                            <select
                                name="partyId"
                                value={formData.partyId}
                                onChange={handleInputChange}
                                className="input-style mt-1"
                                required
                            >
                                <option value="">Sélectionnez...</option>
                                {(isEntree ? suppliers : clients).map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Quantité</label>
                            <input
                                name="quantity"
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="input-style mt-1"
                                required
                            />
                        </div>
                        <div>
                            <label>Date du mouvement</label>
                            <input
                                name="movementDate"
                                type="datetime-local"
                                value={formData.movementDate}
                                onChange={handleInputChange}
                                className="input-style mt-1"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label>Notes (optionnel)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows="3"
                            className="input-style mt-1"
                            placeholder="Ex: Bon de livraison n°123..."
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className={`px-6 py-2 text-white font-semibold rounded-lg ${
                                isEntree ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- PAGE PRINCIPALE ---
const MouvementsPage = () => {
    const [movements, setMovements] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalType, setShowModalType] = useState(null);

    const { addNotification } = useNotifications();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [movRes, prodRes, supRes, cliRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/movements`),
                axios.get(`${API_BASE_URL}/products`),
                axios.get(`${API_BASE_URL}/suppliers`),
                axios.get(`${API_BASE_URL}/clients`),
            ]);
            setMovements(movRes.data);
            setProducts(prodRes.data);
            setSuppliers(supRes.data);
            setClients(cliRes.data);
        } catch (error) {
            console.error("Erreur chargement: VÉRIFIEZ QUE LE SERVEUR BACKEND EST BIEN DÉMARRÉ.", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSaveMovement = useCallback(async (movementData) => {
        const payload = {
            productId: movementData.productId,
            supplierId: movementData.type === 'ENTREE' ? movementData.partyId : null,
            clientId: movementData.type === 'SORTIE' ? movementData.partyId : null,
            type: movementData.type,
            quantity: parseInt(movementData.quantity, 10),
            movementDate: movementData.movementDate,
            notes: movementData.notes,
        };

        try {
            await axios.post(`${API_BASE_URL}/movements`, payload);
            setShowModalType(null);

            // Rafraîchir uniquement les produits
            const updatedProductsRes = await axios.get(`${API_BASE_URL}/products`);
            const updatedProducts = updatedProductsRes.data;
            setProducts(updatedProducts);

            const product = updatedProducts.find(p => String(p.id) === String(payload.productId));
            const productName = product?.name || 'Produit';
            const message = `${payload.type === 'ENTREE' ? 'Entrée' : 'Sortie'} de ${payload.quantity} unité(s) pour le produit "${productName}".`;
            addNotification(message, payload.type === 'ENTREE' ? 'in' : 'out');

            if (product && product.critical) {
                const alertMessage = `Stock bas pour "${productName}" (${product.currentStock}/${product.alertThreshold})`;
                addNotification(alertMessage, 'alert');
            }

            // Rafraîchir mouvements
            const updatedMovementsRes = await axios.get(`${API_BASE_URL}/movements`);
            setMovements(updatedMovementsRes.data);

        } catch (error) {
            const message = error.response?.data?.message || "Une erreur est survenue lors de la sauvegarde.";
            console.error("Erreur sauvegarde mouvement:", error.response || error);
            alert(`Erreur : ${message}`);
        }
    }, [addNotification]);

    // --- EXPORTS ---
    const handleExportExcel = () => {
        const dataToExport = movements.map(m => ({
            'Date': format(new Date(m.movementDate), 'dd/MM/yyyy HH:mm'),
            'Produit': m.product?.name || 'N/A',
            'Fournisseur/Client': m.supplier?.name || m.client?.name || 'N/A',
            'Type': m.type,
            'Quantité': m.type === 'ENTREE' ? `+${m.quantity}` : `-${m.quantity}`,
            'Utilisateur': 'admin'
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Mouvements');
        XLSX.writeFile(workbook, 'Historique_Mouvements.xlsx');
    };

    const handleExportPdf = () => {
        const doc = new jsPDF();
        doc.text('Historique des Mouvements', 14, 20);
        autoTable(doc, {
            head: [['Date', 'Produit', 'Fournisseur/Client', 'Type', 'Quantité', 'Utilisateur']],
            body: movements.map(m => [
                format(new Date(m.movementDate), 'dd/MM/yyyy HH:mm'),
                m.product?.name || 'N/A',
                m.supplier?.name || m.client?.name || 'N/A',
                m.type,
                (m.type === 'ENTREE' ? '+' : '-') + m.quantity,
                'admin'
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
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                            <FaFileExcel /> Excel
                        </button>
                        <button
                            onClick={handleExportPdf}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                            <FaFilePdf /> PDF
                        </button>
                        <button
                            onClick={() => setShowModalType('ENTREE')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            <FiArrowUpCircle /> Enregistrer une Entrée
                        </button>
                        <button
                            onClick={() => setShowModalType('SORTIE')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            <FiArrowDownCircle /> Enregistrer une Sortie
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="th-style">Date</th>
                                <th className="th-style">Produit</th>
                                <th className="th-style">Fournisseur / Client</th>
                                <th className="th-style">Type</th>
                                <th className="th-style">Quantité</th>
                                <th className="th-style">Utilisateur</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {movements.map((mov) => (
                                <tr key={mov.id} className="hover:bg-gray-50">
                                    <td className="td-style">{format(new Date(mov.movementDate), 'dd/MM/yyyy HH:mm')}</td>
                                    <td className="td-style font-medium">{mov.product?.name || 'N/A'}</td>
                                    <td className="td-style text-sm text-gray-500">{mov.supplier?.name || mov.client?.name || 'N/A'}</td>
                                    <td className="td-style">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                mov.type === 'ENTREE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {mov.type}
                                        </span>
                                    </td>
                                    <td className={`td-style font-bold ${mov.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>
                                        {mov.type === 'ENTREE' ? '+' : '-'}
                                        {mov.quantity}
                                    </td>
                                    <td className="td-style">admin</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {movements.length === 0 && !loading && (
                        <p className="text-center text-gray-500 py-8">
                            Aucun mouvement trouvé. Commencez par en ajouter un !
                        </p>
                    )}
                </div>
            </div>
            {showModalType && (
                <MovementModal
                    type={showModalType}
                    onClose={() => setShowModalType(null)}
                    onSave={handleSaveMovement}
                    products={products}
                    suppliers={suppliers}
                    clients={clients}
                />
            )}
        </>
    );
};

export default MouvementsPage;
