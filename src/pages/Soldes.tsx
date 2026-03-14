import { useEffect, useMemo, useState } from 'react';
import { Tag, Loader2, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { usePublicProducts } from '../hooks/usePublicProducts';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';

interface SoldesProps {
  onNavigate: (page: string) => void;
}

export default function Soldes({ onNavigate }: SoldesProps) {
  const { products: allProducts, loading, fetchProducts } = usePublicProducts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'discount'>('discount');

  useEffect(() => {
    fetchProducts({ limit: 100 });
  }, [fetchProducts]);

  // Filtrer uniquement les produits en soldes
  const saleProducts = useMemo(() => {
    const filtered = allProducts.filter(p => p.badge === 'sale' || (p.oldPrice && p.oldPrice > p.price));
    return filtered.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'discount') {
        const discountA = a.oldPrice ? Math.round((1 - a.price / a.oldPrice) * 100) : 0;
        const discountB = b.oldPrice ? Math.round((1 - b.price / b.oldPrice) * 100) : 0;
        return discountB - discountA;
      }
      return 0;
    });
  }, [allProducts, sortBy]);

  return (
    <div className="min-h-screen pt-18">
      {/* Hero Banner */}
      <div className="relative h-[45vh] flex flex-col items-center justify-center overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1600&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag className="text-gold" size={32} />
            <span className="text-gold text-sm font-medium tracking-[0.2em] uppercase">Offres Limitées</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-white">
            Nos <em className="italic text-gold">Soldes</em>
          </h1>
          <p className="mt-4 text-white/80 max-w-xl mx-auto text-base md:text-lg">
            Profitez de réductions exceptionnelles sur une sélection de pièces soigneusement choisies
          </p>
          {!loading && saleProducts.length > 0 && (
            <p className="mt-3 text-gold font-medium">
              {saleProducts.length} article{saleProducts.length > 1 ? 's' : ''} en promotion
            </p>
          )}
        </div>
      </div>

      {/* Contenu */}
      <section className="py-12 md:py-16 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-7xl mx-auto">

          {/* Barre de tri */}
          {!loading && saleProducts.length > 0 && (
            <div className="flex justify-end mb-8">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-border focus:border-gold focus:outline-none text-sm bg-white"
              >
                <option value="discount">Meilleures réductions</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="default">Par défaut</option>
              </select>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="animate-spin text-gold" size={48} />
              <p className="text-text-light">Chargement des offres...</p>
            </div>
          )}

          {/* Aucun article */}
          {!loading && saleProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-24 h-24 rounded-full bg-cream flex items-center justify-center mb-6">
                <ShoppingBag className="text-gold/50" size={40} />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-light text-charcoal mb-3">
                Aucune promotion <em className="italic text-gold">en cours</em>
              </h2>
              <p className="text-text-light max-w-sm mb-8">
                Il n'y a pas d'articles en soldes pour le moment. Revenez bientôt pour profiter de nos prochaines offres !
              </p>
              <button
                onClick={() => onNavigate('accueil')}
                className="px-8 py-3 bg-charcoal text-white text-sm font-medium tracking-[0.1em] uppercase hover:bg-gold transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          )}

          {/* Grille produits */}
          {!loading && saleProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map((product) => {
                const discount = product.oldPrice
                  ? Math.round((1 - product.price / product.oldPrice) * 100)
                  : null;
                return (
                  <div key={product._id || product.id} className="relative">
                    {discount !== null && discount > 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                      </div>
                    )}
                    <ProductCard
                      product={product}
                      onNavigate={onNavigate}
                      isFavorite={isFavorite(String(product._id || product.id))}
                      onToggleFavorite={() => toggleFavorite(String(product._id || product.id))}
                      onAddToCart={() => addToCart(product)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
