// SectionBanner.tsx
interface SectionBannerProps {
  imageUrl?: string;
  alt?: string;
}

export default function SectionBanner({ imageUrl = '/asma-a.jpeg', alt = 'Bannière' }: SectionBannerProps) {
  return (
    <section className="w-full py-8 md:py-14 flex justify-center items-center bg-cream">
      <div className="w-full max-w-5xl px-4 md:px-0 ">
        <img 
          src={imageUrl} 
          alt={alt} 
          className="w-full rounded-lg shadow-md object-cover max-h-[220px] md:max-h-[420px] mx-auto" 
        />
      </div>
    </section>
  );
}
