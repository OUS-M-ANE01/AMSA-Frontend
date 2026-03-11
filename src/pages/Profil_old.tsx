import { User, Mail, Phone, MapPin, Lock, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function Profil() {
  const [formData, setFormData] = useState({
    prenom: 'Marie',
    nom: 'Diallo',
    email: 'marie.diallo@email.com',
    telephone: '+221 77 123 45 67',
    dateNaissance: '1990-05-15',
    adresse: '12 Rue de la République',
    ville: 'Dakar',
    codePostal: '10000',
    pays: 'Sénégal',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Profil mis à jour:', formData);
    // Logique de mise à jour du profil
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('Mot de passe changé');
    // Logique de changement de mot de passe
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen pt-18 bg-warm-white">
      {/* Hero Banner */}
      <div className="relative h-[35vh] flex flex-col items-center justify-center bg-cream">
        <div className="mb-4">
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center">
            <User size={48} className="text-gold" />
          </div>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-charcoal">
          Mon <em className="italic text-gold">Profil</em>
        </h1>
        <p className="mt-3 text-text-light text-base">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Contenu Principal */}
      <section className="py-12 md:py-16 px-4 md:px-8 lg:px-14">
        <div className="max-w-4xl mx-auto">
          
          {/* Informations Personnelles */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <User size={24} className="text-gold" />
              <h2 className="font-serif text-2xl font-light text-charcoal">
                Informations Personnelles
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                    <Mail size={16} className="text-text-light" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                    <Phone size={16} className="text-text-light" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                    <Calendar size={16} className="text-text-light" />
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                  <MapPin size={16} className="text-text-light" />
                  Adresse
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    placeholder="Ville"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                  <input
                    type="text"
                    name="codePostal"
                    value={formData.codePostal}
                    onChange={handleChange}
                    placeholder="Code Postal"
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase"
              >
                Enregistrer les modifications
              </button>
            </form>
          </div>

          {/* Changement de mot de passe */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-gold" />
              <h2 className="font-serif text-2xl font-light text-charcoal">
                Sécurité
              </h2>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-border rounded focus:outline-none focus:border-gold transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-charcoal text-white hover:bg-gold hover:text-charcoal transition-colors text-sm font-medium tracking-wider uppercase"
                >
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
