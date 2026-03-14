export default function Apropos() {
  return (
    <div className="min-h-screen pt-18">
      <div className="relative h-[50vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Image de fond */}
        <img 
          src="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1600&q=80" 
          alt="À propos"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
        
        {/* Contenu */}
        <div className="relative z-10 text-center px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-white">
            À <em className="italic text-gold">propos</em>
          </h1>
          <p className="mt-3 md:mt-4 text-white/90 max-w-2xl mx-auto text-base md:text-lg">L'histoire d'une maison de mode parisienne</p>
        </div>
      </div>
      
      {/* Notre Histoire */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-6.5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <span className="text-sm tracking-[0.2em] uppercase text-gold">Depuis 2010</span>
              <h2 className="font-serif text-4xl font-light text-charcoal mt-3 mb-6">
                Notre <em className="italic text-gold">Histoire</em>
              </h2>
              <p className="text-text-light mb-4 leading-relaxed">
                ASMA est née d'une passion pour la mode et les bijoux, dans un petit atelier du Marais à Paris. 
                Ce qui a commencé comme un rêve est devenu une maison de création reconnue pour ses pièces élégantes 
                et intemporelles.
              </p>
              <p className="text-text-light leading-relaxed">
                Aujourd'hui, nous continuons de créer chaque pièce avec le même amour du détail et de la qualité, 
                en privilégiant les matériaux nobles et le savoir-faire artisanal français. Notre engagement ? 
                Offrir à chaque femme des créations qui la subliment et l'accompagnent au fil des saisons.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/eva-about.png" 
                alt="Atelier ASMA" 
                className="w-full aspect-[4/5] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-cream">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-4">
            Nos <em className="italic text-gold">Valeurs</em>
          </h2>
          <p className="text-text-light mb-12 md:mb-16 max-w-2xl mx-auto">
            Ce qui guide notre travail au quotidien
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-gold rounded-full">
                <span className="text-2xl text-gold">✦</span>
              </div>
              <h3 className="text-xl text-charcoal font-medium mb-3">Excellence</h3>
              <p className="text-text-light text-sm leading-relaxed">
                Nous sélectionnons rigoureusement chaque matériau et veillons à la perfection de chaque finition.
              </p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-gold rounded-full">
                <span className="text-2xl text-gold">✦</span>
              </div>
              <h3 className="text-xl text-charcoal font-medium mb-3">Élégance</h3>
              <p className="text-text-light text-sm leading-relaxed">
                Des designs intemporels qui traversent les modes et subliment avec raffinement et sobriété.
              </p>
            </div>
            <div>
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border border-gold rounded-full">
                <span className="text-2xl text-gold">✦</span>
              </div>
              <h3 className="text-xl text-charcoal font-medium mb-3">Éthique</h3>
              <p className="text-text-light text-sm leading-relaxed">
                Production responsable, artisans équitablement rémunérés, et matières sourcées avec transparence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-charcoal mb-4">
              Notre <em className="italic text-gold">Équipe</em>
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Des artisans passionnés au service de votre élégance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face" 
                alt="Éva Laurent" 
                className="w-48 h-48 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl text-charcoal font-medium mb-1">Éva Laurent</h3>
              <p className="text-sm text-gold mb-2">Fondatrice & Directrice Artistique</p>
              <p className="text-sm text-text-light">Visionnaire derrière chaque collection</p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face" 
                alt="Sophie Martin" 
                className="w-48 h-48 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl text-charcoal font-medium mb-1">Sophie Martin</h3>
              <p className="text-sm text-gold mb-2">Designer Textile</p>
              <p className="text-sm text-text-light">15 ans d'expérience en haute couture</p>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face" 
                alt="Claire Dubois" 
                className="w-48 h-48 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl text-charcoal font-medium mb-1">Claire Dubois</h3>
              <p className="text-sm text-gold mb-2">Maître Joaillier</p>
              <p className="text-sm text-text-light">Créations sur-mesure et restauration</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
