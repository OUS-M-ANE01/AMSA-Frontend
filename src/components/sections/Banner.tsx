interface BannerProps {
  onNavigate?: (page: string) => void;
}

export default function Banner({ onNavigate }: BannerProps = {}) {
  return (
    <div className="relative overflow-hidden min-h-[400px] md:min-h-[530px] flex items-center">
      <img 
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&h=600&fit=crop" 
        alt="Collection bijoux"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/75 via-charcoal/40 to-transparent" />
      
      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-12 md:py-20 max-w-[520px]">
        <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold-light font-medium mb-3">
          Collection Exclusive
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[clamp(32px,4vw,52px)] font-light leading-tight text-white mb-4">
          Bijoux <em className="italic text-gold-light">Fins</em><br />
          Faits à la Main
        </h2>
        <p className="text-sm md:text-[15px] text-cream leading-relaxed font-light mb-7 md:mb-9">
          Chaque pièce est unique, réalisée par des artisans passionnés avec des matériaux précieux soigneusement choisis.
        </p>
        <button 
          onClick={() => onNavigate?.('bijoux')}
          className="bg-charcoal text-warm-white px-6 md:px-8 py-3 md:py-3.5 rounded-sm text-xs md:text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-gold hover:-translate-y-0.5 transition-all"
        >
          Découvrir les bijoux
        </button>
      </div>
    </div>
  );
}
