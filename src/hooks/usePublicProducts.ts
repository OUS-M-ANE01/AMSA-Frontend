import { useState, useCallback } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import type { Product, Category } from '../types';

// Images de fallback si la catégorie n'en a pas
const FALLBACK_IMAGES: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
};

export function adaptApiProduct(p: any): Product {
  return {
    _id: p._id,
    id: p._id,
    name: p.name,
    brand: p.brand || 'ASMA',
    price: p.price,
    oldPrice: p.oldPrice,
    image: p.image || (p.images && p.images[0]) || '',
    category: typeof p.category === 'object' ? (p.category?.name || '') : (p.category || ''),
    badge: p.badge || undefined,
    description: p.description,
  };
}

export function adaptApiCategory(c: any): Category {
  return {
    id: c._id,
    name: c.name,
    count: c.count ?? c.productCount ?? 0,
    image: c.image || FALLBACK_IMAGES.default,
  };
}

export function usePublicProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    sort?: string;
    search?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getAll({ limit: 100, ...params });
      const data = response.data?.data || response.data || [];
      const arr = Array.isArray(data) ? data : [];
      setProducts(arr.map(adaptApiProduct));
    } catch (err) {
      setError('Impossible de charger les produits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.getAll();
      const data = response.data?.data || response.data || [];
      const arr = Array.isArray(data) ? data : [];
      setCategories(arr.filter((c: any) => c.isActive !== false).map(adaptApiCategory));
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await productsAPI.getById(id);
      const p = response.data?.data || response.data;
      return p ? adaptApiProduct(p) : null;
    } catch {
      return null;
    }
  }, []);

  return { products, categories, loading, error, fetchProducts, fetchCategories, fetchProductById };
}
