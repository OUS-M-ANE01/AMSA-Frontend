import Hero from '../components/sections/Hero';
import TrustStrip from '../components/sections/TrustStrip';
import Categories from '../components/sections/Categories';
import FeaturedProducts from '../components/sections/FeaturedProducts';
import Banner from '../components/sections/Banner';
import JewelryProducts from '../components/sections/JewelryProducts';
import Testimonials from '../components/sections/Testimonials';
import Instagram from '../components/sections/Instagram';
import Newsletter from '../components/sections/Newsletter';
import WhatsAppPopup from '../components/WhatsAppPopup';

interface HomeProps {
  onNavigate: (page: string) => void;
  onAddToCart?: (productId: string | number) => void;
  onToggleFavorite?: (productId: string | number) => void;
  favoriteItems?: number[];
}

export default function Home({ onNavigate, onAddToCart, onToggleFavorite, favoriteItems }: HomeProps) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <TrustStrip />
      <Categories onNavigate={onNavigate} />
      <FeaturedProducts 
        onNavigate={onNavigate}
        onAddToCart={onAddToCart}
        onToggleFavorite={onToggleFavorite}
        favoriteItems={favoriteItems}
      />
      <Banner onNavigate={onNavigate} />
      <JewelryProducts 
        onNavigate={onNavigate}
        onAddToCart={onAddToCart}
        onToggleFavorite={onToggleFavorite}
        favoriteItems={favoriteItems}
      />
      <Testimonials />
      <Instagram />
      <Newsletter />
      <WhatsAppPopup />
    </>
  );
}
