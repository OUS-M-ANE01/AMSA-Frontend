import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';
import { jewelryProducts } from '../../data/products';

interface JewelryProductsProps {
  onNavigate: (page: string) => void;
  onAddToCart?: (productId: string | number) => void;
  onToggleFavorite?: (productId: string | number) => void;
  favoriteItems?: number[];
}

export default function JewelryProducts({ 
  onNavigate, 
  onAddToCart, 
  onToggleFavorite, 
  favoriteItems = [] 
}: JewelryProductsProps) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
        {jewelryProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
            onNavigate={onNavigate}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            isFavorite={favoriteItems.includes(Number(product.id))}
          />
        ))}
      </div>
    </section>
  );
}
