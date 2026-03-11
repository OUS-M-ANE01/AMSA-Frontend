import ProductCard from '../components/ProductCard';
import { featuredProducts } from '../data/products';
import { ChevronDown, Check, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { usePublicProducts } from '../hooks/usePublicProducts';
import { useFilterStore } from '../stores/filterStore';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';

interface VetementsProps {
  onNavigate: (page: string) => void;
  onAddToCart: (productId: string | number) => void;
  onToggleFavorite?: (productId: string | number) => void;
  favoriteItems?: number[];
}

const JEWELRY_KEYWORDS = ['collier', 'bijou', 'bague', 'bracelet', 'boucle', 'parure', 'pendentif', 'earring', 'necklace', 'ring', 'jewelry'];
const isJewelry = (cat: string) => JEWELRY_KEYWORDS.some(kw => cat.toLowerCase().includes(kw));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Vetements({ onNavigate }: VetementsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [sortBy, setSortBy] = useState('default');

  const { products: apiProducts, loading, fetchProducts } = usePublicProducts();
  const { pendingCategory, clearPendingCategory } = useFilterStore();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Si une catégorie est pré-sélectionnée (depuis la home), l'appliquer
  useEffect(() => {
    if (pendingCategory) {
      setActiveFilter(pendingCategory);
      clearPendingCategory();
    }
  }, [pendingCategory, clearPendingCategory]);

  // Utiliser les produits de l'API (filtrer les bijoux), fallback sur données statiques
  const baseProducts = useMemo(() => {
    if (apiProducts.length > 0) {
      return apiProducts.filter(p => !isJewelry(p.category));
    }
    return featuredProducts;
  }, [apiProducts]);

  // Catégories uniques depuis les produits
  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(baseProducts.map(p => p.category).filter(Boolean))];
    return cats.slice(0, 5);
  }, [baseProducts]);

  // Filtrage et tri
  const displayProducts = useMemo(() => {
    let filtered = activeFilter === 'Tous'
      ? baseProducts
      : baseProducts.filter(p => p.category.toLowerCase().includes(activeFilter.toLowerCase()));
    
    if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
    else if (sortBy === 'new') filtered = [...filtered].filter(p => p.badge === 'new').concat(filtered.filter(p => p.badge !== 'new'));
    
    return filtered;
  }, [baseProducts, activeFilter, sortBy]);

  const handleAddToCart = (productId: string | number) => {
    const product = displayProducts.find(p => (p._id || String(p.id)) === String(productId));
    if (product) addToCart(product);
  };

  const handleToggleFavorite = (productId: string | number) => {
    toggleFavorite(Number(productId) || 0);
  };

  return (
    <div className="min-h-screen pt-18">
      <div className="relative h-[50vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Image de fond */}
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80" 
          alt="Vêtements"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
        
        {/* Contenu */}
        <div className="relative z-10 text-center px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-white">
            <em className="italic text-gold">Vêtements</em> & Prêt-à-Porter
          </h1>
          <p className="mt-3 md:mt-4 text-white/90 max-w-2xl mx-auto text-base md:text-lg">L'élégance au quotidien, des pièces intemporelles pour toutes les occasions</p>
        </div>
      </div>
      
      {/* Filtres */}
      <section className="py-6 md:py-8 px-4 md:px-8 lg:px-14 bg-warm-white border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            {/* Bouton Filtres avec dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm text-charcoal hover:text-gold transition-colors border-2 border-charcoal hover:border-gold rounded"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="uppercase tracking-wider">Filtres</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-border py-6 px-6 z-20 shadow-xl rounded-sm min-w-[600px]">
                  <div className="flex flex-wrap gap-8">
                    {/* Filtre Catégorie */}
                    <div className="flex-1 min-w-[180px]">
                      <h3 className="text-charcoal font-medium text-xs uppercase tracking-[0.2em] mb-3">Catégorie</h3>
                      <div className="space-y-2">
                        {['Tous', ...uniqueCategories].map((cat) => (
                          <label key={cat} className="flex items-center gap-3 cursor-pointer hover:text-gold transition-colors" onClick={() => { setActiveFilter(cat); setIsFilterOpen(false); }}>
                            <div className={`w-5 h-5 border flex items-center justify-center ${activeFilter === cat ? 'border-charcoal bg-charcoal' : 'border-charcoal'}`}>
                              {activeFilter === cat && <Check className="w-4 h-4 text-white" />}
                            </div>
                            <span className="text-sm text-charcoal">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Filtre Prix */}
                    <div className="flex-1 min-w-[180px]">
                      <h3 className="text-charcoal font-medium text-xs uppercase tracking-[0.2em] mb-3">Prix</h3>
                      <div className="space-y-2">
                        {['Moins de 30 000 FCFA', '30 000 - 65 000 FCFA', '65 000 - 130 000 FCFA', 'Plus de 130 000 FCFA'].map((price) => (
                          <label key={price} className="flex items-center gap-3 cursor-pointer hover:text-gold transition-colors">
                            <div className="w-5 h-5 border border-charcoal flex items-center justify-center"></div>
                            <span className="text-sm text-charcoal">{price}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Options rapides */}
            <div className="flex items-center gap-4 md:gap-6 justify-center flex-1 flex-wrap">
              {['Tous', ...uniqueCategories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`text-xs md:text-sm transition-colors ${
                    activeFilter === cat
                      ? 'text-charcoal border-b-2 border-charcoal pb-1'
                      : 'text-text-light hover:text-charcoal'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs md:text-sm text-charcoal hover:text-gold px-4 py-2 bg-white border-2 border-charcoal hover:border-gold rounded cursor-pointer transition-colors w-full sm:w-auto"
            >
              <option value="default">Trier par</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="new">Nouveautés</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grille de produits */}
      <section className="py-12 md:py-16 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gold" size={40} />
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-20 text-text-light">
              <p className="text-lg">Aucun produit dans cette catégorie</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
                {displayProducts.map(product => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    onAddToCart={handleAddToCart}
                    onNavigate={onNavigate}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite(Number(product.id))}
                  />
                ))}
              </div>
              
              <div className="text-center mt-4 text-sm text-text-light">
                {displayProducts.length} produit{displayProducts.length > 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
