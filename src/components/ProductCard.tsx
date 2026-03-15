import toast from 'react-hot-toast';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type{ Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string | number) => void;
  onToggleFavorite?: (productId: string | number) => void;
  onNavigate?: (page: string) => void;
  isFavorite?: boolean;
}

export default function ProductCard({ 
  product, 
  onAddToCart,
  onToggleFavorite,
  onNavigate,
  isFavorite = false
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast(`${product.name} ajouté au panier !`, { icon: "🛍️", duration: 3000, style: { background: "#3A3A3A", color: "#fff" } });
    if (onAddToCart) {
      onAddToCart(product._id ?? product.id);
    }
  };

  const handleToggleFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product._id ?? product.id);
    } else {
      toast(`${product.name} ajouté aux favoris !`, { icon: "❤️", duration: 3000, style: { background: "#3A3A3A", color: "#fff" } });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(`product-${product._id ?? product.id}`);
    }
  };

  const handleProductClick = () => {
    if (onNavigate) {
      onNavigate(`product-${product._id ?? product.id}`);
    }
  };

  const getBadgeStyles = (badge?: string) => {
    if (badge === 'new') return 'bg-gold text-warm-white';
    if (badge === 'sale') return 'bg-charcoal text-warm-white';
    if (badge === 'bestseller') return 'bg-charcoal text-warm-white';
    return '';
  };

  const getBadgeText = (badge?: string) => {
    if (badge === 'new') return 'Nouveau';
    if (badge === 'sale') return '-20%';
    if (badge === 'bestseller') return 'Bestseller';
    return '';
  };

  return (
    <div onClick={handleProductClick} className="relative cursor-pointer group">
      <div className="relative overflow-hidden rounded aspect-[3/4] bg-[#EEE9E3]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
        />
        
        {/* Overlay sombre au survol */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        
        {product.badge && (
          <span className={`absolute top-3.5 left-3.5 text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-sm ${getBadgeStyles(product.badge)} z-10`}>
            {getBadgeText(product.badge)}
          </span>
        )}

        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={handleToggleFavorites}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all ${
              isFavorite 
                ? 'bg-gold text-white' 
                : 'bg-warm-white text-charcoal hover:bg-gold hover:text-white'
            }`}
            aria-label="Favoris"
          >
            <Heart size={16} className={isFavorite ? 'fill-white' : ''} />
          </button>
          <button 
            onClick={handleQuickView}
            className="bg-warm-white w-10 h-10 rounded-full flex items-center justify-center text-charcoal shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-gold hover:text-white transition-all" 
            aria-label="Vue rapide"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="bg-warm-white w-10 h-10 rounded-full flex items-center justify-center text-charcoal shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-gold hover:text-white transition-all" 
            aria-label="Panier"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>

      <div className="pt-4">
        <div className="text-[10px] tracking-[0.18em] uppercase text-mink mb-1">
          {product.brand}
        </div>
        <div className="font-serif text-[19px] font-normal text-charcoal leading-tight">
          {product.name}
        </div>
        <div className="flex items-center gap-2.5 mt-2">
          <span className="text-[15px] font-medium text-charcoal">
            {product.price.toLocaleString()} FCFA
          </span>
          {product.oldPrice && (
            <span className="text-[13px] text-text-light line-through">
              {product.oldPrice.toLocaleString()} FCFA
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
