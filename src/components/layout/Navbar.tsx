import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useEffect, useState } from 'react';

type PageType = 'accueil' | 'soldes' | 'vetements' | 'bijoux' | 'apropos' | 'contact' | 'favoris' | 'profil' | 'panier' | 'checkout';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: PageType) => void;
  onSearchOpen?: () => void;
  onCartOpen?: () => void;
  cartItemsCount?: number;
  onProfileClick?: () => void;
}

export default function Navbar({ currentPage, onNavigate, onSearchOpen, onCartOpen, cartItemsCount = 0, onProfileClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Accueil', page: 'accueil' },
    { label: 'Soldes', page: 'soldes' },
    { label: 'Vêtements', page: 'vetements' },
    { label: 'Bijoux', page: 'bijoux' },
    { label: 'À propos', page: 'apropos' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavigation = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-14 py-4 h-18 bg-cream/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? 'border-b border-black/40 shadow-[0_4px_24px_rgba(0,0,0,0.08)]' : ''
        }`}
      >

        <button 
          onClick={() => handleNavigation('accueil')}
          className="flex items-center gap-3 font-serif text-xl md:text-[26px] font-semibold tracking-wider text-charcoal hover:opacity-80 transition-opacity"
        >
          <img src="/ASMA.png" alt="ASMA Logo" className="w-24 h-24 object-contain mr-2" />
        </button>

        {/* Menu Desktop */}
        <ul className="hidden lg:flex gap-9 list-none">
          {navItems.map((item) => (
            <li key={item.page}>
              <button
                onClick={() => handleNavigation(item.page)}
                className={`text-[13px] font-normal tracking-[0.1em] uppercase transition-colors ${
                  currentPage === item.page
                    ? 'text-gold border-b border-gold pb-1'
                    : 'text-charcoal hover:text-gold'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-3 lg:gap-5">
          <button 
            onClick={onSearchOpen}
            aria-label="Recherche" 
            className="text-charcoal hover:text-gold transition-colors"
          >
            <Search size={18} />
          </button>
          <button 
            onClick={() => handleNavigation('favoris')}
            aria-label="Favoris" 
            className="text-charcoal hover:text-gold transition-colors"
          >
            <Heart size={18} />
          </button>
          <button 
            onClick={onCartOpen}
            aria-label="Panier" 
            className="relative text-charcoal hover:text-gold transition-colors"
          >
            <ShoppingBag size={18} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button 
            onClick={onProfileClick}
            aria-label="Profil" 
            className="hidden lg:flex text-charcoal hover:text-gold transition-colors"
          >
            <User size={18} />
          </button>
        </div>

        {/* Burger Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-charcoal hover:text-gold transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Menu Mobile */}
      <div 
        className={`fixed top-18 left-0 right-0 bg-cream border-b border-black/20 shadow-lg z-40 transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <ul className="py-4">
          {navItems.map((item) => (
            <li key={item.page}>
              <button 
                onClick={() => handleNavigation(item.page)}
                className={`w-full text-left px-6 py-3 text-sm font-normal tracking-[0.1em] uppercase transition-colors ${
                  currentPage === item.page
                    ? 'text-gold bg-gold/10'
                    : 'text-charcoal hover:bg-cream-dark'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-center gap-6 py-4 border-t border-black/10">
          <button 
            onClick={() => { onSearchOpen?.(); setMobileMenuOpen(false); }}
            aria-label="Recherche" 
            className="text-charcoal hover:text-gold transition-colors"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={() => handleNavigation('favoris')}
            aria-label="Favoris" 
            className="text-charcoal hover:text-gold transition-colors"
          >
            <Heart size={20} />
          </button>
          <button 
            onClick={() => { onCartOpen?.(); setMobileMenuOpen(false); }}
            aria-label="Panier" 
            className="relative text-charcoal hover:text-gold transition-colors"
          >
            <ShoppingBag size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => { onProfileClick?.(); setMobileMenuOpen(false); }}
            aria-label="Profil" 
            className="text-charcoal hover:text-gold transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
