// src/pages/NotificationsPage.jsx

// --- MODIFICATION : On reçoit les notifications et la fonction en props ---
const NotificationsPage = ({ notifications, onMarkAllAsRead }) => {
  
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'alert':
        return { style: 'text-red-600', label: '[Alerte Stock Bas]' };
      case 'in':
        return { style: 'text-green-600', label: '[Entrée de Stock]' };
      case 'out':
        return { style: 'text-yellow-600', label: '[Sortie de Stock]' };
      default:
        return { style: 'text-gray-600', label: '' };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        {/* On affiche le bouton seulement s'il y a des notifications */}
        {notifications.length > 0 && (
          <button onClick={onMarkAllAsRead} className="text-sm text-indigo-600 hover:underline">
            Marquer tout comme lu
          </button>
        )}
      </div>
      <ul className="divide-y divide-gray-200">
        {/* On affiche la liste des notifications reçues en props */}
        {notifications.length > 0 ? (
          notifications.map((notif, index) => {
            const { style, label } = getNotificationStyle(notif.type);
            return (
              <li key={index} className="p-4 hover:bg-gray-50">
                <p>
                  <span className={`font-semibold ${style}`}>{label}</span> {notif.message}
                </p>
                <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
              </li>
            );
          })
        ) : (
          // Message si la liste est vide
          <p className="p-4 text-gray-500">Vous n'avez aucune nouvelle notification.</p>
        )}
      </ul>
    </div>
  );
};

export default NotificationsPage;