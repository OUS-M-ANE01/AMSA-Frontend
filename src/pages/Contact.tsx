import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen pt-18">
      <div className="relative h-[50vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Image de fond */}
        <img 
          src="https://images.unsplash.com/photo-1486308510493-aa64833637bc?w=1600&q=80" 
          alt="Contact"
          className="absolute inset-0 w-full h-full objject-cover"
        />
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
        
        {/* Contenu */}
        <div className="relative z-10 text-center px-4 md:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-white">
            <em className="italic text-gold">Contactez</em>-nous
          </h1>
          <p className="mt-3 md:mt-4 text-white/90 max-w-2xl mx-auto text-base md:text-lg">Notre équipe est à votre écoute</p>
        </div>
      </div>
      
      {/* Informations & Formulaire */}
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            {/* Informations de contact */}
            <div>
              <h2 className="font-serif text-3xl font-light text-charcoal mb-8">
                Nos <em className="italic text-gold">Coordonnées</em>
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h3 className="text-charcoal font-medium mb-1">Boutique Paris</h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      24 Rue des Francs-Bourgeois<br />
                      75003 Paris, France
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h3 className="text-charcoal font-medium mb-1">Téléphone</h3>
                    <p className="text-text-light text-sm">+33 1 42 74 59 38</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h3 className="text-charcoal font-medium mb-1">Email</h3>
                    <p className="text-text-light text-sm">contact@evastyl.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h3 className="text-charcoal font-medium mb-1">Horaires</h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      Lundi - Samedi : 10h - 19h<br />
                      Dimanche : 14h - 18h
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-cream p-6">
                <h3 className="text-charcoal font-medium mb-3">Service Client</h3>
                <p className="text-text-light text-sm leading-relaxed mb-4">
                  Notre équipe répond à toutes vos questions sous 24h. Pour un service personnalisé, 
                  n'hésitez pas à prendre rendez-vous dans notre boutique.
                </p>
                <button 
                  onClick={() => alert('Rendez-vous demandé ! Notre équipe vous contactera bientôt.')}
                  className="text-sm text-gold hover:text-charcoal transition-colors border-b border-gold"
                >
                  Prendre rendez-vous →
                </button>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div>
              <h2 className="font-serif text-3xl font-light text-charcoal mb-8">
                Envoyez-nous un <em className="italic text-gold">message</em>
              </h2>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Message envoyé ! Nous vous répondrons sous 24h.');
                  e.currentTarget.reset();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-charcoal mb-2">Prénom *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal mb-2">Nom *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Email *</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Téléphone</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Sujet *</label>
                  <select className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors text-text-light">
                    <option>Choisir un sujet</option>
                    <option>Question sur un produit</option>
                    <option>Suivi de commande</option>
                    <option>Service après-vente</option>
                    <option>Rendez-vous boutique</option>
                    <option>Partenariat</option>
                    <option>Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Message *</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors resize-none"
                    placeholder="Votre message..."
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full py-4 bg-charcoal text-white hover:bg-gold transition-colors duration-300"
                >
                  Envoyer le message
                </button>
                
                <p className="text-xs text-text-light text-center">
                  En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Carte */}
      <section className="h-[400px] bg-gray-200">
        <div className="w-full h-full flex items-center justify-center text-text-light">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gold" />
            <p>24 Rue des Francs-Bourgeois, 75003 Paris</p>
          </div>
        </div>
      </section>
    </div>
  );
}
