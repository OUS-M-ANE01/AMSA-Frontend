import { useEffect } from 'react';
import { useProductsStore } from '../stores/productsStore';
import { productsAPI, categoriesAPI } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useProducts = () => {
  const { products, isLoading, lastUpdated, setProducts, setLoading, invalidateCache } = useProductsStore();

  useEffect(() => {
    const fetchProducts = async () => {
      // Vérifier si les données sont en cache et encore valides
      if (lastUpdated && Date.now() - lastUpdated < CACHE_DURATION) {
        console.log('🛍️ Utilisation du cache pour les produits');
        return;
      }

      setLoading(true);
      try {
        const response = await productsAPI.getAll();
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [lastUpdated, setProducts, setLoading]);

  return {
    products,
    isLoading,
    refetch: invalidateCache,
  };
};

export const useCategories = () => {
  const { categories, setCategories } = useProductsStore();

  useEffect(() => {
    const fetchCategories = async () => {
      if (categories.length > 0) {
        console.log('📁 Utilisation du cache pour les catégories');
        return;
      }

      try {
        const response = await categoriesAPI.getAll();
        const data = response.data?.data || response.data || [];
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };

    fetchCategories();
  }, [categories.length, setCategories]);

  return { categories };
};
