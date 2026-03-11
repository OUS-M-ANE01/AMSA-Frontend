import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { adminAPI } from '../../services/api';
import { 
  ShoppingCart, 
  Search, 
  Eye,
  Loader2,
  Package,
  User
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    prenom: string;
    nom: string;
    email: string;
  };
  items: Array<{
    product: {
      _id: string;
      nom: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  isPaid: boolean;
  paymentMethod: string;
  shippingAddress: any;
  createdAt: string;
}

export default function AdminOrders() {
  const { updateOrderStatus, markOrderAsPaid } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllOrders({
        status: statusFilter || undefined,
      });
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus);
    
    if (result.success) {
      toast.success('Statut mis à jour');
      fetchOrders();
    } else {
      toast.error(result.error || 'Erreur');
    }
  };

  const handleMarkAsPaid = async (orderId: string) => {
    const result = await markOrderAsPaid(orderId);
    
    if (result.success) {
      toast.success('Commande marquée comme payée');
      fetchOrders();
    } else {
      toast.error(result.error || 'Erreur');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'En attente' },
      confirmed: { bg: 'bg-[#F5F1ED]', text: 'text-[#8B7355]', label: 'Confirmée' },
      processing: { bg: 'bg-[#F5F1ED]', text: 'text-[#6D5942]', label: 'En cours' },
      shipped: { bg: 'bg-[#E8E0D5]', text: 'text-[#3A3A3A]', label: 'Expédiée' },
      delivered: { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]', label: 'Livrée' },
      cancelled: { bg: 'bg-[#FDECEA]', text: 'text-[#C53030]', label: 'Annulée' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-medium`}>
        {badge.label}
      </span>
    );
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${order.user.prenom} ${order.user.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex items-center gap-3">
        <ShoppingCart className="text-[#8B7355]" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Commandes</h1>
          <p className="text-[#6B6B6B] mt-1">{orders.length} commandes au total</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E0D5]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" size={20} />
            <input
              type="text"
              placeholder="Rechercher par n° commande, client, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchOrders();
            }}
            className="px-4 py-2 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="processing">En cours</option>
            <option value="shipped">Expédiée</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8E0D5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F1ED] border-b border-[#E8E0D5]">
              <tr>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">N° Commande</th>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Client</th>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Articles</th>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Montant</th>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Paiement</th>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Statut</th>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Date</th>
                <th className="text-left py-2 px-3 font-semibold text-[#3A3A3A] text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t border-[#E8E0D5] hover:bg-[#FAF8F5]">
                  <td className="py-2 px-3 font-medium text-[#3A3A3A] text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="py-2 px-3">
                    <div>
                      <p className="font-medium text-[#3A3A3A] text-sm">
                        {order.user.prenom} {order.user.nom}
                      </p>
                      <p className="text-xs text-[#6B6B6B]">{order.user.email}</p>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-[#6B6B6B] text-xs">
                    {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </td>
                  <td className="py-2 px-3 font-semibold text-[#8B7355] text-sm">
                    {order.totalPrice.toLocaleString()} F
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-[#6B6B6B]">{order.paymentMethod}</span>
                      {order.isPaid ? (
                        <span className="text-xs text-[#065F46] font-medium">Payé ✓</span>
                      ) : (
                        <button
                          onClick={() => handleMarkAsPaid(order._id)}
                          className="text-xs text-[#8B7355] hover:underline"
                        >
                          Marquer payé
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs px-2 py-1 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355]"
                      disabled={order.status === 'cancelled' || order.status === 'delivered'}
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="processing">En cours</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </td>
                  <td className="py-2 px-3 text-[#6B6B6B] text-xs">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="p-1.5 text-[#8B7355] hover:bg-[#F5F1ED] rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détails commande */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3A3A3A]">
                Commande {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
              >
                <Eye size={24} />
              </button>
            </div>

            {/* Client */}
            <div className="mb-6 p-4 bg-[#FAF8F5] rounded-lg border border-[#E8E0D5]">
              <div className="flex items-center gap-2 mb-3">
                <User className="text-[#8B7355]" size={20} />
                <h4 className="font-semibold text-[#3A3A3A]">Client</h4>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Nom:</span> {selectedOrder.user.prenom} {selectedOrder.user.nom}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                <p><span className="font-medium">Téléphone:</span> {selectedOrder.shippingAddress.telephone}</p>
                <p><span className="font-medium">Adresse:</span> {selectedOrder.shippingAddress.adresse}, {selectedOrder.shippingAddress.ville} {selectedOrder.shippingAddress.codePostal}</p>
              </div>
            </div>

            {/* Articles */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Package className="text-[#8B7355]" size={20} />
                <h4 className="font-semibold text-[#3A3A3A]">Articles</h4>
              </div>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E0D5]">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.nom}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[#3A3A3A]">{item.product.nom}</p>
                      <p className="text-sm text-[#6B6B6B]">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#8B7355]">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-4 bg-[#F5F1ED] rounded-lg border border-[#E8E0D5]">
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold text-[#3A3A3A]">Total</span>
                <span className="font-bold text-[#8B7355] text-xl">
                  {selectedOrder.totalPrice.toLocaleString()} FCFA
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-[#6B6B6B]">Statut</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-[#6B6B6B]">Paiement</span>
                <span className={selectedOrder.isPaid ? 'text-[#065F46] font-medium' : 'text-[#C53030]'}>
                  {selectedOrder.isPaid ? 'Payé ✓' : 'Non payé'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full mt-6 px-4 py-2 border border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED] transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
