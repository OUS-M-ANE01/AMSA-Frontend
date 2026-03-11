interface CheckoutProps {
  onNavigate: (page: string) => void;
}

export default function Checkout({ onNavigate }: CheckoutProps) {
  return (
    <div className="min-h-screen pt-18">
      <div className="relative h-[40vh] flex flex-col items-center justify-center bg-cream">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-light text-charcoal">
          <em className="italic text-gold">Commande</em>
        </h1>
        <p className="mt-4 text-text-light text-base md:text-lg">Finalisez votre achat en toute sécurité</p>
      </div>
      
      <section className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-14 bg-warm-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12">
            {/* Formulaire de commande */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-charcoal mb-8">
                Informations de <em className="italic text-gold">livraison</em>
              </h2>
              
              <form className="space-y-6">
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
                  <label className="block text-sm text-charcoal mb-2">Adresse *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                    placeholder="Numéro et nom de rue"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-charcoal mb-2">Code postal *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                      placeholder="75001"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-charcoal mb-2">Ville *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                      placeholder="Paris"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Téléphone *</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Email *</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="font-serif text-xl font-light text-charcoal mb-4">Mode de livraison</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Standard (3-5 jours)', price: 'Gratuit' },
                      { label: 'Express (1-2 jours)', price: '6 500 FCFA' },
                      { label: 'Premium (24h)', price: '9 800 FCFA' }
                    ].map((option, i) => (
                      <label key={i} className="flex items-center justify-between p-4 border border-border cursor-pointer hover:border-gold transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 ${i === 0 ? 'border-gold bg-gold' : 'border-border'}`}>
                            {i === 0 && <div className="w-2 h-2 bg-charcoal rounded-full mx-auto mt-1"></div>}
                          </div>
                          <span className="text-sm text-charcoal">{option.label}</span>
                        </div>
                        <span className="text-sm font-medium text-charcoal">{option.price}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            
            {/* Résumé de commande */}
            <div>
              <div className="bg-cream p-6 sticky top-24">
                <h3 className="font-serif text-xl font-light text-charcoal mb-6">Récapitulatif</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Sous-total</span>
                    <span className="text-charcoal font-medium">227 600 FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">Livraison</span>
                    <span className="text-charcoal font-medium">Gratuit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light">TVA (20%)</span>
                    <span className="text-charcoal font-medium">45 520 FCFA</span>
                  </div>
                </div>
                
                <div className="flex justify-between mb-6">
                  <span className="font-medium text-charcoal">Total</span>
                  <span className="text-2xl font-serif text-charcoal">273 120 FCFA</span>
                </div>
                
                <button 
                  onClick={() => {
                    alert('Commande validée ! Merci pour votre achat.');
                    onNavigate('accueil');
                  }}
                  className="w-full bg-charcoal text-white py-4 hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase"
                >
                  Valider la commande
                </button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-light">
                  <span>🔒</span>
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
