import { User, Mail, Phone, MapPin, Lock, Package, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ordersAPI } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function Profil() {
  const { user, updateProfile, updatePassword, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Charger les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom || '',
        nom: user.nom || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
      });
    }
  }, [user]);

  // Charger les commandes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getMyOrders();
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.nom) {
      toast.error('Le prénom et le nom sont requis');
      return;
    }

    setSavingProfile(true);
    
    try {
      await updateProfile(formData);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      // Error already handled by useAuth
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setChangingPassword(true);
    
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Mot de passe modifié avec succès');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      // Error already handled by useAuth
    } finally {
      setChangingPassword(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'livrée':
      case 'payée':
        return 'bg-green-100 text-green-800';
      case 'en cours':
      case 'en préparation':
        return 'bg-blue-100 text-blue-800';
      case 'annulée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen pt-18 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8B7355]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-18 bg-warm-white">
      <Toaster position="top-center" />
      
      {/* Hero Banner */}
      <div className="relative h-[35vh] flex flex-col items-center justify-center bg-cream">
        <div className="mb-4">
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center">
            <User size={48} className="text-gold" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">
          Mon <em className="italic text-gold">Profil</em>
        </h1>
        <p className="mt-3 text-text-light text-base">
          {user.prenom} {user.nom} • {user.email}
        </p>
      </div>

      {/* Contenu Principal */}
      <section className="py-12 md:py-16 px-4 md:px-8 lg:px-14">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Informations Personnelles */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <User size={24} className="text-gold" />
              <h2 className="font-serif text-2xl font-light text-charcoal">
                Informations Personnelles
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    <Mail size={16} className="inline mr-2" />
                    Email (non modifiable)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-border rounded bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+221 77 123 45 67"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    <MapPin size={16} className="inline mr-2" />
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="12 Rue de la République, Dakar"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="px-6 py-3 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {savingProfile ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Sauvegarder les modifications'
                )}
              </button>
            </form>
          </div>

          {/* Changement de mot de passe */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-gold" />
              <h2 className="font-serif text-2xl font-light text-charcoal">
                Changer le mot de passe
              </h2>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="px-6 py-3 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {changingPassword ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Modification...
                  </>
                ) : (
                  'Changer le mot de passe'
                )}
              </button>
            </form>
          </div>

          {/* Historique des commandes */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Package size={24} className="text-gold" />
              <h2 className="font-serif text-2xl font-light text-charcoal">
                Mes Commandes
              </h2>
            </div>

            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-[#8B7355]" size={32} />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-text-light text-center py-8">
                Vous n'avez pas encore passé de commande
              </p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="border border-border rounded-lg p-4 hover:border-gold transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-charcoal">
                          Commande #{order._id.slice(-6)}
                        </p>
                        <p className="text-sm text-text-light">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-text-light">
                        {order.items.length} article(s)
                      </p>
                      <p className="font-semibold text-gold">
                        {order.totalPrice.toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                ))}
                {orders.length > 5 && (
                  <p className="text-sm text-center text-text-light">
                    ... et {orders.length - 5} autres commande(s)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
