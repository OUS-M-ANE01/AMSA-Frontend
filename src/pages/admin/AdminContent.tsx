import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Save, Loader2, Home, ImageIcon, Instagram as InstagramIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type Section = 'hero' | 'banner' | 'instagram';

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState<Section>('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    fetchContent(activeSection);
  }, [activeSection]);

  const fetchContent = async (section: Section) => {
    setLoading(true);
    try {
      const response = await adminAPI.getContentBySection(section);
      setContent(response.data.data.content);
    } catch (error) {
      toast.error('Erreur lors du chargement');
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

  const tabs = [
    { id: 'hero' as Section, label: 'Section Hero', icon: Home },
    { id: 'banner' as Section, label: 'Banner', icon: ImageIcon },
    { id: 'instagram' as Section, label: 'Instagram', icon: InstagramIcon }
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
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#8B7355] text-white rounded-xl hover:bg-[#6D5942] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
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
                
                <div>
                  <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Titre principal</label>
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
                        <input
                          type="url"
                          placeholder="URL de l'image"
                          value={img.url || ''}
                          onChange={(e) => {
                            const newImages = [...content.images];
                            newImages[index].url = e.target.value;
                            setContent({...content, images: newImages});
                          }}
                          className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                        />
                      </div>
                      <div>
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
                    {img.url && (
                      <img src={img.url} alt={img.label} className="mt-2 w-32 h-40 object-cover rounded-lg" />
                    )}
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
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Image de fond (URL)</label>
                <input
                  type="url"
                  value={content.backgroundImage || ''}
                  onChange={(e) => setContent({...content, backgroundImage: e.target.value})}
                  className="w-full px-4 py-2.5 border border-[#E8E0D5] rounded-xl focus:border-[#8B7355] focus:outline-none"
                />
                {content.backgroundImage && (
                  <img src={content.backgroundImage} alt="Banner" className="mt-2 w-full h-48 object-cover rounded-lg" />
                )}
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
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Images (6 images)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div key={index}>
                      <input
                        type="url"
                        placeholder={`Image ${index + 1}`}
                        value={content.images?.[index] || ''}
                        onChange={(e) => {
                          const newImages = [...(content.images || [])];
                          newImages[index] = e.target.value;
                          setContent({...content, images: newImages});
                        }}
                        className="w-full px-3 py-2 border border-[#E8E0D5] rounded-lg focus:border-[#8B7355] focus:outline-none text-sm mb-2"
                      />
                      {content.images?.[index] && (
                        <img src={content.images[index]} alt={`Insta ${index + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
