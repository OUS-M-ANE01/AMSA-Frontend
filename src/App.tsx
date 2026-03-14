import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import Loader from './components/Loader';
import AuthModal from './components/AuthModal';
import PaymentResult from './components/PaymentResult';
import { Search, X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Import direct des pages admin pour navigation instantanée
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminContent from './pages/admin/AdminContent';
import AdminCategories from './pages/admin/AdminCategories';
import AdminNotifications from './pages/admin/AdminNotifications';

// Lazy load uniquement pour les pages front-end (optimisation SEO/Performance)
const Home = lazy(() => import('./pages/Home'));
const Soldes = lazy(() => import('./pages/Soldes'));
const Vetements = lazy(() => import('./pages/Vetements'));
const Bijoux = lazy(() => import('./pages/Bijoux'));
const Apropos = lazy(() => import('./pages/Apropos'));
const Contact = lazy(() => import('./pages/Contact'));
const Favoris = lazy(() => import('./pages/Favoris'));
const Profil = lazy(() => import('./pages/Profil'));
const Checkout = lazy(() => import('./pages/Checkout'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

// Helper pour obtenir la page depuis l'URL hash (ignore les query params dans le hash)
const getPageFromHash = (): PageType => {
  const hash = window.location.hash.slice(1); // Enlever le #
  const page = hash.split('?')[0];            // Ignorer les query params
  return page || 'accueil';
};

// Helper pour lire les query params contenus dans le hash (#page?key=val)
const getHashParams = (): URLSearchParams => {
  const hash = window.location.hash.slice(1);
  const queryStr = hash.includes('?') ? hash.split('?')[1] : '';
  return new URLSearchParams(queryStr);
};

// Helper pour mettre à jour l'URL hash
const updateHash = (page: string) => {
  window.location.hash = page;
};

type PageType = 'accueil' | 'soldes' | 'vetements' | 'bijoux' | 'apropos' | 'contact' | 'favoris' | 'profil' | 'panier' | 'checkout' | 'auth' | 'admin-dashboard' | 'admin-products' | 'admin-orders' | 'admin-users' | 'admin-settings' | 'admin-testimonials' | 'admin-content' | 'admin-notifications' | string;

function App() {
  // Initialiser avec la page depuis l'URL
  const [currentPage, setCurrentPage] = useState<PageType>(getPageFromHash());
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { isAuthenticated } = useAuth();
  
  // Délai minimum pour le loader initial (800ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gérer la navigation avec l'URL et afficher le loader
  const handleNavigate = (page: string) => {
    const isAdminNav = page.startsWith('admin-') && typeof currentPage === 'string' && currentPage.startsWith('admin-');
    
    // Pas de loader pour la navigation interne au dashboard admin
    if (!isAdminNav) {
      setIsNavigating(true);
      setTimeout(() => {
        setIsNavigating(false);
      }, 400);
    }
    
    setCurrentPage(page);
    updateHash(page);
    window.scrollTo(0, 0);
  };

  // Écouter les changements de hash (bouton back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getPageFromHash();
      setCurrentPage(newPage);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Use cart store instead of local state
  const { 
    items: cartItems, 
    isOpen: cartOpen, 
    removeItem, 
    updateQuantity, 
    totalItems, 
    totalPrice,
    openCart,
    closeCart 
  } = useCart();
  
  // Use favorites store instead of local state
  const { favoriteIds, isFavorite, toggleFavorite } = useFavorites();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddToCart = (_id: string | number) => {
    // Products handle their own cart via useCart internally
  };

  const renderPage = () => {
    // Gestion des pages admin
    if (typeof currentPage === 'string' && currentPage.startsWith('admin-')) {
      // Page de login admin sans layout
      if (currentPage === 'auth') {
        return <Auth onNavigate={handleNavigate} />;
      }
      
      // Autres pages admin avec layout
      let adminContent;
      switch (currentPage) {
        case 'admin-dashboard':
          adminContent = <AdminDashboard />;
          break;
        case 'admin-products':
          adminContent = <AdminProducts />;
          break;
        case 'admin-categories':
          adminContent = <AdminCategories />;
          break;
        case 'admin-orders':
          adminContent = <AdminOrders />;
          break;
        case 'admin-users':
          adminContent = <AdminUsers />;
          break;
        case 'admin-settings':
          adminContent = <AdminSettings />;
          break;
        case 'admin-testimonials':
          adminContent = <AdminTestimonials />;
          break;
        case 'admin-content':
          adminContent = <AdminContent />;
          break;
        case 'admin-notifications':
          adminContent = <AdminNotifications />;
          break;
        default:
          adminContent = <AdminDashboard />;
      }
      
      return (
        <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
          {adminContent}
        </AdminLayout>
      );
    }
    
    // Gestion des pages de détails produit
    if (typeof currentPage === 'string' && currentPage.startsWith('product-')) {
      const productId = currentPage.replace('product-', '');
      return (
        <ProductDetail 
          productId={productId}
          onNavigate={(page) => handleNavigate(page)}
          onAddToCart={handleAddToCart}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite(parseInt(productId) || 0)}
        />
      );
    }

    switch (currentPage) {
      case 'accueil':
        return (
          <Home 
            onNavigate={(page) => handleNavigate(page)} 
            onAddToCart={handleAddToCart}
            onToggleFavorite={toggleFavorite}
            favoriteItems={favoriteIds.map(Number)}
          />
        );
      
      case 'soldes':
        return <Soldes onNavigate={(page) => handleNavigate(page)} />;
      
      case 'vetements':
        return (
          <Vetements 
            onNavigate={(page) => handleNavigate(page)} 
            onAddToCart={handleAddToCart}
            onToggleFavorite={toggleFavorite}
            favoriteItems={favoriteIds.map(Number)}
          />
        );
      
      case 'bijoux':
        return (
          <Bijoux 
            onNavigate={(page) => handleNavigate(page)} 
            onAddToCart={handleAddToCart}
            onToggleFavorite={toggleFavorite}
            favoriteItems={favoriteIds.map(Number)}
          />
        );
      
      case 'apropos':
        return <Apropos />;
      
      case 'contact':
        return <Contact />;
      
      case 'favoris':
        return (
          <Favoris 
            onNavigate={(page) => handleNavigate(page)} 
            favoriteItems={favoriteIds.map(Number)}
            onToggleFavorite={toggleFavorite}
            onAddToCart={handleAddToCart}
          />
        );
      
      case 'profil':
        return <Profil />;
        return <Profil onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={(page) => handleNavigate(page)} />;

      case 'commande-succes': {
        const p = getHashParams();
        return (
          <PaymentResult
            status="success"
            orderId={p.get('order_id') || ''}
            nabooId={p.get('naboo_id') || ''}
            onNavigate={handleNavigate}
          />
        );
      }

      case 'commande-echec': {
        const p = getHashParams();
        return (
          <PaymentResult
            status="error"
            orderId={p.get('order_id') || ''}
            nabooId=''
            onNavigate={handleNavigate}
          />
        );
      }
      
      default:
        return null;
    }
  };
  
  // Get cart products - CartItem already contains name, price, image
  const cartProducts = cartItems;

  // Vérifier si on est sur une page admin
  const isAdminPage = typeof currentPage === 'string' && currentPage.startsWith('admin-');

  // Afficher le loader au chargement initial ou pendant la navigation
  if (isLoading || isNavigating) {
    return <Loader />;
  }

  // Si page admin, afficher uniquement le contenu admin (pas de Suspense - navigation instantanée)
  if (isAdminPage) {
    return (
      <div className="min-h-screen">
        {renderPage()}
      </div>
    );
  }

  // Pages normales avec Navbar et Footer
  return (
    <div className="min-h-screen">
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        onSearchOpen={() => setSearchOpen(true)}
        onCartOpen={openCart}
        cartItemsCount={totalItems}
        onProfileClick={() => {
          if (isAuthenticated) {
            handleNavigate('profil');
          } else {
            setAuthModalOpen(true);
          }
        }}
      />
      
      {/* Modal Auth */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {
            setAuthModalOpen(false);
            handleNavigate('profil');
          }}
        />
      )}

      {/* Modal de recherche */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20">
          <div className="bg-white w-full max-w-3xl mx-4 rounded-lg shadow-2xl">
            <div className="flex items-center gap-4 p-6 border-b border-border">
              <Search className="w-5 h-5 text-text-light" />
              <input 
                type="text"
                placeholder="Rechercher un produit, une collection..."
                className="flex-1 text-lg outline-none"
                autoFocus
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="text-charcoal hover:text-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <h3 className="text-sm uppercase tracking-wider text-text-light mb-4">Suggestions</h3>
              <div className="space-y-3">
                {['Robes été', 'Bijoux or', 'Nouvelle collection', 'Accessoires'].map((suggestion, i) => (
                  <button
                    key={i}
                    className="block w-full text-left px-4 py-3 hover:bg-cream transition-colors text-charcoal"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar Panier */}
      <>
        {cartOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
            onClick={closeCart}
            style={{ top: '72px' }}
          ></div>
        )}
        <div 
          className={`fixed top-18 right-0 h-[calc(100vh-72px)] w-full md:w-[440px] bg-white z-50 shadow-2xl flex flex-col transition-all duration-400 ${
            cartOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-serif text-xl font-light">
                Mon <em className="italic text-gold">Panier</em>
              </h2>
              <button 
                onClick={closeCart}
                className="text-charcoal hover:text-gold transition-colors"
              >
                <X size={22} />
              </button>
            </div>
            
            {cartProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <ShoppingBag size={64} className="text-text-light mb-4" />
                <p className="text-text-light text-center mb-6">Votre panier est vide</p>
                <button 
                  onClick={() => { closeCart(); handleNavigate('collections'); }}
                  className="px-6 py-3 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors"
                >
                  Découvrir nos produits
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cartProducts.map((item: any) => {
                    const productId = item.productId || String(item.id);
                    return (
                      <div key={productId} className="flex gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-charcoal text-sm font-medium mb-1">{item.name}</h3>
                          <p className="text-xs text-text-light mb-2">{item.price.toLocaleString()} FCFA</p>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(productId, item.quantity - 1)}
                              className="w-7 h-7 border border-border flex items-center justify-center hover:border-gold transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-charcoal text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(productId, item.quantity + 1)}
                              className="w-7 h-7 border border-border flex items-center justify-center hover:border-gold transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => removeItem(productId)}
                          className="text-text-light hover:text-red-600 transition-colors self-start"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t border-border p-5">
                  <div className="flex justify-between mb-4">
                    <span className="text-sm text-text-light">Sous-total</span>
                    <span className="text-charcoal text-sm font-medium">{totalPrice.toLocaleString()} FCFA</span>
                  </div>
                  <button 
                    onClick={() => { closeCart(); handleNavigate('checkout'); }}
                    className="w-full bg-charcoal text-white py-3 hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase"
                  >
                    Passer la commande
                  </button>
                  <p className="text-xs text-text-light text-center mt-2">
                    Livraison et taxes calculées à la prochaine étape
                  </p>
                </div>
              </>
            )}
          </div>
      </>
      
      <Suspense fallback={<Loader />}>
        {renderPage()}
      </Suspense>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
