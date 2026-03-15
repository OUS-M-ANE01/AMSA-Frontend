import { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';
import { productsAPI, adminAPI } from '../../services/api';
import { adaptApiProduct } from '../../hooks/usePublicProducts';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import { jewelryProducts } from '../../data/products';
import type { Product } from '../../types';

interface JewelryProductsProps {
  onNavigate: (page: string) => void;
  onAddToCart?: (productId: string | number) => void;
  onToggleFavorite?: (productId: string | number) => void;
  favoriteItems?: number[];
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function JewelryProducts({ onNavigate }: JewelryProductsProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    Promise.all([
      productsAPI.getAll({ limit: 100 }),
      adminAPI.getContentBySection('featured_jewelry').catch(() => null),
    ])
      .then(([prodsRes, contentRes]) => {
        const data = prodsRes.data?.data || prodsRes.data?.products || prodsRes.data || [];
        const adapted = Array.isArray(data) ? data.map(adaptApiProduct) : [];
        const pinnedIds: string[] = contentRes?.data?.data?.content?.pinnedIds || [];
        if (pinnedIds.length > 0 && adapted.length > 0) {
          const pinned = pinnedIds
            .map(id => adapted.find(p => String(p._id || p.id) === id))
            .filter(Boolean) as Product[];
          setAllProducts(pinned.length > 0 ? pinned : adapted);
        } else {
          setAllProducts(adapted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const products = useMemo(() => {
    if (allProducts.length > 0) return allProducts.slice(0, 4);
    return jewelryProducts;
  }, [allProducts]);

  const handleAddToCart = (productId: string | number) => {
    const product = products.find(p => String(p._id || p.id) === String(productId));
    if (product) addToCart(product);
  };

  return (
    <section id="bijoux" className="px-4 md:px-8 lg:px-14 py-16 md:py-24">
      <div>
        <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-3">
          Notre Sélection
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[clamp(32px,4vw,52px)] font-light leading-tight text-charcoal">
            Bijoux <em className="italic text-gold">Signature</em>
          </h2>
          <button
            onClick={() => onNavigate('bijoux')}
            className="inline-flex items-center gap-2 text-xs md:text-[13px] tracking-[0.1em] uppercase text-charcoal font-medium border-b border-charcoal pb-0.5 hover:text-gold hover:border-gold transition-all"
          >
            Voir tout <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#E8E0D5] aspect-[3/4] rounded-md mb-3" />
              <div className="h-4 bg-[#E8E0D5] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#E8E0D5] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {products.map(product => (
            <ProductCard
              key={String(product._id || product.id)}
              product={product}
              onNavigate={onNavigate}
              onAddToCart={handleAddToCart}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite(product._id || product.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
