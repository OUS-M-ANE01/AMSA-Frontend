interface HeroProps {
  onNavigate?: (page: string) => void;
}

export default function Hero({ onNavigate }: HeroProps = {}) {
  return (
    <section className="min-h-screen pt-24 md:pt-20 flex flex-col items-center justify-center text-center relative overflow-hidden bg-cream px-4">

      <h1 className="font-serif text-4xl md:text-6xl lg:text-[clamp(52px,8vw,92px)] font-light leading-[1.15] md:leading-[1.05] tracking-tight text-charcoal animate-[fadeUp_0.7s_0.1s_ease_both]">
        Portez Votre <em className="italic text-gold">Élégance </em><br className="hidden sm:block" />au quotidien
      </h1>

      <p className="max-w-[500px] text-sm md:text-[15px] leading-relaxed text-text-light mt-5 font-light animate-[fadeUp_0.7s_0.2s_ease_both] px-4">
        Vêtements et bijoux soigneusement sélectionnés pour la femme moderne qui affirme son style avec grâce et assurance.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 animate-[fadeUp_0.7s_0.3s_ease_both] w-full sm:w-auto px-4">
        <button 
          onClick={() => onNavigate?.('collections')}
          className="bg-charcoal text-warm-white px-6 md:px-8 py-3 md:py-3.5 rounded-sm text-xs md:text-[13px] font-medium tracking-[0.1em] uppercase hover:bg-gold hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          Découvrir la collection
        </button>
        <button 
          onClick={() => onNavigate?.('bijoux')}
          className="bg-transparent text-charcoal px-6 md:px-8 py-3 border-[1.5px] border-charcoal rounded-sm text-xs md:text-[13px] font-medium tracking-[0.1em] uppercase hover:border-gold hover:text-gold hover:-translate-y-0.5 transition-all whitespace-nowrap"
        >
          Voir les bijoux
        </button>
      </div>

      <div className="flex flex-row gap-2 sm:gap-4 mt-10 md:mt-14 items-end animate-[fadeUp_0.8s_0.4s_ease_both] relative">
        <div className="relative overflow-hidden rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-[100px] sm:w-[220px] md:w-[250px] h-[140px] sm:h-[300px] md:h-[320px] sm:-rotate-2 hover:-translate-y-2 hover:rotate-[-2deg] transition-all duration-400 group">
          <img 
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=560&fit=crop" 
            alt="Mode femme"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-3.5 bg-black backdrop-blur-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] md:text-[11px] font-medium tracking-wider text-cream">
            Robes
          </div>
        </div>

        <div className="relative overflow-hidden rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-[120px] sm:w-[260px] md:w-[300px] h-[160px] sm:h-[350px] md:h-[380px] z-10 hover:-translate-y-2 transition-all duration-400 group">
          <img 
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&h=680&fit=crop" 
            alt="Mode élégante"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-3.5 bg-black backdrop-blur-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] md:text-[11px] font-medium tracking-wider text-cream">
            Collection
          </div>
          <div className="absolute top-3 sm:top-5 -right-1.5 sm:-right-2.5 bg-gold text-warm-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded text-[8px] sm:text-[10px] md:text-[11px] font-semibold tracking-wider text-center leading-tight">
            100%<span className="block text-xs sm:text-base md:text-lg font-light">Satisfait</span>Garanti
          </div>
        </div>

        <div className="relative overflow-hidden rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.12)] w-[100px] sm:w-[220px] md:w-[250px] h-[140px] sm:h-[300px] md:h-[320px] sm:rotate-2 hover:-translate-y-2 hover:rotate-2 transition-all duration-400 group">
          <img 
            src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=560&fit=crop" 
            alt="Bijoux"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-2 sm:bottom-3.5 left-2 sm:left-3.5 bg-black backdrop-blur-sm px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[8px] sm:text-[10px] md:text-[11px] font-medium tracking-wider text-cream">
            Bijoux
          </div>
        </div>
      </div>
    </section>
  );
}
