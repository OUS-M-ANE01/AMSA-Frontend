import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Loader2, Bell, Mail, Smartphone } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Notification {
  _id: string;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  status: 'sent' | 'failed';
  createdAt: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Remplacez par votre endpoint backend
      const response = await adminAPI.getNotifications();
      setNotifications(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-[#8B7355]" size={32} />
        <h1 className="text-3xl font-bold text-[#3A3A3A]">Centre de notifications</h1>
      </div>
      <div className="bg-white rounded-xl p-6 border border-[#E8E0D5] shadow-sm">
        <h2 className="text-xl font-bold text-[#3A3A3A] mb-4">Historique des notifications</h2>
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="animate-spin text-[#8B7355]" size={32} />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-[#6B6B6B]">Aucune notification envoyée.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F5F1ED] border-b border-[#E8E0D5]">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[#3A3A3A]">Type</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[#3A3A3A]">Destinataire</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[#3A3A3A]">Sujet</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[#3A3A3A]">Message</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[#3A3A3A]">Statut</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-[#3A3A3A]">Date</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => (
                <tr key={notif._id} className="border-t border-[#E8E0D5]">
                  <td className="py-2 px-3">
                    {notif.type === 'email' ? <Mail size={16} className="inline text-[#8B7355]" /> : notif.type === 'sms' ? <Smartphone size={16} className="inline text-[#8B7355]" /> : <Bell size={16} className="inline text-[#8B7355]" />} {notif.type}
                  </td>
                  <td className="py-2 px-3">{notif.recipient}</td>
                  <td className="py-2 px-3">{notif.subject || '-'}</td>
                  <td className="py-2 px-3">{notif.message}</td>
                  <td className={`py-2 px-3 font-medium ${notif.status === 'sent' ? 'text-[#065F46]' : 'text-[#C53030]'}`}>{notif.status === 'sent' ? 'Envoyée' : 'Échec'}</td>
                  <td className="py-2 px-3">{new Date(notif.createdAt).toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
