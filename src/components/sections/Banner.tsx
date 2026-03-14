import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface BannerProps {
  onNavigate?: (page: string) => void;
}

export default function Banner({ onNavigate }: BannerProps = {}) {
  const [c, setC] = useState<any>({});

  useEffect(() => {
    adminAPI.getContentBySection('banner')
      .then(res => {
        const data = res.data?.data?.content || res.data?.data;
        if (data && Object.keys(data).length > 0) setC(data);
      })
      .catch(() => {});
  }, []);

  const bgImage = c.backgroundImage || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=600&fit=crop';
  const label = c.label || 'Collection Exclusive';
  const title = c.title || '';
  const subtitle = c.subtitle || '';
  const description = c.description || 'Chaque pièce est unique, réalisée par des artisans passionnés avec des matériaux précieux soigneusement choisis.';
  const btnText = c.buttonText || 'Découvrir les bijoux';
  const btnLink = c.buttonLink || 'bijoux';

  return (
    <div className="relative overflow-hidden min-h-[400px] md:min-h-[530px] flex items-center">
      <img
        src={bgImage}
        alt="Collection bijoux"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/40 to-transparent" />
      
      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-[520px]">
        <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold-light font-medium mb-3">
          {label}
        </div>
        {title || subtitle ? (
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[clamp(32px,4vw,52px)] font-light leading-tight text-white mb-4">
            {title}{title && subtitle && ' '}<em className="italic text-gold-light">{subtitle}</em>
          </h2>
        ) : (
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[clamp(32px,4vw,52px)] font-light leading-tight text-white mb-4">
            Bijoux <em className="italic text-gold-light">Fins</em><br />
            Faits à la Main
          </h2>
        )}
        <p className="text-sm md:text-[15px] text-cream leading-relaxed font-light mb-7 md:mb-9">
          {description}
        </p>
        <button
          onClick={() => onNavigate?.(btnLink)}
          className="bg-charcoal text-warm-white px-6 md:px-8 py-3 md:py-3.5 rounded-sm text-xs md:text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-gold hover:-translate-y-0.5 transition-all"
        >
          {btnText}
        </button>
      </div>
    </div>
  );
}
