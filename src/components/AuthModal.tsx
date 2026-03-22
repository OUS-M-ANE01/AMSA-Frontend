import { useState } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../config/firebase';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

/* ── Icônes sociales SVG ── */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path fill="#000000" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

/* ── Champ input réutilisable ── */
function Field({
  icon: Icon,
  right,
  ...props
}: { icon: React.ElementType; right?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mink pointer-events-none" />
      <input
        {...props}
        className="w-full pl-9 pr-9 py-2.5 bg-cream border border-border rounded-lg text-sm text-charcoal placeholder-[#B5AFA8] focus:outline-none focus:border-gold transition-colors"
      />
      {right && <span className="absolute right-3 top-1/2 -translate-y-1/2">{right}</span>}
    </div>
  );
}

/* ── Bouton social ── */
function SocialBtn({ icon, label }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {}}
      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-200 border border-border rounded-lg text-xs text-gray-400 font-medium cursor-not-allowed opacity-60"
      disabled
      aria-disabled="true"
      tabIndex={-1}
    >
      {icon}
      {label}
    </button>
  );
}


export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    prenom: '', nom: '', email: '', password: '', telephone: '',
  });
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(loginData.email, loginData.password);
    setLoading(false);
    if (result.success) {
      toast.success(`Bienvenue ${result.user?.prenom || ''} !`);
      // Redirection selon le rôle
      if (result.user?.role === 'admin') {
        window.location.hash = 'admin-dashboard';
      } else {
        window.location.hash = 'profil';
      }
      onSuccess();
    } else {
      toast.error(result.error || 'Email ou mot de passe incorrect');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      setLoading(false);
      if (data.success && data.data?.status === 'pending_verification') {
        setOtpStep(true);
        setPendingEmail(registerData.email);
        toast.success('Un code a été envoyé à votre email.');
      } else if (data.success) {
        toast.success(`Bienvenue ${data.data.user?.prenom || ''} !`);
        onSuccess();
        onClose();
      } else {
        toast.error(data.errors?.[0]?.msg || data.message || "Erreur lors de l'inscription");
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message || "Erreur lors de l'inscription");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.success) {
        toast.success('Email vérifié, vous pouvez vous connecter !');
        setOtpStep(false);
        setMode('login');
      } else {
        toast.error(data.message || 'Code incorrect ou expiré');
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.message || 'Erreur lors de la vérification');
    }
  };

  const handleSocialLogin = async (provider: string) => {
  try {
    let result;
    
    if (provider === 'Google') {
      result = await signInWithPopup(auth, googleProvider);
    } else if (provider === 'Facebook') {
      result = await signInWithPopup(auth, facebookProvider);
    } else {
      return;
    }
    
    // Récupère le token Firebase
    const token = await result.user.getIdToken();
    
    // Envoie le token au backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_URL}/auth/firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Connexion ${provider} réussie !`);
      onSuccess?.();
      onClose();
    } else {
      toast.error(data.message || 'Erreur de connexion');
    }
  } catch (error: any) {
    console.error(`Erreur connexion ${provider}:`, error);
    toast.error(error.message || `Erreur de connexion avec ${provider}`);
  }
};


  const eyeBtn = (
    <button
      type="button"
      onClick={() => setShowPassword(v => !v)}
      className="text-mink hover:text-charcoal transition-colors"
    >
      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
    </button>
  );

  /* ── Séparateur ── */
  const Divider = () => (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[10px] text-[#B5AFA8] uppercase tracking-widest">ou</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );

  const switchMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setShowPassword(false); };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">

      {/* ══════════════════════════════════════════
          MOBILE — vue verticale (< sm)
      ══════════════════════════════════════════ */}
      <div className="sm:hidden w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden bg-warm-white flex flex-col max-h-[92vh]">

        {/* Header foncé */}
        <div
          className="relative flex items-center justify-between px-5 py-4 text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #1A1A18 0%, #3A2F25 60%, #8C7B6B 100%)' }}
        >
          <div>
            <p className="text-gold text-[9px] uppercase tracking-[0.35em] font-medium">AS'MA</p>
            <h2 className="font-serif text-lg font-light leading-tight">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps — scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          {/* Boutons sociaux */}
          <div className="space-y-2 mb-1">
            <SocialBtn icon={<GoogleIcon />} label="Continuer avec Google" onClick={() => handleSocialLogin('Google')} />
            <div className="grid grid-cols-2 gap-2">
              <SocialBtn icon={<FacebookIcon />} label="Facebook" onClick={() => handleSocialLogin('Facebook')} />
              <SocialBtn icon={<AppleIcon />} label="Apple" onClick={() => handleSocialLogin('Apple')} />
            </div>
          </div>

          <Divider />

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <Field icon={Mail} type="email" required placeholder="Email"
                value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
              <Field icon={Lock} type={showPassword ? 'text' : 'password'} required placeholder="Mot de passe"
                value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                right={eyeBtn} />
              <button type="submit" disabled={loading}
                className="w-full mt-1 bg-charcoal hover:bg-gold text-white text-[11px] font-semibold uppercase tracking-widest py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Field icon={User} type="text" required placeholder="Prénom"
                  value={registerData.prenom} onChange={e => setRegisterData({ ...registerData, prenom: e.target.value })} />
                <input type="text" required placeholder="Nom" value={registerData.nom}
                  onChange={e => setRegisterData({ ...registerData, nom: e.target.value })}
                  className="w-full px-3 py-2.5 bg-cream border border-border rounded-lg text-sm text-charcoal placeholder-[#B5AFA8] focus:outline-none focus:border-gold transition-colors" />
              </div>
              <Field icon={Mail} type="email" required placeholder="Email"
                value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
              <Field icon={Phone} type="tel" placeholder="+221 77 000 00 00"
                value={registerData.telephone} onChange={e => setRegisterData({ ...registerData, telephone: e.target.value })} />
              <Field icon={Lock} type={showPassword ? 'text' : 'password'} required placeholder="Mot de passe (min. 8 caractères)"
                value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                right={eyeBtn} />
              <button type="submit" disabled={loading}
                className="w-full bg-charcoal hover:bg-gold text-white text-[11px] font-semibold uppercase tracking-widest py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Création…' : 'Créer mon compte'}
              </button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-[#B5AFA8]">
            {mode === 'login' ? 'Pas encore membre ?' : 'Déjà un compte ?'}{' '}
            <button onClick={switchMode} className="text-gold font-semibold hover:underline">
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP — split-panel (≥ sm)
      ══════════════════════════════════════════ */}
      <div
        className="hidden sm:flex relative w-full overflow-hidden rounded-2xl shadow-2xl bg-warm-white"
        style={{ maxWidth: 860, minHeight: 560 }}
      >

        {/* ── Bouton fermer ── */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-30 p-1.5 rounded-full transition-colors
            ${mode === 'login'
              ? 'text-white/60 hover:text-white hover:bg-white/10'
              : 'text-mink hover:text-charcoal hover:bg-black/5'}`}
        >
          <X size={18} />
        </button>

        {/* FORMULAIRE CONNEXION — moitié gauche */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 flex flex-col justify-center px-10 py-8 transition-opacity duration-500
            ${mode === 'login' ? 'opacity-100 pointer-events-auto z-[1]' : 'opacity-0 pointer-events-none z-0'}`}
        >
          <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium mb-1">AS'MA</p>
          <h2 className="font-serif text-[1.75rem] text-charcoal mb-1 font-light">Connexion</h2>
          <p className="text-[#B5AFA8] text-xs mb-5 tracking-wide">Accédez à votre espace personnel</p>

          <div className="space-y-2 mb-1">
            <SocialBtn icon={<GoogleIcon />} label="Continuer avec Google" onClick={() => handleSocialLogin('Google')} />
            <div className="grid grid-cols-2 gap-2">
              <SocialBtn icon={<FacebookIcon />} label="Facebook" onClick={() => handleSocialLogin('Facebook')} />
              <SocialBtn icon={<AppleIcon />} label="Apple" onClick={() => handleSocialLogin('Apple')} />
            </div>
          </div>

          <Divider />

          <form onSubmit={handleLogin} className="space-y-3">
            <Field icon={Mail} type="email" required placeholder="Email"
              value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
            <Field icon={Lock} type={showPassword ? 'text' : 'password'} required placeholder="Mot de passe"
              value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })}
              right={eyeBtn} />
            <button type="submit" disabled={loading}
              className="w-full mt-1 bg-charcoal hover:bg-gold text-white text-[11px] font-semibold uppercase tracking-widest py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* FORMULAIRE INSCRIPTION — moitié droite */}
        <div
          className={`absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center px-10 py-8 transition-opacity duration-500
            ${mode === 'register' ? 'opacity-100 pointer-events-auto z-[1]' : 'opacity-0 pointer-events-none z-0'}`}
        >
          <p className="text-gold text-[10px] uppercase tracking-[0.3em] font-medium mb-1">AS'MA</p>
          <h2 className="font-serif text-[1.75rem] text-charcoal mb-1 font-light">Créer un compte</h2>
          <p className="text-[#B5AFA8] text-xs mb-4 tracking-wide">Rejoignez la communauté AS'MA</p>

          <div className="space-y-2 mb-1">
            <SocialBtn icon={<GoogleIcon />} label="Continuer avec Google" onClick={() => handleSocialLogin('Google')} />
            <div className="grid grid-cols-2 gap-2">
              <SocialBtn icon={<FacebookIcon />} label="Facebook" onClick={() => handleSocialLogin('Facebook')} />
              <SocialBtn icon={<AppleIcon />} label="Apple" onClick={() => handleSocialLogin('Apple')} />
            </div>
          </div>

          <Divider />

          {!otpStep ? (
            <form onSubmit={handleRegister} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Field icon={User} type="text" required placeholder="Prénom"
                  value={registerData.prenom} onChange={e => setRegisterData({ ...registerData, prenom: e.target.value })} />
                <input type="text" required placeholder="Nom" value={registerData.nom}
                  onChange={e => setRegisterData({ ...registerData, nom: e.target.value })}
                  className="w-full px-3 py-2.5 bg-cream border border-border rounded-lg text-sm text-charcoal placeholder-[#B5AFA8] focus:outline-none focus:border-gold transition-colors" />
              </div>
              <Field icon={Mail} type="email" required placeholder="Email"
                value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
              <Field icon={Phone} type="tel" placeholder="+221 77 000 00 00"
                value={registerData.telephone} onChange={e => setRegisterData({ ...registerData, telephone: e.target.value })} />
              <Field icon={Lock} type={showPassword ? 'text' : 'password'} required placeholder="Mot de passe (min. 8 caractères)"
                value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                right={eyeBtn} />
              <button type="submit" disabled={loading}
                className="w-full bg-charcoal hover:bg-gold text-white text-[11px] font-semibold uppercase tracking-widest py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Création…' : 'Créer mon compte'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-2.5">
              <div className="mb-2 text-sm text-[#8B7355]">Un code de vérification a été envoyé à <b>{pendingEmail}</b>. Entrez-le ci-dessous :</div>
              <Field icon={Mail} type="text" required placeholder="Code reçu par email" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
              <div className="flex gap-2">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-charcoal hover:bg-gold text-white text-[11px] font-semibold uppercase tracking-widest py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? 'Vérification…' : 'Valider le code'}
                </button>
                <button type="button" disabled={loading}
                  className="flex-1 bg-gray-200 hover:bg-gold/20 text-charcoal text-[11px] font-semibold uppercase tracking-widest py-3 rounded-lg transition-all duration-300 border border-gold"
                  onClick={async () => {
                    if (!pendingEmail) return;
                    setLoading(true);
                    try {
                      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/resend-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: pendingEmail }),
                      });
                      const data = await response.json();
                      setLoading(false);
                      if (data.success) {
                        toast.success('Nouveau code envoyé !');
                      } else {
                        toast.error(data.message || 'Erreur lors de l\'envoi du code');
                      }
                    } catch (error: any) {
                      setLoading(false);
                      toast.error(error?.message || 'Erreur lors de l\'envoi du code');
                    }
                  }}>
                  Renvoyer le code
                </button>
              </div>
            </form>
          )}
        </div>

        {/* PANNEAU GLISSANT — login → droite, register → gauche */}
        <div
          className={`absolute inset-y-0 w-1/2 z-20 flex flex-col items-center justify-center px-10 text-white
            overflow-hidden transition-[left] duration-700 ease-in-out
            ${mode === 'login' ? 'left-1/2' : 'left-0'}`}
          style={{ background: 'linear-gradient(150deg, #1A1A18 0%, #3A2F25 45%, #8C7B6B 100%)' }}
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/10" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-gold/8" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/[0.02]" />
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <div className="relative z-10 text-center px-4">
            <div className="mb-6">
              <div className="w-10 h-0.5 bg-gold mx-auto mb-3" />
              <p className="text-gold text-[11px] uppercase tracking-[0.4em] font-medium">AS'MA</p>
              <div className="w-10 h-0.5 bg-gold mx-auto mt-3" />
            </div>
            <h3 className="font-serif text-2xl font-light leading-snug mb-4 text-white">
              {mode === 'login' ? 'Nouveau ici ?' : 'Bon retour !'}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-[200px] mx-auto">
              {mode === 'login'
                ? 'Créez votre compte et découvrez nos offres exclusives.'
                : 'Déjà membre ? Retrouvez votre espace et vos favoris.'}
            </p>
            <button
              onClick={switchMode}
              className="border border-gold/70 text-gold text-[11px] font-semibold uppercase tracking-[0.2em] px-10 py-3 rounded-full hover:bg-gold hover:text-charcoal transition-all duration-300"
            >
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
