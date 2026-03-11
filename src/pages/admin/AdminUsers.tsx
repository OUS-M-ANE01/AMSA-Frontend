import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Users, 
  Search, 
  Eye,
  Loader2,
  Shield,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.prenom} ${user.nom}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

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
        <Users className="text-[#8B7355]" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Utilisateurs</h1>
          <p className="text-[#6B6B6B] mt-1">{users.length} utilisateur{users.length > 1 ? 's' : ''} au total</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative bg-white rounded-2xl p-4 border-l-4 border-[#8B7355] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#8B7355] rounded-full opacity-5"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-[#F5F1ED] rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-[#8B7355]" size={16} />
                </div>
                <p className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Total utilisateurs</p>
              </div>
              <p className="text-xl font-bold text-[#3A3A3A] mt-1 truncate">{users.length}</p>
              
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#8B7355] rounded-full transition-all duration-1000 ease-out" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl p-4 border-l-4 border-[#6D5942] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#6D5942] rounded-full opacity-5"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-[#F5F1ED] rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Shield className="text-[#6D5942]" size={16} />
                </div>
                <p className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Administrateurs</p>
              </div>
              <p className="text-xl font-bold text-[#3A3A3A] mt-1 truncate">
                {users.filter(u => u.role === 'admin').length}
              </p>
              
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#6D5942] rounded-full transition-all duration-1000 ease-out" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl p-4 border-l-4 border-[#065F46] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#065F46] rounded-full opacity-5"></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-[#D1FAE5] rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-[#065F46]" size={16} />
                </div>
                <p className="text-[#6B6B6B] text-xs font-semibold uppercase tracking-wider">Clients actifs</p>
              </div>
              <p className="text-xl font-bold text-[#3A3A3A] mt-1 truncate">
                {users.filter(u => u.isActive && u.role === 'user').length}
              </p>
              
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#065F46] rounded-full transition-all duration-1000 ease-out" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E8E0D5]">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]" size={18} />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 text-sm border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
          >
            <option value="">Tous les rôles</option>
            <option value="user">Clients</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E8E0D5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F1ED] border-b border-[#E8E0D5]">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-[#3A3A3A] text-sm">Utilisateur</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3A3A3A] text-sm">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3A3A3A] text-sm">Téléphone</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3A3A3A] text-sm">Rôle</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3A3A3A] text-sm">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3A3A3A] text-sm">Inscription</th>
                <th className="text-left py-3 px-4 font-semibold text-[#3A3A3A] text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-t border-[#E8E0D5] hover:bg-[#FAF8F5]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#8B7355] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {user.prenom[0]}{user.nom[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-[#3A3A3A] text-sm">
                          {user.prenom} {user.nom}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#6B6B6B] text-sm">{user.email}</td>
                  <td className="py-3 px-4 text-[#6B6B6B] text-sm">
                    {user.telephone || '-'}
                  </td>
                  <td className="py-3 px-4">
                    {user.role === 'admin' ? (
                      <span className="px-2 py-1 bg-[#F5F1ED] text-[#8B7355] rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <Shield size={12} />
                        Admin
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-[#E8E0D5] text-[#3A3A3A] rounded-full text-xs font-medium">
                        Client
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-[#D1FAE5] text-[#065F46]'
                          : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}
                    >
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#6B6B6B] text-sm">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => viewUserDetails(user)}
                      className="p-1.5 text-[#8B7355] hover:bg-[#F5F1ED] rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-[#6B6B6B]">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>

      {/* Modal détails utilisateur */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#3A3A3A]">
                Détails utilisateur
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
              >
                <X size={24} className="text-[#6B6B6B]" />
              </button>
            </div>

            {/* Avatar & Nom */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-[#FAF8F5] rounded-lg border border-[#E8E0D5]">
              <div className="w-16 h-16 bg-[#8B7355] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {selectedUser.prenom[0]}{selectedUser.nom[0]}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-[#3A3A3A]">
                  {selectedUser.prenom} {selectedUser.nom}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {selectedUser.role === 'admin' ? (
                    <span className="px-2 py-1 bg-[#F5F1ED] text-[#8B7355] rounded-full text-xs font-medium flex items-center gap-1">
                      <Shield size={12} />
                      Administrateur
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-[#E8E0D5] text-[#3A3A3A] rounded-full text-xs font-medium">
                      Client
                    </span>
                  )}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUser.isActive
                        ? 'bg-[#D1FAE5] text-[#065F46]'
                        : 'bg-[#FDECEA] text-[#C53030]'
                    }`}
                  >
                    {selectedUser.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg">
                <Mail className="text-[#8B7355]" size={18} />
                <div className="flex-1">
                  <p className="text-xs text-[#6B6B6B]">Email</p>
                  <p className="text-sm font-medium text-[#3A3A3A]">{selectedUser.email}</p>
                </div>
              </div>

              {selectedUser.telephone && (
                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg">
                  <Phone className="text-[#8B7355]" size={18} />
                  <div className="flex-1">
                    <p className="text-xs text-[#6B6B6B]">Téléphone</p>
                    <p className="text-sm font-medium text-[#3A3A3A]">{selectedUser.telephone}</p>
                  </div>
                </div>
              )}

              {(selectedUser.adresse || selectedUser.ville) && (
                <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg">
                  <MapPin className="text-[#8B7355]" size={18} />
                  <div className="flex-1">
                    <p className="text-xs text-[#6B6B6B]">Adresse</p>
                    <p className="text-sm font-medium text-[#3A3A3A]">
                      {selectedUser.adresse && `${selectedUser.adresse}, `}
                      {selectedUser.ville} {selectedUser.codePostal}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-lg">
                <Calendar className="text-[#8B7355]" size={18} />
                <div className="flex-1">
                  <p className="text-xs text-[#6B6B6B]">Membre depuis</p>
                  <p className="text-sm font-medium text-[#3A3A3A]">
                    {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
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
