import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

interface HeroProps {
  onNavigate?: (page: string) => void;
}

const DEFAULT_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=560&fit=crop', label: 'Robes' },
  { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&h=680&fit=crop', label: 'Collection' },
  { url: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=560&fit=crop', label: 'Bijoux' },
];

export default function Hero({ onNavigate }: HeroProps = {}) {
  const [c, setC] = useState<any>({});

  useEffect(() => {
    adminAPI.getContentBySection('hero')
      .then(res => {
        const data = res.data?.data?.content || res.data?.data;
        if (data && Object.keys(data).length > 0) setC(data);
      })
      .catch(() => {});
  }, []);

  const titleBefore = c.titleBefore || 'Portez Votre';
  const titleHighlight = c.titleHighlight || 'Élégance';
  const titleAfter = c.titleAfter || 'au quotidien';
  const description = c.description || 'Vêtements et bijoux soigneusement sélectionnés pour la femme moderne qui affirme son style avec grâce et assurance.';
  const btn1Text = c.button1Text || 'Découvrez nos produits';
  const btn1Link = c.button1Link || 'collections';
  const btn2Text = c.button2Text || 'Voir les bijoux';
  const btn2Link = c.button2Link || 'bijoux';
  const images: { url: string; label: string }[] =
    Array.isArray(c.images) && c.images.length === 3 ? c.images : DEFAULT_IMAGES;

  return (
    <section className="pt-32 pb-2 md:min-h-screen md:pt-20 md:pb-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cream px-4">

      <h1 className="font-serif text-5xl md:text-6xl lg:text-[clamp(52px,8vw,92px)] font-light leading-[1.15] md:leading-[1.05] tracking-tight text-charcoal animate-[fadeUp_0.7s_0.1s_ease_both]">
        {titleBefore} <em className="italic text-gold">{titleHighlight}</em><br/>{titleAfter}
      </h1>

      <p className="max-w-[500px] text-sm md:text-[15px] leading-relaxed text-text-light mt-4 md:mt-5 font-light animate-[fadeUp_0.7s_0.2s_ease_both] px-2">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mt-4 md:mt-6 animate-[fadeUp_0.7s_0.3s_ease_both] w-full sm:w-auto px-2">
        <button
          onClick={() => onNavigate?.(btn1Link)}
          className="bg-charcoal text-warm-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-sm text-[11px] md:text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-gold hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          {btn1Text}
        </button>
        <button
          onClick={() => onNavigate?.(btn2Link)}
          className="bg-transparent text-charcoal px-5 md:px-8 py-2.5 border-[1.5px] border-charcoal rounded-sm text-[11px] md:text-[13px] font-medium tracking-[0.1em] uppercase hover:border-gold hover:text-gold hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          {btn2Text}
        </button>
      </div>

      <div className="flex flex-row gap-2 sm:gap-4 mt-8 md:mt-14 items-end animate-[fadeUp_0.8s_0.4s_ease_both] relative">
        <div className="relative overflow-hidden rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-[100px] sm:w-[220px] md:w-[250px] h-[140px] sm:h-[300px] md:h-[320px] sm:-rotate-2 hover:-translate-y-2 hover:rotate-[-2deg] transition-all duration-400 group">
          <img
            src={images[0].url}
            alt="Mode femme"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-3.5 bg-black backdrop-blur-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] md:text-[11px] font-medium tracking-wider text-cream">
            {images[0].label}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-[120px] sm:w-[260px] md:w-[300px] h-[160px] sm:h-[350px] md:h-[380px] z-10 hover:-translate-y-2 transition-all duration-400 group">
          <img
            src={images[1].url}
            alt="Mode élégante"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-3.5 bg-black backdrop-blur-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] md:text-[11px] font-medium tracking-wider text-cream">
            {images[1].label}
          </div>
          <div className="absolute top-2 sm:top-5 -right-1 sm:-right-2.5 bg-gold text-warm-white px-2 sm:px-3 md:px-4 py-1 sm:py-2 md:py-2.5 rounded text-[7px] sm:text-[10px] md:text-[11px] font-semibold tracking-wider text-center leading-tight">
            100%<span className="block text-[9px] sm:text-base md:text-lg font-light">Satisfait</span>Garanti
          </div>
        </div>

        <div className="relative overflow-hidden rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-[100px] sm:w-[220px] md:w-[250px] h-[140px] sm:h-[300px] md:h-[320px] sm:rotate-2 hover:-translate-y-2 hover:rotate-2 transition-all duration-400 group">
          <img
            src={images[2].url}
            alt="Bijoux"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-3.5 bg-black backdrop-blur-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] md:text-[11px] font-medium tracking-wider text-cream">
            {images[2].label}
          </div>
        </div>
      </div>
    </section>
  );
}
