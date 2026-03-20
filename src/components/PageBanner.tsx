import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PageBannerData {
  page: string;
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

interface PageBannerProps {
  page: 'soldes' | 'vetements' | 'bijoux' | 'apropos' | 'contact';
  onNavigate?: (page: string) => void;
}

export default function PageBanner({ page, onNavigate }: PageBannerProps) {
  const [banner, setBanner] = useState<PageBannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, [page]);

  const fetchBanner = async () => {
    try {
      const response = await axios.get(`${API_URL}/page-banners/${page}`);
      if (response.data.success) {
        setBanner(response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la bannière:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative h-[45vh] flex items-center justify-center bg-[#2C2C2C]">
        <div className="animate-pulse text-white">Chargement...</div>
      </div>
    );
  }

  if (!banner || !banner.isActive) {
    // Bannière par défaut si aucune n'est trouvée
    return (
      <div className="relative h-[45vh] flex flex-col items-center justify-center overflow-hidden bg-[#2C2C2C]">
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </h1>
        </div>
      </div>
    );
  }

  const handleButtonClick = () => {
    if (banner.buttonLink && onNavigate) {
      onNavigate(banner.buttonLink);
    } else if (banner.buttonLink) {
      window.location.href = banner.buttonLink;
    }
  };

  return (
    <div
      className="relative h-[45vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: banner.backgroundColor || '#2C2C2C' }}
    >
      {/* Image de fond */}
      {banner.imageUrl && (
        <>
          <img
            src={banner.imageUrl}
            alt={banner.imageAlt || banner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: banner.backgroundColor || '#2C2C2C',
              opacity: banner.overlayOpacity || 0.3,
            }}
          />
        </>
      )}

      {/* Contenu */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Titre */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in"
          style={{ color: banner.textColor || '#FFFFFF' }}
        >
          {banner.title}
        </h1>

        {/* Sous-titre */}
        {banner.subtitle && (
          <p
            className="text-xl md:text-2xl lg:text-3xl mb-6 animate-fade-in-delay"
            style={{ color: banner.textColor || '#FFFFFF' }}
          >
            {banner.subtitle}
          </p>
        )}

        {/* Description */}
        {banner.description && (
          <p
            className="text-sm md:text-base lg:text-lg mb-8 max-w-2xl mx-auto animate-fade-in-delay-2"
            style={{ color: banner.textColor || '#FFFFFF', opacity: 0.9 }}
          >
            {banner.description}
          </p>
        )}

        {/* Bouton */}
        {banner.buttonText && banner.buttonLink && (
          <button
            onClick={handleButtonClick}
            className="px-8 py-3 bg-[#8B7355] text-white rounded-lg hover:bg-[#6D5942] transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-3"
          >
            {banner.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
