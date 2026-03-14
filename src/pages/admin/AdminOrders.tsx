import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { adminAPI } from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { socketService } from '../../services/socket';
import { 
  ShoppingCart, 
  Search, 
  Eye,
  Loader2,
  Package,
  User,
  Wifi,
  WifiOff
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
    product?: {
      _id: string;
      nom: string;
      images: string[];
    };
    name: string;
    image: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  isPaid: boolean;
  paymentMethod: string;
  shippingAddress: any;
  createdAt: string;
}

export default function AdminOrders() {
    // Fonction de remboursement
    const handleRefund = async (orderId: string) => {
      try {
        toast.loading('Remboursement en cours...');
        // Appel à l'API NabooPay pour le refund
        const response = await adminAPI.refundOrder(orderId);
        toast.dismiss();
        if (response.data && response.data.message) {
          toast.success(response.data.message);
          fetchOrders();
        } else {
          toast.success('Remboursement effectué');
          fetchOrders();
        }
      } catch (error: any) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || 'Erreur lors du remboursement');
      }
    };
  const { updateOrderStatus, markOrderAsPaid } = useAdmin();
  const { isConnected } = useSocket();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // Stats
  const [stats, setStats] = useState<any>(null);
  // Pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllOrders({
        status: statusFilter || undefined,
        page,
        limit,
      });
      setOrders(response.data.data);
      setTotalOrders(response.data.total || response.data.data.length);
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, limit]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      setStats(null);
    }
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Écoute des événements Socket.IO en temps réel
  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    const onNewOrder = (data: any) => {
      toast.success(
        `Nouvelle commande de ${data.order?.user?.prenom ?? ''} ${data.order?.user?.nom ?? ''}`,
        { icon: '📦', duration: 5000 }
      );
      fetchOrders();
    };

    const onOrderPaid = (data: any) => {
      toast.success(`Commande ${data.orderNumber ?? ''} payée via NabooPay !`, {
        icon: '💳',
        duration: 5000,
      });
      fetchOrders();
    };

    const onOrderUpdated = () => {
      fetchOrders();
    };

    socket.on('order:new', onNewOrder);
    socket.on('order:paid', onOrderPaid);
    socket.on('order:updated', onOrderUpdated);

    return () => {
      socket.off('order:new', onNewOrder);
      socket.off('order:paid', onOrderPaid);
      socket.off('order:updated', onOrderUpdated);
    };
  }, [isConnected, fetchOrders]);

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
    <div className="p-6">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-[#8B7355]" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-[#3A3A3A]">Commandes</h1>
            <p className="text-[#6B6B6B] mt-1">{totalOrders} commandes au total</p>
          </div>
        </div>
        {/* Indicateur temps réel */}
        <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
          isConnected ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {isConnected
            ? <><Wifi size={12} /><span>Temps réel actif</span></>
            : <><WifiOff size={12} /><span>Hors connexion</span></>}
        </div>
      </div>

      {/* Stats Cards - nouveau style identique dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
          {[
            {
              title: 'Revenu total',
              value: `${stats.totalRevenue?.toLocaleString('fr-FR') ?? 0} FCFA`,
              icon: Package,
              color: 'text-[#065F46]',
              bgColor: 'bg-[#D1FAE5]',
              progress: 66,
            },
            {
              title: 'Commandes',
              value: stats.totalOrders,
              icon: ShoppingCart,
              color: 'text-[#8B7355]',
              bgColor: 'bg-[#F5F1ED]',
              progress: 75,
            },
            {
              title: 'Confirmées/Livrées',
              value: stats.confirmedOrders,
              icon: Loader2,
              color: 'text-[#92400E]',
              bgColor: 'bg-[#FEF3C7]',
              progress: 50,
            },
            {
              title: 'En attente',
              value: stats.pendingOrders,
              icon: Loader2,
              color: 'text-[#8B7355]',
              bgColor: 'bg-[#F5F1ED]',
              progress: 30,
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl p-4 border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              style={{
                borderColor: card.color === 'text-[#065F46]' ? '#065F46' :
                  card.color === 'text-[#8B7355]' ? '#8B7355' :
                  card.color === 'text-[#92400E]' ? '#92400E' : '#8B7355',
                boxShadow: `0 4px 6px -1px ${card.color === 'text-[#065F46]' ? 'rgba(6, 95, 70, 0.1)' :
                  card.color === 'text-[#8B7355]' ? 'rgba(139, 115, 85, 0.1)' :
                  card.color === 'text-[#92400E]' ? 'rgba(146, 64, 14, 0.1)' : 'rgba(139, 115, 85, 0.1)'}`
              }}
            >
              {/* Cercle décoratif */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5"
                style={{ backgroundColor: card.color === 'text-[#065F46]' ? '#065F46' :
                  card.color === 'text-[#8B7355]' ? '#8B7355' :
                  card.color === 'text-[#92400E]' ? '#92400E' : '#8B7355' }}
              />
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`${card.bgColor} p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <p className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                  </div>
                  <p className="text-xl font-bold text-[#3A3A3A] mt-1 truncate">{card.value}</p>
                  {/* Progress bar décorative */}
                  <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${card.progress}%`,
                        backgroundColor: card.color === 'text-[#065F46]' ? '#065F46' :
                          card.color === 'text-[#8B7355]' ? '#8B7355' :
                          card.color === 'text-[#92400E]' ? '#92400E' : '#8B7355'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
              setPage(1);
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
                    {(order.total ?? 0).toLocaleString()} F
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs text-[#6B6B6B]">{order.paymentMethod}</span>
                      {order.isPaid ? (
                        <span className="text-xs text-[#065F46] font-medium">Payé ✓</span>
                      ) : (
                        (order.status !== 'cancelled' && order.status !== 'delivered') && (
                          <button
                            onClick={() => handleMarkAsPaid(order._id)}
                            className="text-xs text-[#8B7355] hover:underline"
                          >
                            Marquer payé
                          </button>
                        )
                      )}
                      {/* Ajout bouton remboursement */}
                      {order.isPaid && order.status === 'cancelled' && (
                        <button
                          onClick={() => handleRefund(order._id)}
                          className="text-xs text-[#C53030] hover:underline mt-1"
                        >
                          Rembourser
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
        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 p-4">
          <button
            className="px-3 py-1 rounded-lg border border-[#D4C4B0] bg-white text-[#8B7355] font-medium disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >Précédent</button>
          <span className="text-sm text-[#3A3A3A]">Page {page} / {Math.ceil(totalOrders / limit)}</span>
          <button
            className="px-3 py-1 rounded-lg border border-[#D4C4B0] bg-white text-[#8B7355] font-medium disabled:opacity-50"
            disabled={page >= Math.ceil(totalOrders / limit)}
            onClick={() => setPage(page + 1)}
          >Suivant</button>
        </div>
      </div>

      {/* Modal détails commande */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-hidden">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#E8E0D5] flex-shrink-0">
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

            <div className="flex-1 overflow-y-auto p-6">
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
                  <p><span className="font-medium">Adresse:</span> {selectedOrder.shippingAddress.rue || selectedOrder.shippingAddress.adresse}, {selectedOrder.shippingAddress.ville}</p>
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
                        src={item.image || item.product?.images?.[0] || ''}
                        alt={item.name || item.product?.nom}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#3A3A3A]">{item.name || item.product?.nom}</p>
                        <p className="text-sm text-[#6B6B6B]">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#8B7355]">
                        {((item.price ?? 0) * item.quantity).toLocaleString()} FCFA
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
                    {(selectedOrder.total ?? 0).toLocaleString()} FCFA
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
        </div>
      )}
    </div>
  );
}
