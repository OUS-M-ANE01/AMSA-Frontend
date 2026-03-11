import { useEffect, useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const { stats, salesData, loading, error, fetchStats, fetchSalesData } = useAdmin();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchSalesData(period);
  }, [period]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#8B7355]" size={48} />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Revenu Total',
      value: `${(stats?.totalRevenue || 0).toLocaleString()} FCFA`,
      icon: DollarSign,
      color: 'text-[#065F46]',
      bgColor: 'bg-[#D1FAE5]',
    },
    {
      title: 'Commandes',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-[#8B7355]',
      bgColor: 'bg-[#F5F1ED]',
    },
    {
      title: 'Produits',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'text-[#8B7355]',
      bgColor: 'bg-[#F5F1ED]',
    },
    {
      title: 'Utilisateurs',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-[#92400E]',
      bgColor: 'bg-[#FEF3C7]',
    },
  ];

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
      <span className={`${badge.bg} ${badge.text} px-2 py-1 rounded-full text-xs font-medium`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3A3A3A]">Dashboard</h1>
          <p className="text-sm sm:text-base text-[#6B6B6B] mt-1">Vue d'ensemble de votre boutique</p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          className="px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] transition-colors flex items-center gap-2 justify-center w-full sm:w-auto"
        >
          <TrendingUp size={16} />
          <span className="text-sm sm:text-base">Actualiser</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
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
            {/* Decorative circle background */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5" 
                 style={{ backgroundColor: card.color === 'text-[#065F46]' ? '#065F46' : 
                                           card.color === 'text-[#8B7355]' ? '#8B7355' : 
                                           card.color === 'text-[#92400E]' ? '#92400E' : '#8B7355' }}>
            </div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${card.bgColor} p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <p className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                </div>
                <p className="text-xl font-bold text-[#3A3A3A] mt-1 truncate">{card.value}</p>
                
                {/* Progress bar effect */}
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: '75%',
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

      {/* Graphique des ventes */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#E8E0D5]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-[#8B7355]" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-[#3A3A3A]">Ventes</h2>
          </div>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                  period === p
                    ? 'bg-[#8B7355] text-white'
                    : 'bg-[#F5F1ED] text-[#6B6B6B] hover:bg-[#E8E0D5]'
                }`}
              >
                {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>
        </div>
        
        {salesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" stroke="#666" tick={{ fontSize: 12 }} />
              <YAxis stroke="#666" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="totalSales" fill="#8B7355" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-gray-400 text-sm">
            Aucune donnée disponible
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Produits */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#E8E0D5]">
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-[#8B7355]" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-[#3A3A3A]">Top Produits</h2>
          </div>
          <div className="space-y-3">
            {stats?.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E0D5]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-[#3A3A3A] truncate">{product.name}</p>
                    <p className="text-xs sm:text-sm text-[#6B6B6B]">{product.sales} ventes</p>
                  </div>
                  <p className="font-bold text-xs sm:text-sm text-[#8B7355] whitespace-nowrap">
                    {(product.sales * product.price).toLocaleString()} F
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">Aucun produit</p>
            )}
          </div>
        </div>

        {/* Stock faible */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#E8E0D5]">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-[#C53030]" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-[#3A3A3A]">Stock Faible</h2>
          </div>
          <div className="space-y-3">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.slice(0, 5).map((product) => (
                <div key={product._id} className="flex items-center justify-between gap-2 p-3 bg-[#FDECEA] rounded-lg border border-[#FEB2B2]">
                  <p className="font-medium text-sm sm:text-base text-[#3A3A3A] truncate">{product.name}</p>
                  <span className="px-2 sm:px-3 py-1 bg-[#C53030] text-white rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                    {product.stock}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">Tous les stocks sont OK ✓</p>
            )}
          </div>
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#E8E0D5]">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="text-[#8B7355]" size={20} />
          <h2 className="text-lg sm:text-xl font-bold text-[#3A3A3A]">Commandes Récentes</h2>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E0D5] bg-[#F5F1ED]">
                <th className="text-left py-3 px-2 sm:px-3 font-semibold text-[#3A3A3A] text-xs whitespace-nowrap">N° Commande</th>
                <th className="text-left py-3 px-2 sm:px-3 font-semibold text-[#3A3A3A] text-xs whitespace-nowrap">Client</th>
                <th className="text-left py-3 px-2 sm:px-3 font-semibold text-[#3A3A3A] text-xs whitespace-nowrap">Montant</th>
                <th className="text-left py-3 px-2 sm:px-3 font-semibold text-[#3A3A3A] text-xs whitespace-nowrap">Statut</th>
                <th className="text-left py-3 px-2 sm:px-3 font-semibold text-[#3A3A3A] text-xs whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#E8E0D5] hover:bg-[#FAF8F5]">
                    <td className="py-3 px-2 sm:px-3 font-medium text-[#3A3A3A] text-xs sm:text-sm whitespace-nowrap">{order.orderNumber}</td>
                    <td className="py-3 px-2 sm:px-3 text-[#6B6B6B] text-xs whitespace-nowrap">
                      {order.user.prenom} {order.user.nom}
                    </td>
                    <td className="py-3 px-2 sm:px-3 font-semibold text-[#8B7355] text-xs sm:text-sm whitespace-nowrap">
                      {order.total.toLocaleString()} F
                    </td>
                    <td className="py-3 px-2 sm:px-3 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                    <td className="py-3 px-2 sm:px-3 text-[#6B6B6B] text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    Aucune commande récente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
