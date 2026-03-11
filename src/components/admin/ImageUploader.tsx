import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Search, Loader2, Image as ImageIcon, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  currentImage: string;
  onImageSelect: (url: string) => void;
}

export default function ImageUploader({ currentImage, onImageSelect }: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'upload' | 'unsplash'>('url');
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [unsplashQuery, setUnsplashQuery] = useState('');
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload vers Cloudinary via notre API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille de l\'image ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/upload/single',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        const uploadedUrl = response.data.data.url;
        setImageUrl(uploadedUrl);
        onImageSelect(uploadedUrl);
        toast.success('Image uploadée avec succès');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Recherche Unsplash
  const searchUnsplash = async () => {
    if (!unsplashQuery.trim()) return;

    setIsSearching(true);
    try {
      const unsplashKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
      
      // Si clé Unsplash configurée
      if (unsplashKey && unsplashKey !== 'your_unsplash_access_key_here') {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: unsplashQuery,
              per_page: 12,
              orientation: 'portrait'
            },
            headers: {
              'Authorization': `Client-ID ${unsplashKey}`
            }
          }
        );
        setUnsplashImages(response.data.results);
      } else {
        // Fallback avec Pexels si configuré
        const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY;
        
        if (pexelsKey && pexelsKey !== 'your_pexels_api_key_here') {
          const response = await axios.get(
            `https://api.pexels.com/v1/search`,
            {
              params: {
                query: unsplashQuery,
                per_page: 12,
                orientation: 'portrait'
              },
              headers: {
                'Authorization': pexelsKey
              }
            }
          );
          
          // Mapper les résultats Pexels au format Unsplash
          const mappedResults = response.data.photos.map((photo: any) => ({
            id: photo.id,
            urls: {
              regular: photo.src.large,
              thumb: photo.src.medium
            },
            user: {
              name: photo.photographer
            }
          }));
          
          setUnsplashImages(mappedResults);
        } else {
          // Aucune clé API configurée
          toast.error('Veuillez configurer une clé API (Unsplash ou Pexels) dans le fichier .env');
        }
      }
    } catch (error: any) {
      console.error('Erreur recherche images:', error);
      if (error.response?.status === 401) {
        toast.error('Clé API invalide. Vérifiez votre configuration .env');
      } else {
        toast.error('Erreur lors de la recherche d\'images');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const selectUnsplashImage = (imageUrl: string) => {
    setImageUrl(imageUrl);
    onImageSelect(imageUrl);
    toast.success('Image sélectionnée');
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E8E0D5]">
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'url'
              ? 'text-[#8B7355]'
              : 'text-[#6B6B6B] hover:text-[#3A3A3A]'
          }`}
        >
          <LinkIcon size={16} className="inline mr-2" />
          URL
          {activeTab === 'url' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B7355]"></div>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'upload'
              ? 'text-[#8B7355]'
              : 'text-[#6B6B6B] hover:text-[#3A3A3A]'
          }`}
        >
          <Upload size={16} className="inline mr-2" />
          Upload
          {activeTab === 'upload' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B7355]"></div>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('unsplash')}
          className={`px-4 py-2 font-medium transition-colors relative ${
            activeTab === 'unsplash'
              ? 'text-[#8B7355]'
              : 'text-[#6B6B6B] hover:text-[#3A3A3A]'
          }`}
        >
          <ImageIcon size={16} className="inline mr-2" />
          Unsplash
          {activeTab === 'unsplash' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B7355]"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {/* URL Tab */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                onImageSelect(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none"
            />
            {imageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-[#E8E0D5]">
                <img
                  src={imageUrl}
                  alt="Aperçu"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+invalide';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full border-2 border-dashed border-[#D4C4B0] rounded-lg p-8 hover:border-[#8B7355] transition-colors flex flex-col items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 size={48} className="text-[#8B7355] animate-spin" />
                  <span className="text-[#6B6B6B]">Upload en cours...</span>
                </>
              ) : (
                <>
                  <Upload size={48} className="text-[#8B7355]" />
                  <div className="text-center">
                    <p className="text-[#3A3A3A] font-medium">Cliquez pour uploader</p>
                    <p className="text-sm text-[#6B6B6B] mt-1">JPG, PNG, WEBP (max 5MB)</p>
                  </div>
                </>
              )}
            </button>
            {imageUrl && (
              <div className="mt-4 relative rounded-lg overflow-hidden border border-[#E8E0D5]">
                <img
                  src={imageUrl}
                  alt="Image uploadée"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    onImageSelect('');
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Unsplash Tab */}
        {activeTab === 'unsplash' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={unsplashQuery}
                onChange={(e) => setUnsplashQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUnsplash()}
                placeholder="Rechercher des images (ex: fashion, jewelry)..."
                className="flex-1 px-4 py-2 border border-[#D4C4B0] rounded-lg focus:ring-2 focus:ring-[#8B7355] focus:outline-none"
              />
              <button
                type="button"
                onClick={searchUnsplash}
                disabled={isSearching}
                className="px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] disabled:opacity-50 flex items-center gap-2"
              >
                {isSearching ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
                Rechercher
              </button>
            </div>

            {unsplashImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                {unsplashImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => selectUnsplashImage(image.urls.regular)}
                    className="relative group rounded-lg overflow-hidden border-2 border-transparent hover:border-[#8B7355] transition-all"
                  >
                    <img
                      src={image.urls.thumb}
                      alt={`Photo par ${image.user.name}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-medium">Sélectionner</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : unsplashQuery && !isSearching ? (
              <p className="text-center text-[#6B6B6B] py-8">
                Aucune image trouvée. Essayez une autre recherche.
              </p>
            ) : (
              <p className="text-center text-[#6B6B6B] py-8">
                Recherchez des images de haute qualité sur Unsplash
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
