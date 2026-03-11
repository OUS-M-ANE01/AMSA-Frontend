import ProductCard from '../components/ProductCard';
import { featuredProducts, jewelryProducts } from '../data/products';

interface FavorisProps {
  onNavigate: (page: string) => void;
  favoriteItems: number[];
  onToggleFavorite: (productId: string | number) => void;
  onAddToCart?: (productId: string | number) => void;
}

export default function Favoris({ onNavigate, favoriteItems, onToggleFavorite, onAddToCart }: FavorisProps) {
  // Récupérer les produits favoris
  const allProducts = [...featuredProducts, ...jewelryProducts];
  const favoriteProducts = allProducts.filter(product => favoriteItems.includes(Number(product.id)));

  return (
    <div className="min-h-screen pt-18">
      <div className="relative h-[40vh] flex flex-col items-center justify-center bg-cream">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-charcoal">
          Mes <em className="italic text-gold">Favoris</em>
        </h1>
        <p className="mt-4 text-text-light text-base md:text-lg">
          {favoriteProducts.length > 0 
            ? `${favoriteProducts.length} article${favoriteProducts.length > 1 ? 's' : ''} dans vos favoris`
            : 'Retrouvez tous vos articles préférés'}
        </p>
      </div>
      
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-7xl mx-auto">
          {favoriteProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {favoriteProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onNavigate={onNavigate}
                  onToggleFavorite={onToggleFavorite}
                  onAddToCart={onAddToCart}
                  isFavorite={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-text-light opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-charcoal mb-3">Votre liste de favoris est vide</h3>
              <p className="text-text-light mb-8">Parcourez nos collections et ajoutez vos coups de cœur !</p>
              <button 
                onClick={() => onNavigate('collections')}
                className="px-8 py-3 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors"
              >
                Découvrir nos collections
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
