// src/pages/Products.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiEdit, FiTrash2, FiPlus, FiDownload } from 'react-icons/fi';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_PRODUCTS_URL = 'http://localhost:8081/api/products';
const API_CATEGORIES_URL = 'http://localhost:8081/api/categories';
const API_FILES_URL = 'http://localhost:8081/api/files/upload';

const AddProductModal = ({ onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({ name: '', categoryId: '', reference: '', barcode: '', currentStock: 0, alertThreshold: 5 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setImagePreview(URL.createObjectURL(file)); } };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData, selectedFile); };
  return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl"><h2 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un produit</h2><form onSubmit={handleSubmit} className="space-y-6"><div><label className="block text-sm font-medium text-gray-700 mb-2">Photo</label><label htmlFor="file-upload" className="cursor-pointer flex justify-center items-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg" style={{ background: imagePreview ? `url(${imagePreview}) center center / cover` : '#F9FAFB' }}>{!imagePreview && ( <div className="text-center"><FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" /><p>Cliquez pour téléverser</p></div> )}</label><input id="file-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label>Nom</label><input name="name" type="text" onChange={handleInputChange} className="input-style mt-1" required /></div><div><label>Catégorie</label><select name="categoryId" onChange={handleInputChange} className="input-style mt-1" required><option value="">Sélectionnez...</option>{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div><div><label>Référence</label><input name="reference" type="text" onChange={handleInputChange} className="input-style mt-1" /></div><div><label>Code-barres</label><input name="barcode" type="text" onChange={handleInputChange} className="input-style mt-1" /></div><div><label>Stock</label><input name="currentStock" type="number" onChange={handleInputChange} className="input-style mt-1" required /></div><div><label>Seuil d'Alerte</label><input name="alertThreshold" type="number" onChange={handleInputChange} defaultValue="5" className="input-style mt-1" required /></div></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button><button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Sauvegarder</button></div></form></div></div> );
};
const EditProductModal = ({ product, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({ ...product, categoryId: product.category?.id || '' });
  useEffect(() => { setFormData({ ...product, categoryId: product.category?.id || '' }); }, [product]);
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); onSave(formData, null); };
  return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl"><h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier le produit</h2><form onSubmit={handleSubmit} className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label>Nom</label><input name="name" type="text" value={formData.name} onChange={handleInputChange} className="input-style mt-1" /></div><div><label>Catégorie</label><select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="input-style mt-1">{categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></div><div><label>Référence</label><input name="reference" type="text" value={formData.reference || ''} onChange={handleInputChange} className="input-style mt-1" /></div><div><label>Code-barres</label><input name="barcode" type="text" value={formData.barcode || ''} onChange={handleInputChange} className="input-style mt-1" /></div><div><label>Stock</label><input name="currentStock" type="number" value={formData.currentStock} onChange={handleInputChange} className="input-style mt-1" /></div><div><label>Seuil d'Alerte</label><input name="alertThreshold" type="number" value={formData.alertThreshold} onChange={handleInputChange} className="input-style mt-1" /></div></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button><button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Modifier</button></div></form></div></div> );
};
const DeleteProductModal = ({ product, onClose, onConfirm }) => {
  return ( <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"><div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md"><h2 className="text-xl font-bold text-gray-800">Confirmer la suppression</h2><p className="mt-4">Êtes-vous sûr de vouloir supprimer : <span className="font-semibold">{product?.name}</span> ?</p><div className="flex justify-end space-x-4 mt-8"><button onClick={onClose} className="px-6 py-2 border rounded-lg">Annuler</button><button onClick={() => onConfirm(product)} className="px-6 py-2 bg-red-600 text-white rounded-lg">Supprimer</button></div></div></div> );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchData = async () => { try { setLoading(true); const [productsResponse, categoriesResponse] = await Promise.all([ axios.get(API_PRODUCTS_URL), axios.get(API_CATEGORIES_URL) ]); setProducts(productsResponse.data); setCategories(categoriesResponse.data); } catch (error) { console.error("Erreur:", error); } finally { setLoading(false); } };
  useEffect(() => { fetchData(); }, []);

  const handleSaveProduct = async (productData, file) => { setShowAddModal(false); setShowEditModal(false); let photoUrl = productData.photoUrl || (selectedProduct ? selectedProduct.photoUrl : ''); if (file) { const uploadFormData = new FormData(); uploadFormData.append('file', file); try { const uploadResponse = await axios.post(API_FILES_URL, uploadFormData); photoUrl = uploadResponse.data.url; } catch (error) { console.error("Erreur upload:", error); alert("Upload échoué."); return; } } const payload = { ...productData, photoUrl, category: { id: productData.categoryId } }; try { if (payload.id) { await axios.put(`${API_PRODUCTS_URL}/${payload.id}`, payload); } else { await axios.post(API_PRODUCTS_URL, payload); } fetchData(); } catch (error) { console.error("Erreur sauvegarde produit:", error); } };
  const handleDeleteProduct = async (productToDelete) => { try { await axios.delete(`${API_PRODUCTS_URL}/${productToDelete.id}`); fetchData(); setShowDeleteModal(false); } catch (error) { console.error("Erreur suppression produit:", error); } };
  const handleOpenEditModal = (product) => { setSelectedProduct(product); setShowEditModal(true); };
  const handleOpenDeleteModal = (product) => { setSelectedProduct(product); setShowDeleteModal(true); };

  const handleExportExcel = () => { const dataToExport = products.map(p => ({ 'Nom': p.name, 'Référence': p.reference, 'Catégorie': p.category?.name, 'Stock': p.currentStock })); const worksheet = XLSX.utils.json_to_sheet(dataToExport); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, 'Produits'); XLSX.writeFile(workbook, 'Liste_Produits.xlsx'); };
  const handleExportPdf = () => { const doc = new jsPDF(); doc.text('Liste des Produits', 14, 20); autoTable(doc, { head: [['Nom', 'Référence', 'Catégorie', 'Stock']], body: products.map(p => [p.name, p.reference, p.category?.name || 'N/A', p.currentStock]), startY: 30, }); doc.save('Liste_Produits.pdf'); };

  if (loading) { return <div className="text-center p-8">Chargement...</div>; }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Produits</h1>
          <div className="flex gap-3">
            <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"><FaFileExcel /> Excel</button>
            <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"><FaFilePdf /> PDF</button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"><FiPlus className="mr-2" /> Ajouter un produit</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr><th className="th-style">Photo</th><th className="th-style">Nom</th><th className="th-style">Référence</th><th className="th-style">Catégorie</th><th className="th-style">Stock</th><th className="th-style">Actions</th></tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="td-style"><img src={product.photoUrl ? `http://localhost:8081${product.photoUrl}` : 'https://via.placeholder.com/50'} alt={product.name} className="w-12 h-12 object-cover rounded-md" /></td>
                  <td className="td-style font-medium">{product.name}</td>
                  <td className="td-style text-sm text-gray-500">{product.reference}</td>
                  <td className="td-style">{product.category ? product.category.name : 'N/A'}</td>
                  <td className="td-style"><span className={`font-semibold ${product.critical ? 'text-red-600' : 'text-gray-800'}`}>{product.currentStock}{product.critical && (<span className="material-icons text-red-500 ml-1" style={{ fontSize: '16px', verticalAlign: 'middle' }}>warning</span>)}</span></td>
                  <td className="td-style"><div className="flex gap-4"><button onClick={() => handleOpenEditModal(product)}><FiEdit className="h-5 w-5 text-indigo-600" /></button><button onClick={() => handleOpenDeleteModal(product)}><FiTrash2 className="h-5 w-5 text-red-600" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onSave={handleSaveProduct} categories={categories} />}
      {showEditModal && <EditProductModal product={selectedProduct} onClose={() => setShowEditModal(false)} onSave={handleSaveProduct} categories={categories} />}
      {showDeleteModal && <DeleteProductModal product={selectedProduct} onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteProduct} />}
    </>
  );
};
export default Products;