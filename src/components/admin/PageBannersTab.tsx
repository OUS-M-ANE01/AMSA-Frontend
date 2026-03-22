import { useState, useEffect } from 'react';
import { Save, Loader2, X, Trash2, Edit2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PageBanner {
  _id?: string;
  page: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
}

// Les 5 pages fixes
const FIXED_PAGES = [
  { value: 'soldes', label: 'Soldes', defaultTitle: 'Soldes Exceptionnelles', defaultSubtitle: "Jusqu'à -70%" },
  { value: 'bijoux', label: 'Bijoux', defaultTitle: 'Bijoux Élégants', defaultSubtitle: 'Pièces Uniques' },
  { value: 'vetements', label: 'Vêtements', defaultTitle: 'Collection Vêtements', defaultSubtitle: 'Nouvelle Saison' },
  { value: 'contact', label: 'Contact', defaultTitle: 'Contactez-Nous', defaultSubtitle: 'Nous Sommes À Votre Écoute' },
  { value: 'apropos', label: 'À Propos', defaultTitle: "À Propos d'AS'MA", defaultSubtitle: 'Notre Histoire' },
];

export default function PageBannersTab() {
  const [banners, setBanners] = useState<PageBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<PageBanner | null>(null);

  const [formData, setFormData] = useState<PageBanner>({
    page: '',
    title: '',
    subtitle: '',
    imageUrl: '',
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/page-banners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(response.data.data || []);
    } catch (error: any) {
      console.error('Erreur lors du chargement des bannières:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: string) => {
    const existingBanner = banners.find(b => b.page === page);
    const pageInfo = FIXED_PAGES.find(p => p.value === page);
    
    if (existingBanner) {
      setEditingBanner(existingBanner);
      setFormData({
        ...existingBanner,
        page: existingBanner.page,
      });
    } else {
      // Créer une nouvelle bannière avec les valeurs par défaut
      setEditingBanner(null);
      setFormData({
        page: page,
        title: pageInfo?.defaultTitle || '',
        subtitle: pageInfo?.defaultSubtitle || '',
        imageUrl: '',
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.page || !formData.title) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      if (editingBanner?._id) {
        // Mise à jour
        await axios.put(
          `${API_URL}/page-banners/${editingBanner._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Bannière mise à jour avec succès');
      } else {
        // Création
        await axios.post(
          `${API_URL}/page-banners`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Bannière créée avec succès');
      }
      
      fetchBanners();
      closeModal();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteImage = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer l\'image ? Le fond sera noir par défaut.')) {
      setFormData({ ...formData, imageUrl: '' });
      toast.success('Image supprimée');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({
      page: '',
      title: '',
      subtitle: '',
      imageUrl: '',
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#8B7355]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Bannières de Pages</h2>
        <p className="text-sm text-gray-600 mt-1">
          Gérez les bannières des 5 pages principales
        </p>
      </div>

      {/* Grille des 5 bannières fixes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FIXED_PAGES.map((page) => {
          const banner = banners.find(b => b.page === page.value);
          
          return (
            <div
              key={page.value}
              className="bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleEdit(page.value)}
            >
              {/* Image ou fond noir */}
              <div 
                className="relative h-32 flex items-center justify-center"
                style={{ 
                  backgroundColor: banner?.imageUrl ? 'transparent' : '#000',
                  backgroundImage: banner?.imageUrl ? `url(${banner.imageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!banner?.imageUrl && (
                  <span className="text-white text-sm font-medium">Aucune image</span>
                )}
                {!banner?.isActive && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                    Inactive
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <Edit2 className="text-white opacity-0 hover:opacity-100 transition-opacity" size={32} />
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4">
                <span className="text-xs font-medium text-[#8B7355] uppercase block mb-2">
                  {page.label}
                </span>
                <h3 className="font-bold text-gray-800 mb-1">
                  {banner?.title || page.defaultTitle}
                </h3>
                {(banner?.subtitle || page.defaultSubtitle) && (
                  <p className="text-sm text-gray-600">
                    {banner?.subtitle || page.defaultSubtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Modifier la bannière
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Page (lecture seule) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page *
                  </label>
                  <input
                    type="text"
                    value={FIXED_PAGES.find(p => p.value === formData.page)?.label || formData.page}
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B7355]"
                    placeholder="Ex: À Propos de Nous"
                    required
                  />
                </div>

                {/* Sous-titre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sous-titre
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B7355]"
                    placeholder="Ex: Découvrez notre histoire"
                  />
                </div>

                {/* Statut */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#8B7355] border rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Bannière active
                  </label>
                </div>
              </div>

              {/* Image */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image de bannière (1920x400px recommandé)
                  </label>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                      Supprimer l'image
                    </button>
                  )}
                </div>
                
                {/* Aperçu de l'image ou fond noir */}
                {formData.imageUrl ? (
                  <div className="mb-3 rounded-lg overflow-hidden border">
                    <img 
                      src={formData.imageUrl} 
                      alt="Aperçu" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-3 rounded-lg overflow-hidden border bg-black h-32 flex items-center justify-center">
                    <span className="text-white text-sm">Fond noir par défaut</span>
                  </div>
                )}
                
                <ImageUploader
                  currentImage={formData.imageUrl || ''}
                  onImageSelect={(url: string) => setFormData({ ...formData, imageUrl: url })}
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
