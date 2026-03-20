import { useState, useEffect } from 'react';
import { Mail, Users, TrendingUp, Send, Download, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Subscriber {
  _id: string;
  email: string;
  prenom?: string;
  source: string;
  isActive: boolean;
  subscribedAt: string;
  preferences: {
    nouveautes: boolean;
    promotions: boolean;
    conseils: boolean;
  };
}

interface Stats {
  totalSubscribers: number;
  totalUnsubscribed: number;
  recentSubscribers: number;
  bySource: Array<{ _id: string; count: number }>;
}

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    content: '',
    targetPreference: 'all'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, subscribersRes] = await Promise.all([
        api.get('/newsletter/stats'),
        api.get('/newsletter/subscribers?limit=100')
      ]);
      setStats(statsRes.data.data);
      setSubscribers(subscribersRes.data.data.subscribers);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    try {
      const response = await api.post('/newsletter/send', emailData);
      toast.success(`Newsletter envoyée avec succès à ${response.data.data.sent} abonné(s)!`);
      setShowSendModal(false);
      setEmailData({ subject: '', content: '', targetPreference: 'all' });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors de l\'envoi de la newsletter';
      toast.error(message);
    }
  };

  const filteredSubscribers = (subscribers || []).filter(s => {
    const matchSearch = s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (s.prenom?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = filterStatus === 'all' || 
                       (filterStatus === 'active' && s.isActive) ||
                       (filterStatus === 'inactive' && !s.isActive);
    return matchSearch && matchStatus;
  });
  const exportSubscribers = () => {
    const csv = [
      ['Email', 'Prénom', 'Source', 'Statut', 'Date inscription'].join(','),
      ...filteredSubscribers.map(s => [
        s.email,
        s.prenom || '',
        s.source,
        s.isActive ? 'Actif' : 'Inactif',
        new Date(s.subscribedAt).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };


  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }

  if (!loading && (subscribers || []).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center">
          <Mail className="w-10 h-10 text-[#8B7355]" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#3A3A3A] mb-2">Aucun abonné pour le moment</h2>
          <p className="text-gray-500">Les abonnés à la newsletter apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#3A3A3A]">Gestion Newsletter</h1>
        <div className="flex gap-3">
          <button
            onClick={exportSubscribers}
            className="flex items-center gap-2 px-4 py-2 border border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED]"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={() => {
              if ((subscribers || []).length === 0) {
                toast.error('Aucun abonné disponible pour envoyer la newsletter');
                return;
              }
              setShowSendModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5845]"
          >
            <Send className="w-4 h-4" />
            Envoyer Newsletter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Abonnés actifs</p>
                <p className="text-3xl font-bold text-[#3A3A3A] mt-1">{stats?.totalSubscribers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Nouveaux (30j)</p>
                <p className="text-3xl font-bold text-[#3A3A3A] mt-1">{stats?.recentSubscribers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E8E0D5]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Désabonnés</p>
                <p className="text-3xl font-bold text-[#3A3A3A] mt-1">{stats?.totalUnsubscribed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-[#E8E0D5]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par email ou prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E8E0D5] rounded-lg focus:border-[#8B7355] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-[#E8E0D5] rounded-lg focus:border-[#8B7355] focus:outline-none"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F1ED]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">Prénom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#3A3A3A] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E0D5]">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-[#F5F1ED]/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3A3A3A]">{subscriber.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3A3A3A]">{subscriber.prenom || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3A3A3A]">
                    <span className="px-2 py-1 bg-[#F5F1ED] rounded-full text-xs">{subscriber.source}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscriber.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#3A3A3A]">
                    {new Date(subscriber.subscribedAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun abonné trouvé
          </div>
        )}
      </div>

      {/* Send Newsletter Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-[#3A3A3A] mb-4">Envoyer une Newsletter</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Sujet</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:border-[#8B7355] focus:outline-none"
                  placeholder="Sujet de l'email..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Audience</label>
                <select
                  value={emailData.targetPreference}
                  onChange={(e) => setEmailData({...emailData, targetPreference: e.target.value})}
                  className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:border-[#8B7355] focus:outline-none"
                >
                  <option value="all">Tous les abonnés</option>
                  <option value="nouveautes">Intéressés par les nouveautés</option>
                  <option value="promotions">Intéressés par les promotions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Contenu</label>
                <textarea
                  value={emailData.content}
                  onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:border-[#8B7355] focus:outline-none"
                  placeholder="Contenu de la newsletter..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2 border border-[#D4C4B0] text-[#3A3A3A] rounded-lg hover:bg-[#F5F1ED]"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendNewsletter}
                  disabled={!emailData.subject || !emailData.content}
                  className="flex-1 px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5845] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
