import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  Settings as SettingsIcon,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Truck
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Settings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  shopHours: {
    weekdays: string;
    sunday: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  ecommerce: {
    freeShippingThreshold: number;
    returnPeriodDays: number;
    shippingFee: number;
    currency: string;
  };
  trustStrip: Array<{
    icon: string;
    text: string;
    isActive: boolean;
  }>;
  newsletter: {
    title: string;
    label: string;
    description: string;
    buttonText: string;
  };
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getSettings();
      setSettings(response.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#8B7355]" size={48} />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Paramètres du Site</h1>
          <p className="text-[#6B6B6B] mt-1">Gérer les informations générales du site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#8B7355] text-white rounded-xl hover:bg-[#6D5942] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm">
          <h2 className="text-xl font-bold text-[#3A3A3A] mb-4 flex items-center gap-2">
            <SettingsIcon size={24} className="text-[#8B7355]" />
            Informations générales
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Nom du site</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm">
          <h2 className="text-xl font-bold text-[#3A3A3A] mb-4 flex items-center gap-2">
            <Phone size={24} className="text-[#8B7355]" />
            Contact
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#3A3A3A] mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#3A3A3A] mb-2 flex items-center gap-2">
                <Phone size={16} /> Téléphone
              </label>
              <input
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#3A3A3A] mb-2 flex items-center gap-2">
                <MapPin size={16} /> Adresse
              </label>
              <textarea
                value={settings.contactAddress}
                onChange={(e) => setSettings({...settings, contactAddress: e.target.value})}
                rows={2}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Horaires */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm">
          <h2 className="text-xl font-bold text-[#3A3A3A] mb-4 flex items-center gap-2">
            <Clock size={24} className="text-[#8B7355]" />
            Horaires d'ouverture
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Lundi - Samedi</label>
              <input
                type="text"
                value={settings.shopHours.weekdays}
                onChange={(e) => setSettings({...settings, shopHours: {...settings.shopHours, weekdays: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Dimanche</label>
              <input
                type="text"
                value={settings.shopHours.sunday}
                onChange={(e) => setSettings({...settings, shopHours: {...settings.shopHours, sunday: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm">
          <h2 className="text-xl font-bold text-[#3A3A3A] mb-4 flex items-center gap-2">
            <Instagram size={24} className="text-[#8B7355]" />
            Réseaux sociaux
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#3A3A3A] mb-2 flex items-center gap-2">
                <Instagram size={16} /> Instagram
              </label>
              <input
                type="url"
                value={settings.socialMedia.instagram}
                onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, instagram: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#3A3A3A] mb-2 flex items-center gap-2">
                <Facebook size={16} /> Facebook
              </label>
              <input
                type="url"
                value={settings.socialMedia.facebook}
                onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, facebook: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#3A3A3A] mb-2 flex items-center gap-2">
                <Twitter size={16} /> Twitter
              </label>
              <input
                type="url"
                value={settings.socialMedia.twitter}
                onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, twitter: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#3A3A3A] mb-2 flex items-center gap-2">
                <Youtube size={16} /> Youtube
              </label>
              <input
                type="url"
                value={settings.socialMedia.youtube}
                onChange={(e) => setSettings({...settings, socialMedia: {...settings.socialMedia, youtube: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* E-commerce */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm">
          <h2 className="text-xl font-bold text-[#3A3A3A] mb-4 flex items-center gap-2">
            <Truck size={24} className="text-[#8B7355]" />
            Configuration E-commerce
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Montant livraison gratuite</label>
              <input
                type="number"
                value={settings.ecommerce.freeShippingThreshold}
                onChange={(e) => setSettings({...settings, ecommerce: {...settings.ecommerce, freeShippingThreshold: Number(e.target.value)}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Frais de livraison</label>
              <input
                type="number"
                value={settings.ecommerce.shippingFee}
                onChange={(e) => setSettings({...settings, ecommerce: {...settings.ecommerce, shippingFee: Number(e.target.value)}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Délai de retour (jours)</label>
              <input
                type="number"
                value={settings.ecommerce.returnPeriodDays}
                onChange={(e) => setSettings({...settings, ecommerce: {...settings.ecommerce, returnPeriodDays: Number(e.target.value)}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Devise</label>
              <input
                type="text"
                value={settings.ecommerce.currency}
                onChange={(e) => setSettings({...settings, ecommerce: {...settings.ecommerce, currency: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm">
          <h2 className="text-xl font-bold text-[#3A3A3A] mb-4">Newsletter</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Label</label>
              <input
                type="text"
                value={settings.newsletter.label}
                onChange={(e) => setSettings({...settings, newsletter: {...settings.newsletter, label: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Titre</label>
              <input
                type="text"
                value={settings.newsletter.title}
                onChange={(e) => setSettings({...settings, newsletter: {...settings.newsletter, title: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Description</label>
              <textarea
                value={settings.newsletter.description}
                onChange={(e) => setSettings({...settings, newsletter: {...settings.newsletter, description: e.target.value}})}
                rows={2}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Texte du bouton</label>
              <input
                type="text"
                value={settings.newsletter.buttonText}
                onChange={(e) => setSettings({...settings, newsletter: {...settings.newsletter, buttonText: e.target.value}})}
                className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm">
        <h2 className="text-xl font-bold text-[#3A3A3A] mb-4">Bande de confiance</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {settings.trustStrip.map((item, index) => (
            <div key={index} className="border border-[#E8E0D5] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => {
                    const newTrustStrip = [...settings.trustStrip];
                    newTrustStrip[index].isActive = e.target.checked;
                    setSettings({...settings, trustStrip: newTrustStrip});
                  }}
                  className="w-4 h-4 text-[#8B7355] rounded"
                />
                <span className="text-sm font-medium text-[#3A3A3A]">Actif</span>
              </div>
              <input
                type="text"
                value={item.text}
                onChange={(e) => {
                  const newTrustStrip = [...settings.trustStrip];
                  newTrustStrip[index].text = e.target.value;
                  setSettings({...settings, trustStrip: newTrustStrip});
                }}
                className="w-full px-3 py-2 border border-[#E8E0D5] rounded-lg focus:border-[#8B7355] focus:outline-none text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button - Fixed */}
      <div className="sticky bottom-6 flex justify-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-[#8B7355] text-white rounded-xl hover:bg-[#6D5942] transition-colors disabled:opacity-50 shadow-lg"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Enregistrement...' : 'Enregistrer tous les paramètres'}
        </button>
      </div>
    </div>
  );
}
