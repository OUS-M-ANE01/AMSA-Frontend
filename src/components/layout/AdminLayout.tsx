import { useState, memo } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  FileText,
  Search,
  Home,
  Tag,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { NotificationPanel } from "../admin/NotificationPanel";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-products", label: "Produits", icon: Package },
    { id: "admin-categories", label: "Catégories", icon: Tag },
    { id: "admin-orders", label: "Commandes", icon: ShoppingCart },
    { id: "admin-users", label: "Utilisateurs", icon: Users },
    { id: "admin-notifications", label: "Notifications", icon: Settings },
    { id: "separator-1", label: "separator", icon: null },
    { id: "admin-content", label: "Contenu Site", icon: FileText },
    { id: "separator-2", label: "separator", icon: null },
    { id: "admin-settings", label: "Paramètres", icon: Settings },
    { id: "back-to-site", label: "Retour au site", icon: Home },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success("Vous êtes déconnecté avec succès");
    setShowLogoutModal(false);
    onNavigate("accueil");
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      {/* Mobile Menu Button - Fixed top left */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#3A3A3A] text-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay pour mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          sidebarOpen ? "w-64" : "lg:w-20 w-64"
        } fixed left-0 top-0 h-screen bg-[#3A3A3A] text-white transition-all duration-300 flex flex-col shadow-2xl z-50 overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-[#6B6B6B]">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8B7355] rounded-xl flex items-center justify-center shadow-md">
                  <Package className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    Eva<span className="text-[#8B7355]">Styl</span>
                  </h1>
                  <p className="text-xs text-[#9B9B9B]">Administration</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-[#6B6B6B]/50 rounded-lg transition-all hover:scale-110 ml-auto"
              title={sidebarOpen ? "Réduire" : "Agrandir"}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2.5 space-y-1">
          {menuItems.map((item) => {
            if (item.label === "separator") {
              return (
                <div
                  key={item.id}
                  className="h-px bg-[#6B6B6B]/30 my-1.5"
                ></div>
              );
            }

            const Icon = item.icon!;
            const isActive = currentPage === item.id;
            const isBackButton = item.id === "back-to-site";

            return (
              <button
                key={item.id}
                onClick={() => {
                  // "Retour au site" navigue vers accueil sans déconnecter
                  if (isBackButton) {
                    onNavigate("accueil");
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group relative overflow-hidden ${
                  isBackButton
                    ? "text-[#E8E0D5] hover:bg-[#4A4A4A] hover:text-white border-t border-[#6B6B6B]/30 mt-auto"
                    : isActive
                      ? "bg-[#8B7355] text-white shadow-lg shadow-[#8B7355]/30"
                      : "text-[#E8E0D5] hover:bg-[#4A4A4A] hover:text-white"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-9 h-9 rounded-lg transition-all ${
                    isActive
                      ? "bg-white/10"
                      : "bg-[#4A4A4A]/30 group-hover:bg-[#6B6B6B]"
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0 relative z-10" />
                </div>
                {sidebarOpen && (
                  <span className="font-medium text-sm relative z-10">
                    {item.label}
                  </span>
                )}
                {isActive && !isBackButton && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

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

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
      >
        {/* Desktop Header - Fixed */}
        <header className="bg-white border-b border-[#E8E0D5] sticky top-0 z-40 shadow-sm">
          <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F1ED] border border-[#E8E0D5] rounded-xl text-sm text-[#3A3A3A] placeholder:text-[#9B9B9B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Mobile: Logo */}
            <div className="md:hidden flex-1 ml-12">
              <h1 className="text-lg font-bold text-[#3A3A3A]">
                Eva<span className="text-[#8B7355]">Styl</span>
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              <NotificationPanel />

              {/* Divider - Hidden on mobile */}
              <div className="hidden sm:block h-8 w-px bg-[#E8E0D5]"></div>

              {/* Profile Info */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-semibold text-[#3A3A3A]">
                    {user?.prenom} {user?.nom}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">Administrateur</p>
                </div>
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#8B7355] rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {user?.prenom?.[0]}
                      {user?.nom?.[0]}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Divider - Hidden on mobile */}
              <div className="hidden sm:block h-8 w-px bg-[#E8E0D5]"></div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-[#3A3A3A] hover:bg-[#8B7355] text-white rounded-xl transition-all group shadow-md hover:shadow-lg"
              >
                <LogOut
                  size={16}
                  className="group-hover:rotate-12 transition-transform"
                />
                <span className="text-sm font-medium hidden sm:inline">
                  Déconnexion
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}

// Mémorisation du layout pour éviter les re-renders inutiles lors de la navigation
export default memo(AdminLayout);
