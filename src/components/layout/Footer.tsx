import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { isAuthenticated } = useAuthStore();
  return (
    <footer className="bg-[#111110] text-white/55 px-4 md:px-8 lg:px-14 py-12 md:py-16 pb-6 md:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 lg:gap-14 mb-10 md:mb-14">
        <div>
          <a href="#" className="font-serif text-[26px] font-semibold tracking-wider text-white inline-block mb-4">
            Eva<span className="text-gold">Styl</span>
          </a>
          <p className="text-[13px] leading-relaxed max-w-[260px]">
            Votre destination mode pour des vêtements et bijoux raffinés, pensés pour la femme moderne qui exprime sa personnalité avec élégance.
          </p>
          <div className="flex gap-3 mt-6">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <button 
                key={i}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/55 hover:border-gold hover:text-gold transition-all"
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-white mb-5 font-medium">
            Collections
          </h4>
          <ul className="space-y-2.5">
            {['Robes & Jupes', 'Hauts & Tops', 'Vestes & Manteaux', 'Pantalons', 'Nouvelle Saison'].map((item, i) => (
              <li key={i}>
                <a href="#" className="text-[13px] text-white/50 hover:text-gold transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-white mb-5 font-medium">
            Bijoux
          </h4>
          <ul className="space-y-2.5">
            {['Colliers', 'Boucles d\'oreilles', 'Bracelets', 'Bagues', 'Parures'].map((item, i) => (
              <li key={i}>
                <a href="#" className="text-[13px] text-white/50 hover:text-gold transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-white mb-5 font-medium">
            Service Client
          </h4>
          <ul className="space-y-2.5">
            {['Mon compte', 'Suivi commande', 'Livraison & Retours', 'FAQ', 'Contact'].map((item, i) => (
              <li key={i}>
                <a href="#" className="text-[13px] text-white/50 hover:text-gold transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8 pt-6 md:pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <div className="flex items-center gap-4">
          <span>© 2026 EvaStyl by OUS_M_ANE. Tous droits réservés.</span>
          
        </div>
        <div className="flex gap-2 md:gap-2.5 items-center flex-wrap justify-center">
          {['VISA', 'WAVE', 'ORANGE MONEY', 'PAYPAL'].map((pay, i) => (
            <span 
              key={i}
              className="bg-white/8 rounded px-2.5 py-1 text-[10px] tracking-wider text-white/50 font-semibold"
            >
              {pay}
            </span>
          ))}
          {onNavigate && (
            <button
              onClick={() => onNavigate(isAuthenticated ? 'admin-dashboard' : 'admin-login')}
              className="text-white/30 hover:text-gold transition-colors text-[10px]"
              title="Administration"
            >
              Admin
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
