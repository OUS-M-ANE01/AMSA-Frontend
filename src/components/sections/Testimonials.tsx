import { Star } from 'lucide-react';
import { testimonials } from '../../data/products';
import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(1);

  // Défilement automatique - change toutes les 4 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getVisibleTestimonials = () => {
    const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
    const next = (currentIndex + 1) % testimonials.length;
    return [
      { index: prev, position: 'left' },
      { index: currentIndex, position: 'center' },
      { index: next, position: 'right' }
    ];
  };

  const visibleCards = getVisibleTestimonials();

  return (
    <section className="px-4 md:px-8 lg:px-14 py-16 md:py-24 bg-warm-white overflow-hidden">
      <div className="text-center mb-10 md:mb-12">
        <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-5 inline-block">
          Avis Clients
        </div>
        <h2 className="font-serif text-3xl md:text-4xl lg:text-[clamp(32px,4vw,52px)] font-light leading-tight text-charcoal">
          Elles <em className="italic text-gold">Adorent</em> EvaStyl
        </h2>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Carousel container */}
        <div className="flex items-center justify-center gap-4 md:gap-8 py-8">
          {visibleCards.map(({ index, position }) => {
            const testi = testimonials[index];
            const isCenter = position === 'center';
            
            return (
              <div
                key={`${testi.id}-${position}-${currentIndex}`}
                className={`transition-all duration-700 ease-in-out ${
                  isCenter
                    ? 'w-full md:w-[480px] opacity-100 z-10'
                    : 'w-full md:w-[350px] opacity-50 hidden md:block'
                }`}
              >
                <div 
                  className={`bg-warm-white rounded-md p-6 md:p-8 transition-all duration-700 h-full flex flex-col ${
                    isCenter
                      ? 'border-2 border-gold shadow-2xl'
                      : 'border border-border shadow-md'
                  }`}
                  style={{ minHeight: isCenter ? '320px' : '280px' }}
                >
                  <div className="flex gap-1 text-gold mb-4">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className={`font-serif italic font-light leading-relaxed text-charcoal mb-5 flex-grow ${
                    isCenter ? 'text-lg' : 'text-base'
                  }`}>
                    "{testi.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <img 
                      src={testi.avatar} 
                      alt={testi.author}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gold-light"
                    />
                    <div>
                      <div className="text-[13px] font-medium text-charcoal">
                        {testi.author}
                      </div>
                      <div className="text-[11px] text-text-light tracking-wider">
                        {testi.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'bg-gold w-8 h-2'
                  : 'bg-border hover:bg-gold/50 w-2 h-2'
              }`}
              aria-label={`Aller au témoignage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
