import { ArrowLeft, Heart, ShoppingBag, Star, Loader2 } from 'lucide-react';
import { featuredProducts, jewelryProducts } from '../data/products';
import { useState, useEffect } from 'react';
import { usePublicProducts } from '../hooks/usePublicProducts';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';

interface ProductDetailProps {
  productId: string | number;
  onNavigate: (page: string) => void;
  onAddToCart?: (productId: string | number) => void;
  onToggleFavorite?: (productId: string | number) => void;
  isFavorite?: boolean;
}

export default function ProductDetail({ 
  productId, 
  onNavigate,
}: ProductDetailProps) {
  const allStaticProducts = [...featuredProducts, ...jewelryProducts];
  const staticProduct = allStaticProducts.find(
    p => String(p.id) === String(productId) || p._id === String(productId)
  );

  const [apiProduct, setApiProduct] = useState<(typeof staticProduct) | null>(null);
  const [loading, setLoading] = useState(false);
  const { fetchProductById } = usePublicProducts();
  const { addToCart } = useCart();
  const { isFavorite: isFavHook, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!staticProduct) {
      setLoading(true);
      fetchProductById(String(productId)).then(p => {
        setApiProduct(p);
        setLoading(false);
      });
    }
  }, [productId, staticProduct, fetchProductById]);

  const product = staticProduct || apiProduct;
  const isFav = product ? isFavHook(product._id || product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    if (!product) return;
    toggleFavorite(product._id || product.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-18 flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-18 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-charcoal mb-4">Produit non trouvé</h1>
          <button 
            onClick={() => onNavigate('accueil')}
            className="px-6 py-3 bg-charcoal text-white hover:bg-gold transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Produits similaires (uniquement depuis les données statiques)
  const allProducts = [...featuredProducts, ...jewelryProducts];
  const similarProducts = product
    ? allProducts.filter(p => p.category === product.category && String(p.id) !== String(productId)).slice(0, 4)
    : [];

  return (
    <div className="min-h-screen pt-18">
      {/* Bouton retour */}
      <div className="px-4 md:px-8 lg:px-14 py-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-charcoal hover:text-gold transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm uppercase tracking-wider">Retour</span>
        </button>
      </div>

      {/* Détails du produit */}
      <section className="px-4 md:px-8 lg:px-14 py-8 md:py-12 bg-warm-white">
        <div className="max-w-7xl mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <div className="relative">
              <img 
                src={product.image}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover rounded"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold tracking-wider rounded-sm ${
                  product.badge === 'new' ? 'bg-gold text-white' :
                  product.badge === 'sale' ? 'bg-red-600 text-white' :
                  'bg-charcoal text-white'
                }`}>
                  {product.badge === 'new' ? 'NOUVEAU' :
                   product.badge === 'sale' ? '-20%' :
                   'BESTSELLER'}
                </span>
              )}
            </div>

            {/* Informations */}
            <div className="flex flex-col">
              <div className="text-xs tracking-[0.2em] uppercase text-gold mb-2">
                {product.brand}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-charcoal mb-4">
                {product.name}
              </h1>

              {/* Prix */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-medium text-charcoal">
                  {product.price.toLocaleString()} FCFA
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-text-light line-through">
                    {product.oldPrice.toLocaleString()} FCFA
                  </span>
                )}
              </div>

              {/* Note */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    className="fill-gold text-gold"
                  />
                ))}
                <span className="text-sm text-text-light ml-2">(127 avis)</span>
              </div>

              {/* Description */}
              <p className="text-text-light leading-relaxed mb-8">
                {product.description || `Découvrez ${product.name}, une pièce élégante et intemporelle qui saura sublimer votre style. Confectionnée avec des matériaux de qualité supérieure, cette création allie confort et raffinement pour vous accompagner en toute occasion.`}
              </p>

              {/* Informations produit */}
              <div className="bg-cream p-6 mb-8 rounded">
                <h3 className="font-medium text-charcoal mb-4">Détails du produit</h3>
                <ul className="space-y-2 text-sm text-text-light">
                  <li>✦ Composition : Matériaux premium</li>
                  <li>✦ Entretien : Suivre les instructions sur l'étiquette</li>
                  <li>✦ Origine : Fabriqué en France</li>
                  <li>✦ Livraison : Gratuite dès 65 000 FCFA d'achat</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-white py-4 px-6 hover:bg-gold hover:text-charcoal transition-colors"
                >
                  <ShoppingBag size={20} />
                  <span className="font-medium uppercase tracking-wider text-sm">
                    Ajouter au panier
                  </span>
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center gap-2 py-4 px-6 border-2 transition-colors ${
                    isFav
                      ? 'border-gold bg-gold text-white' 
                      : 'border-charcoal text-charcoal hover:border-gold hover:text-gold'
                  }`}
                >
                  <Heart 
                    size={20} 
                    className={isFav ? 'fill-white' : ''}
                  />
                  <span className="font-medium uppercase tracking-wider text-sm">
                    {isFav ? 'Retiré' : 'Favoris'}
                  </span>
                </button>
              </div>

              {/* Informations de livraison */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-charcoal mb-2">🚚 Livraison</h4>
                    <p className="text-text-light">Gratuite dès 65 000 FCFA<br/>Expédition sous 24-48h</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-charcoal mb-2">↩️ Retours</h4>
                    <p className="text-text-light">Retours gratuits sous 30 jours<br/>Satisfait ou remboursé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produits similaires */}
      {similarProducts.length > 0 && (
        <section className="px-4 md:px-8 lg:px-14 py-16 md:py-20 bg-cream">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-8 md:mb-12 text-center">
              Vous pourriez aussi <em className="italic text-gold">aimer</em>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {similarProducts.map(similarProduct => (
                <div 
                  key={similarProduct.id}
                  onClick={() => onNavigate(`product-${similarProduct._id ?? similarProduct.id}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative overflow-hidden rounded aspect-[3/4] bg-warm-white mb-3">
                    <img 
                      src={similarProduct.image}
                      alt={similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm text-text-light mb-1">{similarProduct.brand}</p>
                  <h3 className="text-charcoal mb-2">{similarProduct.name}</h3>
                  <p className="text-charcoal font-medium">{similarProduct.price.toLocaleString()} FCFA</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
