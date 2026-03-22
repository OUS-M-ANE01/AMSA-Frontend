import { useEffect, useState } from 'react';
import { Save, RefreshCw, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PageBanner {
  _id?: string;
  page: 'soldes' | 'vetements' | 'bijoux' | 'apropos' | 'contact';
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: number;
}

const pageLabels = {
  soldes: 'Soldes',
  vetements: 'Vêtements',
  bijoux: 'Bijoux',
  apropos: 'À Propos',
  contact: 'Contact',
};

export default function AdminPageBanners() {
  const [banners, setBanners] = useState<PageBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>('soldes');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/page-banners/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const initDefaultBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/page-banners/admin/init`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Bannières initialisées avec succès');
        fetchBanners();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'initialisation');
    }
  };

  const saveBanner = async (page: string, data: Partial<PageBanner>) => {
    try {
      setSaving(page);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/page-banners/admin/${page}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Bannière mise à jour avec succès');
        fetchBanners();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(null);
    }
  };

  const updateBanner = (page: string, field: string, value: any) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.page === page ? { ...banner, [field]: value } : banner
      )
    );
  };

  const currentBanner = banners.find((b) => b.page === selectedPage) || {
    page: selectedPage as any,
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    imageAlt: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    backgroundColor: '#2C2C2C',
    textColor: '#FFFFFF',
    overlayOpacity: 0.3,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-[#8B7355]" size={48} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3A3A3A]">
            Gestion des Bannières
          </h1>
          <p className="text-sm sm:text-base text-[#6B6B6B] mt-1">
            Personnalisez les bannières de chaque page
          </p>
        </div>
        <button
          onClick={initDefaultBanners}
          className="px-4 py-2 bg-[#6D5942] text-white rounded-lg hover:bg-[#5A4835] transition-colors flex items-center gap-2 justify-center"
        >
          <RefreshCw size={16} />
          <span>Initialiser</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden">
        <div className="flex overflow-x-auto">
          {Object.entries(pageLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedPage(key)}
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors ${
                selectedPage === key
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-[#F5F1ED] text-[#6B6B6B] hover:bg-[#E8E0D5]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 border border-[#E8E0D5] shadow-sm space-y-6">
        {/* Preview */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#3A3A3A]">
            Aperçu
          </label>
          <div
            className="relative h-64 rounded-lg overflow-hidden"
            style={{ backgroundColor: currentBanner.backgroundColor }}
          >
            {currentBanner.imageUrl && (
              <>
                <img
                  src={currentBanner.imageUrl}
                  alt={currentBanner.imageAlt || 'Bannière'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: currentBanner.backgroundColor,
                    opacity: currentBanner.overlayOpacity || 0.3,
                  }}
                />
              </>
            )}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: currentBanner.textColor }}
              >
                {currentBanner.title || 'Titre de la bannière'}
              </h2>
              {currentBanner.subtitle && (
                <p
                  className="text-xl mb-4"
                  style={{ color: currentBanner.textColor }}
                >
                  {currentBanner.subtitle}
                </p>
              )}
              {currentBanner.description && (
                <p
                  className="text-sm max-w-2xl"
                  style={{ color: currentBanner.textColor, opacity: 0.9 }}
                >
                  {currentBanner.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              updateBanner(selectedPage, 'isActive', !currentBanner.isActive)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentBanner.isActive
                ? 'bg-[#D1FAE5] text-[#065F46]'
                : 'bg-[#FEE2E2] text-[#991B1B]'
            }`}
          >
            {currentBanner.isActive ? (
              <>
                <Eye size={16} />
                <span>Active</span>
              </>
            ) : (
              <>
                <EyeOff size={16} />
                <span>Inactive</span>
              </>
            )}
          </button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#3A3A3A]">
            Titre *
          </label>
          <input
            type="text"
            value={currentBanner.title}
            onChange={(e) => updateBanner(selectedPage, 'title', e.target.value)}
            className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            placeholder="Titre principal"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#3A3A3A]">
            Sous-titre
          </label>
          <input
            type="text"
            value={currentBanner.subtitle || ''}
            onChange={(e) => updateBanner(selectedPage, 'subtitle', e.target.value)}
            className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            placeholder="Sous-titre (optionnel)"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#3A3A3A]">
            Description
          </label>
          <textarea
            value={currentBanner.description || ''}
            onChange={(e) => updateBanner(selectedPage, 'description', e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            placeholder="Description (optionnel)"
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#3A3A3A]">
            URL de l'image *
          </label>
          <input
            type="text"
            value={currentBanner.imageUrl}
            onChange={(e) => updateBanner(selectedPage, 'imageUrl', e.target.value)}
            className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            placeholder="https://..."
          />
        </div>

        {/* Image Alt */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#3A3A3A]">
            Texte alternatif
          </label>
          <input
            type="text"
            value={currentBanner.imageAlt || ''}
            onChange={(e) => updateBanner(selectedPage, 'imageAlt', e.target.value)}
            className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            placeholder="Description de l'image"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              Couleur de fond
            </label>
            <input
              type="color"
              value={currentBanner.backgroundColor || '#2C2C2C'}
              onChange={(e) =>
                updateBanner(selectedPage, 'backgroundColor', e.target.value)
              }
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              Couleur du texte
            </label>
            <input
              type="color"
              value={currentBanner.textColor || '#FFFFFF'}
              onChange={(e) =>
                updateBanner(selectedPage, 'textColor', e.target.value)
              }
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              Opacité overlay ({Math.round((currentBanner.overlayOpacity || 0.3) * 100)}%)
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={currentBanner.overlayOpacity || 0.3}
              onChange={(e) =>
                updateBanner(selectedPage, 'overlayOpacity', parseFloat(e.target.value))
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              Texte du bouton
            </label>
            <input
              type="text"
              value={currentBanner.buttonText || ''}
              onChange={(e) =>
                updateBanner(selectedPage, 'buttonText', e.target.value)
              }
              className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              placeholder="Ex: Découvrir"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              Lien du bouton
            </label>
            <input
              type="text"
              value={currentBanner.buttonLink || ''}
              onChange={(e) =>
                updateBanner(selectedPage, 'buttonLink', e.target.value)
              }
              className="w-full px-4 py-2 border border-[#E8E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              placeholder="/soldes"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => saveBanner(selectedPage, currentBanner)}
            disabled={saving === selectedPage}
            className="px-6 py-3 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving === selectedPage ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Enregistrer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
