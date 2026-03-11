interface CollectionsProps {
  onNavigate: (page: string) => void;
  onAddToCart?: (productId: string | number) => void;
}

import ProductCard from '../components/ProductCard';
import { useEffect } from 'react';
import { usePublicProducts } from '../hooks/usePublicProducts';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { Loader2 } from 'lucide-react';

export default function Collections({ onNavigate, onAddToCart }: CollectionsProps) {
  const { products, loading, fetchProducts } = usePublicProducts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchProducts({ limit: 10 });
  }, [fetchProducts]);

  const handleAddToCart = (productId: string | number) => {
    const product = products.find(p => (p._id || String(p.id)) === String(productId));
    if (product) addToCart(product);
    else if (onAddToCart) onAddToCart(productId);
  };
  return (
    <div className="min-h-screen pt-18">
      <div className="relative h-[50vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Image de fond */}
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80" 
          alt="Collections"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
        
        {/* Contenu */}
        <div className="relative z-10 text-center px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-white">
            Nos <em className="italic text-gold">Collections</em>
          </h1>
          <p className="mt-3 md:mt-4 text-white/90 max-w-2xl mx-auto text-base md:text-lg">Découvrez nos collections saisonnières et nos éditions limitées</p>
        </div>
      </div>
      
      {/* Collection Printemps-Été */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-gold">Nouvelle Collection</span>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-charcoal mt-3 mb-4 md:mb-6">
                Printemps - <em className="italic text-gold">Été 2026</em>
              </h2>
              <p className="text-text-light mb-6 leading-relaxed">
                Découvrez notre collection printemps-été où légèreté et élégance se rencontrent. 
                Des robes fluides aux couleurs pastel, des bijoux délicats inspirés de la nature, 
                pour accompagner vos journées ensoleillées avec raffinement.
              </p>
              <ul className="space-y-2 text-text-light mb-8">
                <li>✦ Tissus légers et respirants</li>
                <li>✦ Couleurs douces et lumineuses</li>
                <li>✦ Pièces intemporelles et versatiles</li>
              </ul>
              <button 
                onClick={() => onNavigate('vetements')}
                className="px-8 py-3 bg-charcoal text-white hover:bg-gold transition-colors duration-300"
              >
                Découvrir la collection
              </button>
            </div>
            <div className="relative aspect-[3/4]">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" 
                alt="Collection Printemps-Été" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collection Automne-Hiver */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative aspect-[3/4]">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" 
                alt="Collection Automne-Hiver" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-sm tracking-[0.2em] uppercase text-gold">Collection Signature</span>
              <h2 className="font-serif text-5xl font-light text-charcoal mt-3 mb-6">
                Automne - <em className="italic text-gold">Hiver 2026</em>
              </h2>
              <p className="text-text-light mb-6 leading-relaxed">
                L'élégance s'habille de chaleur avec notre collection automne-hiver. 
                Manteaux structurés, robes en velours, bijoux précieux : des pièces qui subliment 
                la saison froide avec sophistication et caractère.
              </p>
              <ul className="space-y-2 text-text-light mb-8">
                <li>✦ Matières nobles et chaleureuses</li>
                <li>✦ Coupes structurées et féminines</li>
                <li>✦ Détails raffinés et luxueux</li>
              </ul>
              <button 
                onClick={() => onNavigate('vetements')}
                className="px-8 py-3 bg-charcoal text-white hover:bg-gold transition-colors duration-300"
              >
                Découvrir la collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Édition Limitée */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-charcoal text-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-gold">Exclusivité</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mt-3 mb-4 md:mb-6">
            Édition <em className="italic text-gold">Limitée</em>
          </h2>
          <p className="text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Des pièces uniques, conçues en quantité limitée pour les amatrices d'exclusivité. 
            Chaque création est numérotée et certifiée, alliant savoir-faire artisanal et design contemporain.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" 
                alt="Pièce Limitée 1" 
                className="w-full aspect-square object-cover mb-4"
              />
              <p className="text-sm text-white/70">Collier Émeraude • 3/10</p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80" 
                alt="Pièce Limitée 2" 
                className="w-full aspect-square object-cover mb-4"
              />
              <p className="text-sm text-white/70">Robe Velours Noir • 5/15</p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" 
                alt="Pièce Limitée 3" 
                className="w-full aspect-square object-cover mb-4"
              />
              <p className="text-sm text-white/70">Bague Diamant • 2/8</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos produits */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-gold">Nos Produits</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-charcoal mt-3">
              Toutes nos <em className="italic text-gold">Pièces</em>
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-gold" size={40} />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-text-light">
              <p className="text-lg">Aucun produit disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
              {products.map(product => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onNavigate={onNavigate}
                  onToggleFavorite={(id) => toggleFavorite(Number(id) || 0)}
                  isFavorite={isFavorite(Number(product.id))}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
