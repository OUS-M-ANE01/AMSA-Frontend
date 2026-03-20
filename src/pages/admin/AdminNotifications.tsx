import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Loader2, Bell, AlertCircle, Package, Users, ShoppingCart } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Notification {
  type: string;
  title: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    prenom: string;
    nom: string;
    email: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getNotifications();
      setNotifications(response.data.data.notifications || []);
      setRecentOrders(response.data.data.recentUnprocessedOrders || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'orders':
        return <ShoppingCart size={20} className="text-[#8B7355]" />;
      case 'stock':
        return <Package size={20} className="text-[#C53030]" />;
      case 'users':
        return <Users size={20} className="text-[#065F46]" />;
      default:
        return <Bell size={20} className="text-[#6B6B6B]" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-[#FDECEA] border-[#C53030] text-[#C53030]';
      case 'medium':
        return 'bg-[#FEF3C7] border-[#92400E] text-[#92400E]';
      case 'low':
        return 'bg-[#D1FAE5] border-[#065F46] text-[#065F46]';
      default:
        return 'bg-[#F5F1ED] border-[#6B6B6B] text-[#6B6B6B]';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#8B7355]" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#3A3A3A]">Notifications</h1>
        <p className="text-[#6B6B6B] mt-1">Alertes et notifications importantes</p>
      </div>

      {/* Notifications Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notifications.map((notif, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 border-2 ${getPriorityColor(notif.priority)}`}
          >
            <div className="flex items-start justify-between mb-3">
              {getIcon(notif.type)}
              <span className="text-xs font-bold uppercase px-2 py-1 rounded">
                {notif.priority}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-1">{notif.title}</h3>
            <p className="text-3xl font-bold">{notif.count}</p>
          </div>
        ))}
      </div>

      {/* Commandes Non Traitées */}
      {recentOrders.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E0D5]">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-[#C53030]" size={24} />
            <h2 className="text-xl font-bold text-[#3A3A3A]">
              Commandes Non Traitées (24h)
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E0D5] bg-[#F5F1ED]">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#3A3A3A]">
                    N° Commande
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#3A3A3A]">
                    Client
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#3A3A3A]">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#3A3A3A]">
                    Montant
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-[#3A3A3A]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#E8E0D5] hover:bg-[#FAF8F5]">
                    <td className="py-3 px-4 font-medium text-[#3A3A3A]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-[#6B6B6B]">
                      {order.user.prenom} {order.user.nom}
                    </td>
                    <td className="py-3 px-4 text-[#6B6B6B] text-sm">
                      {order.user.email}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#8B7355]">
                      {order.total.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4 text-[#6B6B6B] text-sm">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message si aucune commande non traitée */}
      {recentOrders.length === 0 && (
        <div className="bg-[#D1FAE5] rounded-xl p-6 border border-[#065F46]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#065F46] rounded-full flex items-center justify-center">
              <Bell className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-[#065F46]">Tout est à jour!</h3>
              <p className="text-sm text-[#065F46]">
                Aucune commande en attente de traitement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
