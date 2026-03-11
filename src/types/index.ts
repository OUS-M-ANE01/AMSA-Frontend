export interface Product {
  _id?: string;
  id: number | string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  badge?: 'new' | 'sale' | 'bestseller';
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  image: string;
  badge?: string;
}

export interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}
