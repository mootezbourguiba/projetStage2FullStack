import DashboardLayout from '../../components/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tableau de bord</h1>
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-600 text-lg font-semibold">Total Produits</h3>
            <p className="text-2xl font-bold">150</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-green-600 text-lg font-semibold">En Stock</h3>
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-yellow-600 text-lg font-semibold">À Commander</h3>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-purple-600 text-lg font-semibold">Catégories</h3>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Activités récentes</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
              <div>
                <p className="text-gray-800">Entrée de stock - Produit A</p>
                <p className="text-sm text-gray-500">Quantité: +50</p>
              </div>
              <span className="text-sm text-gray-500">Il y a 2 heures</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
              <div>
                <p className="text-gray-800">Sortie de stock - Produit B</p>
                <p className="text-sm text-gray-500">Quantité: -20</p>
              </div>
              <span className="text-sm text-gray-500">Il y a 4 heures</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
              <div>
                <p className="text-gray-800">Nouveau produit ajouté</p>
                <p className="text-sm text-gray-500">Produit C</p>
              </div>
              <span className="text-sm text-gray-500">Il y a 1 jour</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
