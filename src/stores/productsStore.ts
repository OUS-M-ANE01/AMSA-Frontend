import { create } from 'zustand';

interface Category {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  image?: string;
  count?: number;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string | Category;
  image: string;
  images: string[];
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  sales: number;
  badge?: 'new' | 'sale' | 'bestseller' | '';
  views?: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductsState {
  products: Product[];
  categories: any[];
  isLoading: boolean;
  lastUpdated: number | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: any[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;
  setLoading: (isLoading: boolean) => void;
  invalidateCache: () => void;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  categories: [],
  isLoading: false,
  lastUpdated: null,

  setProducts: (products) => {
    set({
      products,
      lastUpdated: Date.now(),
      isLoading: false,
    });
  },

  setCategories: (categories) => {
    set({ categories });
  },

  addProduct: (product) => {
    set((state) => ({
      products: [product, ...state.products],
      lastUpdated: Date.now(),
    }));
  },

  updateProduct: (productId, updates) => {
    set((state) => ({
      products: state.products.map((product) =>
        product._id === productId ? { ...product, ...updates } : product
      ),
      lastUpdated: Date.now(),
    }));
  },

  removeProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
      lastUpdated: Date.now(),
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  invalidateCache: () => {
    set({ lastUpdated: null });
  },
}));
