import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, ShoppingBag, TrendingUp, Users, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import toast, { Toaster } from 'react-hot-toast';

interface AdminLoginProps {
  onNavigate: (page: string) => void;
}

export default function AdminLogin({ onNavigate }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { isAuthenticated, user } = useAuthStore();

  // Rediriger automatiquement si déjà connecté en tant qu'admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      console.log('✅ Utilisateur déjà authentifié, redirection vers le dashboard');
      onNavigate('admin-dashboard');
    }
  }, [isAuthenticated, user, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      if (result.user?.role === 'admin') {
        toast.success('Connexion réussie !');
        setTimeout(() => {
          onNavigate('admin-dashboard');
        }, 500);
      } else {
        toast.error('Accès refusé. Vous n\'êtes pas administrateur.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      toast.error(result.error || 'Email ou mot de passe incorrect');
    }
    
    setLoading(false);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Left Side - Image with Content */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
          alt="Fashion Store"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay sombre plus prononcé pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-black/75"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-8 text-white w-full">
          {/* Logo en haut */}
          <div>
            <div className="font-serif text-4xl font-semibold tracking-wider mb-2">
              Eva<span className="text-[#8B7355]">Styl</span>
            </div>
            <p className="text-sm text-white/80 tracking-[0.2em]">MODE & BIJOUX</p>
          </div>

          {/* Contenu central */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-light mb-3 leading-tight">
                Gérez votre boutique <br />
                <span className="text-[#8B7355]">avec élégance</span>
              </h2>
              <p className="text-white/90 text-base leading-relaxed max-w-md">
                Accédez à votre tableau de bord pour piloter vos ventes, 
                gérer votre catalogue et suivre vos commandes en temps réel.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Package className="text-[#8B7355]" size={20} />
                </div>
                <h3 className="font-medium">Catalogue</h3>
                <p className="text-sm text-white/60">Gérez vos produits facilement</p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <ShoppingBag className="text-[#8B7355]" size={20} />
                </div>
                <h3 className="font-medium">Commandes</h3>
                <p className="text-sm text-white/60">Suivez vos ventes</p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="text-[#8B7355]" size={20} />
                </div>
                <h3 className="font-medium">Analytics</h3>
                <p className="text-sm text-white/60">Statistiques détaillées</p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Users className="text-[#8B7355]" size={20} />
                </div>
                <h3 className="font-medium">Clients</h3>
                <p className="text-sm text-white/60">Base de données clients</p>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="text-white/50 text-sm">
            <p>© 2025 EvaStyl. Tous droits réservés.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center mt-4 justify-center bg-[#FAF9F7] px-6 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md py-4 mt-12">
          {/* Logo */}
          <div className="flex justify-center mb-4 z-index-1">
            <img 
              src="/logo_evastyl.png" 
              alt="EvaStyl Logo" 
              className="h-24 w-auto"
            />
          </div>

          {/* Header */}
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-light text-[#2C2C2C] mb-2">
              Administration
            </h1>
            <p className="text-[#8B8680] text-sm">
              Connectez-vous pour gérer votre boutique
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-[#E0DDD8] rounded-lg text-[#2C2C2C] placeholder-[#B8B3AD] focus:outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/10 transition-all"
                placeholder="admin@evastyl.com"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-[#E0DDD8] rounded-lg text-[#2C2C2C] placeholder-[#B8B3AD] focus:outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/10 transition-all pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B8680] hover:text-[#2C2C2C] transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-[#E0DDD8] text-[#8B7355] focus:ring-[#8B7355] focus:ring-offset-0"
                />
                <span className="text-[#8B8680]">Se souvenir de moi</span>
              </label>
              <button
                type="button"
                className="text-[#8B7355] hover:text-[#2C2C2C] transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B7355] text-white font-medium py-3 rounded-lg hover:bg-[#6D5942] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Back link */}
          <button
            onClick={() => onNavigate('accueil')}
            className="flex items-center mt-4 justify-center gap-2 w-full py-3 text-sm text-[#8B8680] hover:text-[#8B7355] transition-colors border border-[#E0DDD8] rounded-lg hover:border-[#8B7355]/30"
          >
            <ArrowLeft size={16} />
            Retour au site
          </button>

          {/* Info dev */}
          <div className="mt-8 pt-6 border-t border-[#E0DDD8]">
            <p className="text-xs text-[#B8B3AD] text-center">
              Environnement de test : admin@evastyl.com / Admin@123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}