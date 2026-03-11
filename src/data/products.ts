import type { Product, Category, Testimonial } from '../types';

export const categories: Category[] = [
  {
    id: 'robes',
    name: 'Robes',
    count: 24,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80'
  },
  {
    id: 'colliers',
    name: 'Colliers',
    count: 18,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'
  },
  {
    id: 'boucles',
    name: 'Boucles d\'oreilles',
    count: 32,
    image: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=600&q=80'
  },
  {
    id: 'manteaux',
    name: 'Manteaux & Vestes',
    count: 15,
    image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80'
  },
  {
    id: 'parures',
    name: 'Parures Complètes',
    count: 10,
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'
  }
];

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: 'Robe Florale Midi',
    brand: 'EvaStyl',
    price: 58000,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=533&fit=crop',
    category: 'robes',
    badge: 'new'
  },
  {
    id: 2,
    name: 'Collier Doré Perles',
    brand: 'Bijoux',
    price: 35000,
    oldPrice: 47000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=533&fit=crop',
    category: 'bijoux'
  },
  {
    id: 3,
    name: 'Blouse Satin Ivoire',
    brand: 'EvaStyl',
    price: 42000,
    oldPrice: 52000,
    image: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&h=533&fit=crop',
    category: 'hauts',
    badge: 'sale'
  },
  {
    id: 4,
    name: 'Bracelet Chaîne Or',
    brand: 'Bijoux',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=533&fit=crop',
    category: 'bijoux',
    badge: 'new'
  },
  {
    id: 9,
    name: 'Jupe Plissée Midi',
    brand: 'EvaStyl',
    price: 47000,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=533&fit=crop',
    category: 'jupes',
    badge: 'new'
  },
  {
    id: 10,
    name: 'Pantalon Large Lin',
    brand: 'EvaStyl',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=533&fit=crop',
    category: 'pantalons'
  },
  {
    id: 11,
    name: 'Chemisier Soie',
    brand: 'EvaStyl',
    price: 37000,
    oldPrice: 52000,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=533&fit=crop',
    category: 'hauts',
    badge: 'sale'
  },
  {
    id: 12,
    name: 'Manteau Long Camel',
    brand: 'EvaStyl',
    price: 118000,
    image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=400&h=533&fit=crop',
    category: 'manteaux'
  }
];

export const jewelryProducts: Product[] = [
  {
    id: 5,
    name: 'Bague Pierre Fine',
    brand: 'Bijoux',
    price: 63000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=533&fit=crop',
    category: 'bijoux'
  },
  {
    id: 6,
    name: 'Boucles Créoles Dorées',
    brand: 'Bijoux',
    price: 27000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=533&fit=crop',
    category: 'bijoux',
    badge: 'new'
  },
  {
    id: 7,
    name: 'Collier Solitaire',
    brand: 'Bijoux',
    price: 44000,
    oldPrice: 55000,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=533&fit=crop',
    category: 'bijoux'
  },
  {
    id: 8,
    name: 'Parure Luxe Dorée',
    brand: 'Bijoux',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1573408301185-9519e3f75bbe?w=400&h=533&fit=crop',
    category: 'bijoux',
    badge: 'bestseller'
  },
  {
    id: 13,
    name: 'Bracelet Jonc Or',
    brand: 'Bijoux',
    price: 34000,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=533&fit=crop',
    category: 'bijoux'
  },
  {
    id: 14,
    name: 'Chaîne Fine Perlée',
    brand: 'Bijoux',
    price: 31000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=533&fit=crop',
    category: 'bijoux',
    badge: 'bestseller'
  },
  {
    id: 15,
    name: 'Créoles Diamant',
    brand: 'Bijoux',
    price: 82000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=533&fit=crop',
    category: 'bijoux'
  },
  {
    id: 16,
    name: 'Bague Saphir',
    brand: 'Bijoux',
    price: 137000,
    image: 'https://images.unsplash.com/photo-1588444650700-c5886e354a76?w=400&h=533&fit=crop',
    category: 'bijoux'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    text: 'La robe midi est absolument magnifique, la qualité dépasse mes attentes. Je la porte à chaque occasion !',
    author: 'Sophie M.',
    role: 'Cliente fidèle',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c4c73b?w=80&h=80&fit=crop&crop=face',
    rating: 5
  },
  {
    id: 2,
    text: 'Les bijoux EvaStyl sont d\'une finesse extraordinaire. Le collier dorée est ma pièce préférée, je reçois des compliments partout.',
    author: 'Amina K.',
    role: 'Acheteuse vérifiée',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    rating: 5
  },
  {
    id: 3,
    text: 'Livraison ultra rapide et emballage soigné. On sent vraiment le soin apporté à chaque détail. Je recommande sans hésiter !',
    author: 'Clara D.',
    role: 'Nouvelle cliente',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    rating: 5
  }
];
