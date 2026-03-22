import { User, Mail, Phone, Lock, Package, Loader2, LogOut, ShoppingBag, Clock, CheckCircle, XCircle, ChevronDown, TrendingUp, AlertCircle, CreditCard, Ban, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ordersAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import PasswordChangeForm from './PasswordChangeForm';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  confirmed: { label: 'Confirmée', color: 'text-emerald-700', bg: 'bg-emerald-50 border border-emerald-200', icon: CheckCircle },
  pending:   { label: 'En attente', color: 'text-amber-700',  bg: 'bg-amber-50 border border-amber-200',   icon: Clock },
  cancelled: { label: 'Annulée',   color: 'text-red-700',    bg: 'bg-red-50 border border-red-200',        icon: XCircle },
  delivered: { label: 'Livrée',    color: 'text-blue-700',   bg: 'bg-blue-50 border border-blue-200',      icon: CheckCircle },
};


function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string | number; sub?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e8e2d9] p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-[#C9A84C]/5 rounded-full -translate-y-6 translate-x-6 group-hover:scale-150 transition-transform duration-500" />
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[#C9A84C]" />
        </div>
        <div>
          <p className="text-xs text-[#8B7355] uppercase tracking-widest font-medium mb-1">{label}</p>
          <p className="text-xl sm:text-2xl font-serif font-semibold text-[#2C2C2C]">{value}</p>
          {sub && <p className="text-xs text-[#8B7355] mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onOrderUpdate }: { order: any; onOrderUpdate: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  const handleRetryPayment = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.retryPayment(order._id);
      if (response.data.success && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réinitialisation du paiement');
      toast.error(error.response?.data?.message || "Erreur lors de la réinitialisation du paiement");
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;
    try {
      setLoading(true);
      await ordersAPI.cancel(order._id);
      toast.success('Commande annulée avec succès');
      onOrderUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette commande ?')) return;
    try {
      setLoading(true);
      await ordersAPI.delete(order._id);
      toast.success('Commande supprimée avec succès');
      onOrderUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  const isPending = order.status === 'pending';
  const isConfirmed = order.status === 'confirmed';
  const isDelivered = order.status === 'delivered';
  const isCancelled = order.status === 'cancelled';
  
  // Peut payer si en attente et non payé
  const canPay = isPending && !order.isPaid;
  
  // Peut annuler si en attente OU confirmé (mais pas livré ou déjà annulé)
  const canCancel = (isPending || isConfirmed) && !isCancelled && !isDelivered;
  
  // Peut supprimer si en attente et non payé
  const canDelete = isPending && !order.isPaid;

  return (
    <div className="bg-white border border-[#e8e2d9] rounded-2xl overflow-hidden hover:border-[#C9A84C]/50 hover:shadow-md transition-all duration-300">
      <div
        className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        {/* Order icon */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
          <ShoppingBag size={18} className="text-[#C9A84C]" />
        </div>

        {/* Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-serif font-semibold text-[#2C2C2C] text-sm">
              Commande #{order._id.slice(-6).toUpperCase()}
            </p>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
              <StatusIcon size={11} />
              {status.label}
            </span>
          </div>
          <p className="text-xs text-[#8B7355] mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}{order.items.length} article{order.items.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Total */}
        <div className="text-right shrink-0">
          <p className="font-serif font-semibold text-[#C9A84C] text-sm">
            {order.total ? order.total.toLocaleString('fr-FR') : '—'} FCFA
          </p>
        </div>

        {/* Chevron */}
        <div className={`transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}>
          <ChevronDown size={16} className="text-[#8B7355]" />
        </div>
      </div>

      {/* Expandable details */}
      {open && (
        <div className="border-t border-[#e8e2d9] bg-[#faf8f5] px-4 py-4">
          <p className="text-xs uppercase tracking-widest text-[#8B7355] font-medium mb-3">Détail des articles</p>
          <div className="space-y-2">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                  <span className="text-[#2C2C2C] font-medium">{item.name}</span>
                  <span className="text-[#8B7355] text-xs">×{item.quantity}</span>
                </div>
                <span className="text-[#2C2C2C] font-medium">{item.price.toLocaleString('fr-FR')} FCFA</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-[#e8e2d9] flex justify-between items-center">
            <span className="text-xs text-[#8B7355]">Total commande</span>
            <span className="font-serif font-semibold text-[#C9A84C]">{order.total?.toLocaleString('fr-FR')} FCFA</span>
          </div>
          {/* Statut de remboursement */}
          {order.isRefunded && (
            <div className="mt-3 pt-3 border-t border-[#e8e2d9]">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <CheckCircle size={16} className="text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">Commande remboursée</p>
                  <p className="text-xs text-blue-700">
                    Montant: {order.refundAmount?.toLocaleString('fr-FR')} FCFA
                    {order.refundedAt && ` • ${new Date(order.refundedAt).toLocaleDateString('fr-FR')}`}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Boutons d'action */}
          {(canPay || canCancel || canDelete) && (
            <div className="mt-4 pt-4 border-t border-[#e8e2d9] flex flex-col sm:flex-row gap-2">
              {canPay && (
                <button
                  onClick={handleRetryPayment}
                  disabled={loading}
                  className="flex-1 min-w-[100px] sm:min-w-[120px] px-4 py-2 bg-[#C9A84C] text-white rounded-lg hover:bg-[#B8973D] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Chargement...' : (
                    <>
                      <CreditCard size={16} />
                      <span>Payer</span>
                    </>
                  )}
                </button>
              )}
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 min-w-[100px] sm:min-w-[120px] px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Chargement...' : (
                    <>
                      <Ban size={16} />
                      <span>Annuler</span>
                    </>
                  )}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 min-w-[100px] sm:min-w-[120px] px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Chargement...' : (
                    <>
                      <Trash2 size={16} />
                      <span>Supprimer</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Profil() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const onNavigate = (page: string) => {
    window.location.hash = page;
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
  setShowLogoutModal(false);
  // setShowLogoutLoader(true); (supprimé, variable inexistante)
  setTimeout(() => {
    logout();
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.location.hash = '';
    window.location.href = 'accueil';
    setTimeout(() => {
      // setShowLogoutLoader(false); (supprimé, variable inexistante)
    }, 800);
  }, 1000);
};

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setOrdersLoading(false);
    }
  };
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      onNavigate('auth');
    }
    if (!loading && isAuthenticated && user?.role === 'admin') {
      onNavigate('admin-dashboard');
    }
  }, [loading, isAuthenticated, user]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#C9A84C] mb-4" size={32} />
        <span className="text-[#2C2C2C] text-lg font-serif">Chargement...</span>
      </div>
    );
  }

  // Stats
  const totalSpent = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const confirmedOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#faf8f5] mt-18">
      <Toaster />

      {/* ── Hero Banner ── */}
      <div className="relative bg-[#2C2C2C] overflow-hidden ">
        {/* Decorative gold lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          <div className="absolute top-6 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
        </div>
        {/* Soft glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-32 bg-[#C9A84C]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative px-4 md:px-18 py-6 sm:py-10">
          <div className="flex flex-row items-start gap-3 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#C9A84C] to-[#a8883c] flex items-center justify-center text-white text-2xl sm:text-3xl font-serif font-semibold shadow-lg shadow-[#C9A84C]/20">
                {user.prenom?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#2C2C2C]" title="Connecté" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-medium mb-1">Mon espace</p>
              <h1 className="text-white font-serif text-base sm:text-2xl md:text-3xl font-semibold leading-tight">
                {user.prenom} {user.nom}
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-1 sm:gap-x-4 sm:gap-y-1 mt-1 sm:mt-2">
                <span className="flex items-center gap-1 text-[#a8883c] text-xs sm:text-sm">
                  <Mail size={12} className="shrink-0" /> 
                  <span className="truncate">{user.email}</span>
                </span>
                {user.telephone && (
                  <span className="flex items-center gap-1 text-[#a8883c] text-xs sm:text-sm">
                    <Phone size={12} className="shrink-0" /> {user.telephone}
                              <div className="mt-6 flex flex-col gap-2">
                                <button
                                  onClick={() => {}}
                                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gray-200 border border-[#e8e2d9] text-gray-400 font-medium cursor-not-allowed opacity-60"
                                  disabled
                                  aria-disabled="true"
                                  tabIndex={-1}
                                >
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
                                  Se connecter avec Google
                                </button>
                              </div>
                  </span>
                )}
              </div>
            </div>

           {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-[#3A3A3A] hover:bg-[#8B7355] text-white rounded-xl transition-all group shadow-md hover:shadow-lg shrink-0"
              >
                <LogOut
                  size={16}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="text-sm font-medium hidden sm:inline">
                  Déconnexion
                </span>
              </button>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
                <LogOut className="text-[#92400E]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#3A3A3A]">
                Confirmer la déconnexion
              </h3>
            </div>

            <p className="text-[#6B6B6B] mb-6">
              Êtes-vous sûr de vouloir vous déconnecter de votre session
              administrateur ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-[#E8E0D5] text-[#3A3A3A] rounded-xl font-medium hover:bg-[#D1C7B7] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-[#C53030] text-white rounded-xl font-medium hover:bg-[#991B1B] transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className=" max-w-6xl mx-auto py-4 sm:py-8 px-3 sm:px-4">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-8">
          <StatCard icon={ShoppingBag} label="Commandes" value={orders.length} />
          <StatCard icon={CheckCircle} label="Confirmées" value={confirmedOrders} />
          <StatCard icon={Clock} label="En attente" value={pendingOrders} />
          <StatCard icon={TrendingUp} label="Total dépensé" value={totalSpent > 0 ? totalSpent.toLocaleString('fr-FR') : '0'} sub="FCFA" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white border border-[#e8e2d9] rounded-xl mb-4 sm:mb-6 w-fit shadow-sm">
          {[
            { key: 'orders', label: 'Mes commandes', icon: Package },
            { key: 'profile', label: 'Mon profil', icon: User },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-[#C9A84C] text-white shadow-sm'
                  : 'text-[#8B7355] hover:text-[#2C2C2C] hover:bg-[#faf8f5]'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="animate-spin text-[#C9A84C] mb-3" size={28} />
                <p className="text-[#8B7355] text-sm">Chargement de vos commandes...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center mb-4">
                  <ShoppingBag size={28} className="text-[#C9A84C]" />
                </div>
                <p className="font-serif text-lg text-[#2C2C2C] mb-1">Aucune commande pour l'instant</p>
                <p className="text-sm text-[#8B7355] max-w-xs">
                  Vos commandes apparaîtront ici une fois que vous aurez effectué vos premiers achats.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-[#8B7355]">
                    <span className="font-semibold text-[#2C2C2C]">{orders.length}</span> commande{orders.length > 1 ? 's' : ''} au total
                  </p>
                </div>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <OrderCard key={order._id} order={order} onOrderUpdate={fetchOrders} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Info card */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                  <User size={15} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-serif text-[#2C2C2C] font-semibold">Informations personnelles</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Prénom', value: user.prenom, icon: User },
                  { label: 'Nom', value: user.nom, icon: User },
                  { label: 'Adresse email', value: user.email, icon: Mail },
                  { label: 'Téléphone', value: user.telephone || '—', icon: Phone },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label}>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-[#8B7355] uppercase tracking-wider mb-2">
                      <Icon size={11} />
                      {label}
                    </label>
                    <div className="w-full px-4 py-3 bg-[#faf8f5] border border-[#e8e2d9] rounded-xl text-[#2C2C2C] text-sm font-medium">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#e8e2d9] flex items-center gap-2">
                <AlertCircle size={13} className="text-[#8B7355]" />
                <p className="text-xs text-[#8B7355]">
                  Pour modifier vos informations, veuillez contacter notre support.
                </p>
              </div>
            </div>

            {/* Security card */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
                  <Lock size={15} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-serif text-[#2C2C2C] font-semibold">Sécurité du compte</h3>
              </div>

              <PasswordChangeForm />
            </div>

            {/* Danger zone */}
            <div className="bg-white border border-[#e8e2d9] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <LogOut size={15} className="text-red-500" />
                </div>
                <h3 className="font-serif text-[#2C2C2C] font-semibold">Session</h3>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-5 py-3 bg-[#2C2C2C] text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors duration-200"
              >
                <LogOut size={15} />
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}