import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../services/api';
import { useProductsStore } from '../stores/productsStore';
import { cacheConfig } from '../config/performance';

const CACHE_DURATION = cacheConfig.categories; // 30 minutes

export const useCategories = () => {
  const { categories, setCategories, lastUpdated } = useProductsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (force = false) => {
    // Check cache validity
    const now = Date.now();
    const isCacheValid = lastUpdated && (now - lastUpdated) < CACHE_DURATION;

    if (!force && categories.length > 0 && isCacheValid) {
      console.log('📦 Using cached categories');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Fetching categories from API...');
      const response = await categoriesAPI.getAll();
      
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement des catégories');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur de chargement';
      setError(errorMessage);
      console.error('❌ Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [categories.length, lastUpdated, setCategories]);

  // Auto-fetch on mount if cache is invalid
  useEffect(() => {
    const now = Date.now();
    const isCacheValid = lastUpdated && (now - lastUpdated) < CACHE_DURATION;
    
    if (categories.length === 0 || !isCacheValid) {
      fetchCategories();
    }
  }, []);

  const refetch = useCallback(() => {
    return fetchCategories(true);
  }, [fetchCategories]);

  const getCategoryById = useCallback((id: string) => {
    return categories.find(cat => cat._id === id || cat.id === id);
  }, [categories]);

  const getCategoryByName = useCallback((name: string) => {
    return categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
  }, [categories]);

  const getActiveCategories = useCallback(() => {
    return categories.filter(cat => cat.isActive !== false);
  }, [categories]);

  return {
    categories,
    isLoading,
    error,
    refetch,
    getCategoryById,
    getCategoryByName,
    getActiveCategories,
  };
};
