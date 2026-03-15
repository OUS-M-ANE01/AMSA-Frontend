import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';
import { Save, Loader2, Home, ImageIcon, Instagram as InstagramIcon, MessageSquareQuote, Plus, Edit2, Trash2, Star, X, Eye, EyeOff, Package, CheckCircle2 } from 'lucide-react';
import { productsAPI } from '../../services/api';
import { adaptApiProduct } from '../../hooks/usePublicProducts';
import toast, { Toaster } from 'react-hot-toast';

type Section = 'hero' | 'banner' | 'instagram' | 'testimonials' | 'produits';

interface Testimonial {
  _id: string;
  text: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
  isActive: boolean;
  order: number;
}

const SECTION_DEFAULTS: Record<string, any> = {
  hero: {
    titleBefore: 'Portez Votre',
    titleHighlight: 'Élégance',
    titleAfter: 'au quotidien',
    description: 'Vêtements et bijoux soigneusement sélectionnés pour la femme moderne qui affirme son style avec grâce et assurance.',
    button1Text: 'Découvrez nos produits',
    button1Link: 'collections',
    button2Text: 'Voir les bijoux',
    button2Link: 'bijoux',
    images: [
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=560&fit=crop', label: 'Robes' },
      { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=480&h=680&fit=crop', label: 'Collection' },
      { url: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=560&fit=crop', label: 'Bijoux' },
    ],
  },
  banner: {
    label: 'Nouvelle Collection',
    title: 'Printemps',
    subtitle: '2025',
    description: 'Découvrez notre sélection de pièces exclusives pensées pour la femme moderne.',
    buttonText: 'Découvrir',
    buttonLink: 'collections',
    backgroundImage: '',
  },
  instagram: {
    username: '@asma',
    title: 'Suivez-nous sur Instagram',
    profileUrl: 'https://instagram.com/asma',
    images: ['', '', '', '', '', ''],
  },
};

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({});

  // --- Produits à la une state ---
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [produitsLoading, setProduitsLoading] = useState(false);
  const [savingProduits, setSavingProduits] = useState(false);
  const [pinnedBijoux, setPinnedBijoux] = useState<string[]>([]);
  const [pinnedFeatured, setPinnedFeatured] = useState<string[]>([]);

  // --- Testimonials state ---
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    role: 'Cliente vérifiée',
    avatar: '',
    rating: 5,
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (activeSection === 'testimonials') {
      fetchTestimonials();
    } else if (activeSection === 'produits') {
      fetchProduits();
    } else {
      fetchContent(activeSection);
    }
  }, [activeSection]);

  const fetchContent = async (section: Section) => {
    setLoading(true);
    try {
      const response = await adminAPI.getContentBySection(section);
      const saved = response.data.data.content || {};
      // Fusionner les valeurs par défaut avec les données sauvegardées
      setContent({ ...SECTION_DEFAULTS[section], ...saved });
    } catch (error) {
      // En cas d'erreur, utiliser les valeurs par défaut
      setContent(SECTION_DEFAULTS[section] || {});
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateContentBySection(activeSection, { content, isActive: true });
      toast.success('Contenu mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  // --- Produits à la une functions ---
  const JEWELRY_KEYWORDS = ['collier', 'bijou', 'bague', 'bracelet', 'boucle', 'parure', 'pendentif', 'earring', 'necklace', 'ring', 'jewelry'];
  const isJewelry = (cat: string) => JEWELRY_KEYWORDS.some(kw => cat.toLowerCase().includes(kw));

  const fetchProduits = async () => {
    setProduitsLoading(true);
    try {
      const [prodsRes, bijouRes, featRes] = await Promise.all([
        productsAPI.getAll({ limit: 100 }),
        adminAPI.getContentBySection('featured_jewelry').catch(() => null),
        adminAPI.getContentBySection('featured_products').catch(() => null),
      ]);
      const raw = prodsRes.data?.data || prodsRes.data?.products || prodsRes.data || [];
      const adapted = Array.isArray(raw) ? raw.map(adaptApiProduct) : [];
      setAllProducts(adapted);

      // Bijoux pinned — fallback = même logique que JewelryProducts.tsx
      const savedBijoux: string[] = bijouRes?.data?.data?.content?.pinnedIds || [];
      if (savedBijoux.length > 0) {
        setPinnedBijoux(savedBijoux);
      } else {
        const jewels = adapted.filter((p: any) => isJewelry(p.category));
        const fallback = jewels.length > 0 ? jewels.slice(0, 4) : adapted.slice(0, 4);
        setPinnedBijoux(fallback.map((p: any) => String(p._id || p.id)));
      }

      // Featured pinned — fallback = même logique que FeaturedProducts.tsx
      const savedFeatured: string[] = featRes?.data?.data?.content?.pinnedIds || [];
      if (savedFeatured.length > 0) {
        setPinnedFeatured(savedFeatured);
      } else {
        const withBadge = adapted.filter((p: any) => p.badge === 'new' || p.badge === 'bestseller');
        const fallback = withBadge.length > 0 ? withBadge.slice(0, 4) : adapted.slice(0, 4);
        setPinnedFeatured(fallback.map((p: any) => String(p._id || p.id)));
      }
    } catch {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setProduitsLoading(false);
    }
  };

  const togglePinned = (id: string, sub: 'bijoux' | 'featured') => {
    if (sub === 'bijoux') {
      setPinnedBijoux(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
      );
    } else {
      setPinnedFeatured(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev
      );
    }
  };

  const handleSaveProduits = async () => {
    setSavingProduits(true);
    try {
      await Promise.all([
        adminAPI.updateContentBySection('featured_jewelry', { content: { pinnedIds: pinnedBijoux }, isActive: true }),
        adminAPI.updateContentBySection('featured_products', { content: { pinnedIds: pinnedFeatured }, isActive: true }),
      ]);
      toast.success('Sélection de produits enregistrée');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSavingProduits(false);
    }
  };

  // --- Testimonials functions ---
  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const response = await adminAPI.getTestimonials();
      setTestimonials(response.data.data);
    } catch {
      toast.error('Erreur lors du chargement des témoignages');
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        text: testimonial.text,
        author: testimonial.author,
        role: testimonial.role,
        avatar: testimonial.avatar,
        rating: testimonial.rating,
        isActive: testimonial.isActive,
        order: testimonial.order,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({ text: '', author: '', role: 'Cliente vérifiée', avatar: '', rating: 5, isActive: true, order: testimonials.length });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await adminAPI.updateTestimonial(editingTestimonial._id, formData);
        toast.success('Témoignage mis à jour');
      } else {
        await adminAPI.createTestimonial(formData);
        toast.success('Témoignage créé');
      }
      fetchTestimonials();
      handleCloseModal();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    try {
      await adminAPI.deleteTestimonial(id);
      toast.success('Témoignage supprimé');
      fetchTestimonials();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleActiveTestimonial = async (testimonial: Testimonial) => {
    try {
      await adminAPI.updateTestimonial(testimonial._id, { ...testimonial, isActive: !testimonial.isActive });
      toast.success(testimonial.isActive ? 'Témoignage désactivé' : 'Témoignage activé');
      fetchTestimonials();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const tabs = [
    { id: 'hero' as Section, label: 'Section Hero', icon: Home },
    { id: 'banner' as Section, label: 'Banner', icon: ImageIcon },
    { id: 'instagram' as Section, label: 'Instagram', icon: InstagramIcon },
    { id: 'testimonials' as Section, label: 'Témoignages', icon: MessageSquareQuote },
    { id: 'produits' as Section, label: 'Produits à la une', icon: Package },
  ];

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3A3A3A]">Contenu du Site</h1>
          <p className="text-[#6B6B6B] mt-1">Gérer les sections de la page d'accueil</p>
        </div>
        {activeSection !== 'testimonials' && activeSection !== 'produits' && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#8B7355] text-white rounded-xl hover:bg-[#6D5942] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        )}
        {activeSection === 'produits' && (
          <button
            onClick={handleSaveProduits}
            disabled={savingProduits}
            className="flex items-center gap-2 px-6 py-3 bg-[#8B7355] text-white rounded-xl hover:bg-[#6D5942] transition-colors disabled:opacity-50"
          >
            {savingProduits ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {savingProduits ? 'Enregistrement...' : 'Enregistrer la sélection'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8E0D5]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
              activeSection === tab.id
                ? 'border-[#8B7355] text-[#8B7355]'
                : 'border-transparent text-[#6B6B6B] hover:text-[#3A3A3A]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-[#8B7355]" size={48} />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-[#3A3A3A]">Textes Hero</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Titre — Texte avant</label>
                    <input
                      type="text"
                      placeholder="Portez Votre"
                      value={content.titleBefore || ''}
                      onChange={(e) => setContent({...content, titleBefore: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Titre — Mot coloré <span className="text-[#8B7355] italic">(or)</span></label>
                    <input
                      type="text"
                      placeholder="Élégance"
                      value={content.titleHighlight || ''}
                      onChange={(e) => setContent({...content, titleHighlight: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Titre — Texte après</label>
                    <input
                      type="text"
                      placeholder="au quotidien"
                      value={content.titleAfter || ''}
                      onChange={(e) => setContent({...content, titleAfter: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Description</label>
                  <textarea
                    value={content.description || ''}
                    onChange={(e) => setContent({...content, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Bouton 1 - Texte</label>
                    <input
                      type="text"
                      value={content.button1Text || ''}
                      onChange={(e) => setContent({...content, button1Text: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Bouton 1 - Lien</label>
                    <input
                      type="text"
                      value={content.button1Link || ''}
                      onChange={(e) => setContent({...content, button1Link: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Bouton 2 - Texte</label>
                    <input
                      type="text"
                      value={content.button2Text || ''}
                      onChange={(e) => setContent({...content, button2Text: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Bouton 2 - Lien</label>
                    <input
                      type="text"
                      value={content.button2Link || ''}
                      onChange={(e) => setContent({...content, button2Link: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-[#3A3A3A]">Images Hero (3 images)</h2>
                
                {content.images?.map((img: any, index: number) => (
                  <div key={index} className="border border-[#E8E0D5] rounded-xl p-4">
                    <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Image {index + 1}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6B6B6B] mb-2">Image</p>
                        <ImageUploader
                          currentImage={img.url || ''}
                          onImageSelect={(url) => {
                            const newImages = [...content.images];
                            newImages[index] = { ...newImages[index], url };
                            setContent({...content, images: newImages});
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#6B6B6B] mb-2">Label (ex: Robes)</label>
                        <input
                          type="text"
                          placeholder="Label (ex: Robes)"
                          value={img.label || ''}
                          onChange={(e) => {
                            const newImages = [...content.images];
                            newImages[index].label = e.target.value;
                            setContent({...content, images: newImages});
                          }}
                          className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banner Section */}
          {activeSection === 'banner' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#3A3A3A]">Banner</h2>
              
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Label</label>
                <input
                  type="text"
                  value={content.label || ''}
                  onChange={(e) => setContent({...content, label: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Titre</label>
                  <input
                    type="text"
                    value={content.title || ''}
                    onChange={(e) => setContent({...content, title: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={content.subtitle || ''}
                    onChange={(e) => setContent({...content, subtitle: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Description</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => setContent({...content, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Texte du bouton</label>
                  <input
                    type="text"
                    value={content.buttonText || ''}
                    onChange={(e) => setContent({...content, buttonText: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Lien du bouton</label>
                  <input
                    type="text"
                    value={content.buttonLink || ''}
                    onChange={(e) => setContent({...content, buttonLink: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Image de fond</label>
                <ImageUploader
                  currentImage={content.backgroundImage || ''}
                  onImageSelect={(url) => setContent({...content, backgroundImage: url})}
                />
              </div>
            </div>
          )}

          {/* Instagram Section */}
          {activeSection === 'instagram' && (
            <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#3A3A3A]">Instagram</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={content.username || ''}
                    onChange={(e) => setContent({...content, username: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    placeholder="@evasstyl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">URL du profil</label>
                  <input
                    type="url"
                    value={content.profileUrl || ''}
                    onChange={(e) => setContent({...content, profileUrl: e.target.value})}
                    className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                    placeholder="https://instagram.com/evasstyl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Titre</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => setContent({...content, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Images (6 photos)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div key={index}>
                      <p className="text-xs text-[#6B6B6B] mb-2">Photo {index + 1}</p>
                      <ImageUploader
                        currentImage={content.images?.[index] || ''}
                        onImageSelect={(url) => {
                          const newImages = [...(content.images || ['', '', '', '', '', ''])];
                          newImages[index] = url;
                          setContent({...content, images: newImages});
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Testimonials Section */}
          {activeSection === 'testimonials' && (
            <div className="space-y-6">
              {/* Sub-header with add button */}
              <div className="flex items-center justify-between">
                <p className="text-[#6B6B6B]">
                  {testimonials.length} témoignage{testimonials.length > 1 ? 's' : ''} — prérempli avec les données affichées sur la page d'accueil
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#8B7355] text-white rounded-xl hover:bg-[#6D5942] transition-colors"
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>

              {testimonialsLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <Loader2 className="animate-spin text-[#8B7355]" size={40} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial._id}
                      className={`bg-white rounded-2xl p-6 border-2 transition-all shadow-sm ${
                        testimonial.isActive ? 'border-[#8B7355]' : 'border-[#E8E0D5] opacity-60'
                      }`}
                    >
                      {/* Avatar & Author */}
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#8B7355]"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-[#3A3A3A]">{testimonial.author}</h3>
                          <p className="text-xs text-[#6B6B6B]">{testimonial.role}</p>
                        </div>
                        <button
                          onClick={() => toggleActiveTestimonial(testimonial)}
                          className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                          title={testimonial.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {testimonial.isActive
                            ? <Eye size={18} className="text-[#8B7355]" />
                            : <EyeOff size={18} className="text-[#6B6B6B]" />
                          }
                        </button>
                      </div>

                      {/* Rating */}
                      <div className="flex gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={14} fill="#8B7355" className="text-[#8B7355]" />
                        ))}
                      </div>

                      {/* Text */}
                      <p className="text-sm text-[#6B6B6B] italic leading-relaxed mb-4 line-clamp-4">
                        “{testimonial.text}”
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-end pt-4 border-t border-[#E8E0D5] gap-2">
                        <button
                          onClick={() => handleOpenModal(testimonial)}
                          className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-[#8B7355]" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(testimonial._id)}
                          className="p-2 hover:bg-[#FDECEA] rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-[#C53030]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Create/Edit Modal */}
              {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[#3A3A3A]">
                        {editingTestimonial ? 'Modifier le témoignage' : 'Nouveau témoignage'}
                      </h2>
                      <button onClick={handleCloseModal} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                        <X size={20} />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Texte du témoignage *</label>
                        <textarea
                          value={formData.text}
                          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                          rows={4}
                          required
                          className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                          placeholder="La robe midi est absolument magnifique..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Auteur *</label>
                          <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                            placeholder="Sophie M."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Rôle</label>
                          <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                            placeholder="Cliente fidèle"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Avatar *</label>
                        <ImageUploader
                          currentImage={formData.avatar}
                          onImageSelect={(url) => setFormData({ ...formData, avatar: url })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Note</label>
                        <select
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>{r} étoile{r > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 text-[#8B7355] rounded"
                        />
                        <label htmlFor="isActive" className="text-sm text-[#3A3A3A]">Actif (visible sur le site)</label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="flex-1 px-4 py-2.5 bg-[#E8E0D5] text-[#3A3A3A] rounded-xl font-medium hover:bg-[#D1C7B7] transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2.5 bg-[#8B7355] text-white rounded-xl font-medium hover:bg-[#6D5942] transition-colors flex items-center justify-center gap-2"
                        >
                          <Save size={18} />
                          {editingTestimonial ? 'Mettre à jour' : 'Créer'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Produits à la une Section */}
          {activeSection === 'produits' && (
            <div className="space-y-8">
              {produitsLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <Loader2 className="animate-spin text-[#8B7355]" size={40} />
                </div>
              ) : (
                <>
                  {/* --- Bijoux Signature --- */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-[#8B7355] font-medium mb-1">Notre Sélection</p>
                        <h2 className="text-xl font-bold text-[#3A3A3A]">Bijoux <em className="italic">Signature</em></h2>
                      </div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${pinnedBijoux.length === 4 ? 'bg-[#8B7355] text-white' : 'bg-[#F5F1ED] text-[#6B6B6B]'}`}>
                        {pinnedBijoux.length}/4 sélectionnés
                      </span>
                    </div>

                    {/* Aperçu des produits actuellement affichés */}
                    {pinnedBijoux.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[#3A3A3A] mb-2 uppercase tracking-wide">Actuellement affichés sur la home :</p>
                        <div className="flex gap-3 flex-wrap">
                          {pinnedBijoux.map(id => {
                            const p = allProducts.find((x: any) => String(x._id || x.id) === id);
                            if (!p) return null;
                            return (
                              <div key={id} className="flex items-center gap-2 bg-[#F5F1ED] border border-[#8B7355]/30 rounded-xl px-3 py-2">
                                <img src={p.image || 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=60&q=70'} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                                <span className="text-xs font-medium text-[#3A3A3A] max-w-[100px] truncate">{p.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-[#6B6B6B]">Cliquez sur un produit pour le sélectionner / désélectionner. Maximum 4.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {allProducts.map(product => {
                        const id = String(product._id || product.id);
                        const isSelected = pinnedBijoux.includes(id);
                        return (
                          <button
                            key={id}
                            onClick={() => togglePinned(id, 'bijoux')}
                            className={`relative text-left rounded-xl border-2 overflow-hidden transition-all ${
                              isSelected
                                ? 'border-[#8B7355] shadow-md shadow-[#8B7355]/20'
                                : 'border-[#E8E0D5] hover:border-[#8B7355]/40'
                            } ${!isSelected && pinnedBijoux.length >= 4 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 z-10 bg-[#8B7355] rounded-full p-0.5">
                                <CheckCircle2 size={14} className="text-white" />
                              </div>
                            )}
                            <div className="aspect-square bg-[#F5F1ED] overflow-hidden">
                              <img
                                src={product.image || 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=200&q=70'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-medium text-[#3A3A3A] line-clamp-1">{product.name}</p>
                              <p className="text-xs text-[#8B7355] font-bold mt-0.5">{product.price?.toLocaleString('fr-FR')} FCFA</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* --- Pièces Phares --- */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E8E0D5] shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-[#8B7355] font-medium mb-1">Tendances</p>
                        <h2 className="text-xl font-bold text-[#3A3A3A]">Pièces <em className="italic">Phares</em> de la Saison</h2>
                      </div>
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${pinnedFeatured.length === 4 ? 'bg-[#8B7355] text-white' : 'bg-[#F5F1ED] text-[#6B6B6B]'}`}>
                        {pinnedFeatured.length}/4 sélectionnés
                      </span>
                    </div>

                    {/* Aperçu des produits actuellement affichés */}
                    {pinnedFeatured.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-[#3A3A3A] mb-2 uppercase tracking-wide">Actuellement affichés sur la home :</p>
                        <div className="flex gap-3 flex-wrap">
                          {pinnedFeatured.map(id => {
                            const p = allProducts.find((x: any) => String(x._id || x.id) === id);
                            if (!p) return null;
                            return (
                              <div key={id} className="flex items-center gap-2 bg-[#F5F1ED] border border-[#8B7355]/30 rounded-xl px-3 py-2">
                                <img src={p.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=60&q=70'} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                                <span className="text-xs font-medium text-[#3A3A3A] max-w-[100px] truncate">{p.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-[#6B6B6B]">Cliquez sur un produit pour le sélectionner / désélectionner. Maximum 4.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {allProducts.map(product => {
                        const id = String(product._id || product.id);
                        const isSelected = pinnedFeatured.includes(id);
                        return (
                          <button
                            key={id}
                            onClick={() => togglePinned(id, 'featured')}
                            className={`relative text-left rounded-xl border-2 overflow-hidden transition-all ${
                              isSelected
                                ? 'border-[#8B7355] shadow-md shadow-[#8B7355]/20'
                                : 'border-[#E8E0D5] hover:border-[#8B7355]/40'
                            } ${!isSelected && pinnedFeatured.length >= 4 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 z-10 bg-[#8B7355] rounded-full p-0.5">
                                <CheckCircle2 size={14} className="text-white" />
                              </div>
                            )}
                            <div className="aspect-square bg-[#F5F1ED] overflow-hidden">
                              <img
                                src={product.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&q=70'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-2">
                              <p className="text-xs font-medium text-[#3A3A3A] line-clamp-1">{product.name}</p>
                              <p className="text-xs text-[#8B7355] font-bold mt-0.5">{product.price?.toLocaleString('fr-FR')} FCFA</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
