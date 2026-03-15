import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { categories as staticCategories } from '../../data/products';
import { usePublicProducts } from '../../hooks/usePublicProducts';
import { useFilterStore } from '../../stores/filterStore';

// Mots-clés pour détecter les catégories bijoux
const JEWELRY_KEYWORDS = ['collier', 'bijou', 'bague', 'bracelet', 'boucle', 'parure', 'pendentif', 'earring', 'necklace', 'ring', 'jewelry'];

function isJewelryCategory(name: string): boolean {
  const lower = name.toLowerCase();
  return JEWELRY_KEYWORDS.some(kw => lower.includes(kw));
}

interface CategoriesProps {
  onNavigate: (page: string) => void;
}

export default function Categories({ onNavigate }: CategoriesProps) {
  const { categories: apiCategories, fetchCategories } = usePublicProducts();
  const { setPendingCategory } = useFilterStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Utiliser les catégories API si disponibles, sinon les statiques
  const displayCategories = apiCategories.length > 0
    ? apiCategories.slice(0, 5)
    : staticCategories;

  const handleCategoryClick = (cat: { id: string; name: string }) => {
    setPendingCategory(cat.name);
    const page = isJewelryCategory(cat.name) ? 'bijoux' : 'vetements';
    onNavigate(page);
  };

  return (
    <section id="categories" className="px-4 md:px-8 lg:px-14 py-6 md:py-12 lg:py-16 bg-cream">
      <div>
        <div className="text-center mb-4 md:mb-8">
          <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium mb-2">
            Nos univers
          </div>
          <h2 className="font-serif text-xl md:text-3xl lg:text-[clamp(24px,3vw,36px)] font-light leading-tight text-charcoal">
            Explorez nos catégories
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4" style={{ gridAutoRows: '180px' }}>
        {displayCategories.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick({ id: cat.id, name: cat.name })}
            className={`relative overflow-hidden rounded cursor-pointer group ${
              index === 0 ? 'row-span-2' : ''
            }`}
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300"></div>

            {/* Indicateur en haut à droite */}
            <div className="absolute top-3 right-3 md:top-4 md:right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gold rounded-full">
                <ArrowRight size={16} className="text-charcoal md:w-[18px] md:h-[18px]" />
              </div>
            </div>

            {/* Texte en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-2 md:p-5 text-white">
              <h3 className="font-serif text-sm md:text-[20px] font-normal mb-0.5 md:mb-1 tracking-wide">
                {cat.name}
              </h3>
              <span className="text-[8px] md:text-[10px] tracking-[0.15em] uppercase opacity-80">
                {cat.count} articles
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Bouton Voir tout centré en dessous */}
      <div className="text-center mt-4 md:mt-8">
        <button
          onClick={() => onNavigate('vetements')}
          className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 text-[11px] md:text-[13px] tracking-[0.15em] uppercase font-medium text-charcoal border border-charcoal hover:text-gold hover:border-gold transition-colors duration-200"
        >
          Voir tout
          <ArrowRight size={14} className="md:w-4 md:h-4" />
        </button>
      </div>
    </section>
  );
}
