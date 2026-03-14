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
    <section id="categories" className="px-4 md:px-8 lg:px-14 py-12 md:py-16 bg-cream">
      <div>
        <div className="text-center mb-6 md:mb-8">
          <div className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium mb-2">
            Nos univers
          </div>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-[clamp(24px,3vw,36px)] font-light leading-tight text-charcoal">
            Explorez nos catégories
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" style={{ gridAutoRows: '180px' }}>
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
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 bg-gold rounded-full">
                <ArrowRight size={18} className="text-charcoal" />
              </div>
            </div>
            
            {/* Texte en bas */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-white">
              <h3 className="font-serif text-base md:text-[20px] font-normal mb-1 tracking-wide">
                {cat.name}
              </h3>
              <span className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase opacity-80">
                {cat.count} articles
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Bouton Voir tout centré en dessous */}
      <div className="text-center mt-8 md:mt-10">
        <button
          onClick={() => onNavigate('vetements')}
          className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-[13px] tracking-[0.15em] uppercase font-medium text-charcoal border border-charcoal hover:text-gold hover:border-gold transition-colors duration-200"
        >
          Voir tout
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Filtres & Trier par */}
      <div className="flex flex-row items-stretch justify-between gap-2 w-full mt-8 mb-6">
        <div className="flex-1 flex justify-start">
          <button className="px-4 py-2 border border-charcoal rounded font-medium text-charcoal bg-white hover:bg-gold hover:text-white transition-colors w-full max-w-[180px]">
            <span className="flex items-center gap-2">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
              Filtres
            </span>
          </button>
        </div>
        <div className="flex-1 flex justify-end">
          <select className="px-4 py-2 border border-charcoal rounded font-medium text-charcoal bg-white hover:bg-gold hover:text-white transition-colors w-full max-w-[180px]">
            <option value="default">Trier par</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="new">Nouveautés</option>
            <option>Plus populaires</option>
          </select>
        </div>
      </div>
    </section>
  );
}
