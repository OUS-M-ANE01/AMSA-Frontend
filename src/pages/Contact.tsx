import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { adminAPI } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await adminAPI.sendContactMessage(formData);
      setSuccess(true);
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-18">
      <div className="relative h-[50vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Image de fond */}
        <img 
          src="https://rohitpolymer.com/wp-content/uploads/2024/01/contact-us.png" 
          alt="Contact"
          className="absolute inset-0 w-full h-full object-cover"
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
                    <h3 className="text-charcoal font-medium mb-1">Boutique Dakar</h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      Liberté 6 Extension<br />
                      Dakar, Sénégal
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h3 className="text-charcoal font-medium mb-1">Téléphone</h3>
                    <p className="text-text-light text-sm">+221  787 96 51 32</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h3 className="text-charcoal font-medium mb-1">Email</h3>
                    <p className="text-text-light text-sm">amsa180525@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gold mt-1" />
                  <div>
                    <h3 className="text-charcoal font-medium mb-1">Horaires</h3>
                    <p className="text-text-light text-sm leading-relaxed">
                      Lundi - Vendredi : 9h - 18h<br />
                      Samedi : 9h - 16h<br />
                      Dimanche : Fermé
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact rapide WhatsApp */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-serif text-lg font-medium text-charcoal mb-3">
                  💬 Contact rapide
                </h3>
                <p className="text-sm text-text-light mb-4">
                  Pour une réponse immédiate, contactez-nous sur WhatsApp
                </p>
                <a
                  href="https://wa.me/221787965132?text=Bonjour,%20j'aimerais%20avoir%20des%20informations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.382"/>
                  </svg>
                  Ouvrir WhatsApp
                </a>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div>
              <h2 className="font-serif text-3xl font-light text-charcoal mb-8">
                Envoyez-nous un <em className="italic text-gold">message</em>
              </h2>
              
              {/* Messages de statut */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-green-800 font-medium">Message envoyé avec succès !</p>
                    <p className="text-green-600 text-sm">Nous vous répondrons dans les 24 heures.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-charcoal mb-2">Prénom</label>
                    <input 
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-charcoal mb-2">Nom *</label>
                    <input 
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Email *</label>
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Téléphone</label>
                  <input 
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors"
                    placeholder="+221 78 123 45 67"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Sujet *</label>
                  <select 
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors text-charcoal"
                  >
                    <option value="">Choisir un sujet</option>
                    <option value="Question sur un produit">Question sur un produit</option>
                    <option value="Suivi de commande">Suivi de commande</option>
                    <option value="Livraison et récupération">Livraison et récupération</option>
                    <option value="Service après-vente">Service après-vente</option>
                    <option value="Rendez-vous boutique">Rendez-vous boutique</option>
                    <option value="Partenariat">Partenariat</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-charcoal mb-2">Message *</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-border focus:border-gold focus:outline-none transition-colors resize-none"
                    placeholder="Votre message..."
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le message'
                  )}
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
            <p>Dakar, Liberté 6 extension</p>
          </div>
        </div>
      </section>
    </div>
  );
}