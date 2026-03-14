import { useState, useEffect } from 'react';
import { Instagram as InstagramIcon } from 'lucide-react';
import { adminAPI } from '../../services/api';

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
];

export default function Instagram() {
  const [c, setC] = useState<any>({});

  useEffect(() => {
    adminAPI.getContentBySection('instagram')
      .then(res => {
        const data = res.data?.data?.content || res.data?.data;
        if (data && Object.keys(data).length > 0) setC(data);
      })
      .catch(() => {});
  }, []);

  const username = c.username || '@evasstyl';
  const title = c.title || 'Notre univers sur Instagram';
  const profileUrl = c.profileUrl || 'https://instagram.com/evasstyl';
  const images: string[] =
    Array.isArray(c.images) && c.images.filter(Boolean).length > 0
      ? [...c.images, ...DEFAULT_IMAGES].slice(0, 6)
      : DEFAULT_IMAGES;

  return (
    <section className="px-4 md:px-8 lg:px-14 py-12 md:py-20 bg-warm-white">
      <div>
        <div className="text-center mb-8 md:mb-12">
          <div className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-gold font-medium mb-3">
            {username}
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[clamp(32px,4vw,52px)] font-light leading-tight text-charcoal">
            {title}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {images.map((img, index) => (
          <a
            key={index}
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden rounded-md group cursor-pointer"
          >
            <img
              src={img}
              alt={`Instagram ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                <InstagramIcon size={28} className="text-white" strokeWidth={1.5} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
