import { useEffect, useCallback } from 'react';
import { useOrdersStore } from '../stores/ordersStore';
import { useProductsStore } from '../stores/productsStore';
import { useAuthStore } from '../stores/authStore';
import { adminAPI, productsAPI } from '../services/api';
import { prefetchRoutes } from '../config/performance';

// Hook pour prefetcher les données des routes fréquemment visitées
export const usePrefetch = (currentPage: string) => {
  const { setOrders } = useOrdersStore();
  const { setProducts } = useProductsStore();
  const { user } = useAuthStore();

  const prefetchData = useCallback(async (page: string) => {
    // Ne prefetch que si l'utilisateur est admin
    if (user?.role !== 'admin') return;

    try {
      switch (page) {
        case 'admin-orders':
          const ordersRes = await adminAPI.getAllOrders();
          if (ordersRes.data.success) {
            setOrders(ordersRes.data.data);
          }
          break;
          
        case 'admin-products':
          const productsRes = await productsAPI.getAll();
          if (productsRes.data.success) {
            setProducts(productsRes.data.data);
          }
          break;
      }
    } catch (error) {
      console.log('Prefetch échoué pour:', page);
    }
  }, [user, setOrders, setProducts]);

  useEffect(() => {
    // Prefetch les pages liées après un délai
    const pagesToPrefetch = prefetchRoutes[currentPage as keyof typeof prefetchRoutes];
    
    if (pagesToPrefetch && pagesToPrefetch.length > 0) {
      const timer = setTimeout(() => {
        pagesToPrefetch.forEach(page => {
          prefetchData(page);
        });
      }, 2000); // 2 secondes après le chargement de la page

      return () => clearTimeout(timer);
    }
  }, [currentPage, prefetchData]);
};

// Hook pour invalidater le cache et rafraîchir les données
export const useInvalidateCache = () => {
  const { invalidateCache: invalidateOrders } = useOrdersStore();
  const { invalidateCache: invalidateProducts } = useProductsStore();

  return {
    invalidateOrders,
    invalidateProducts,
    invalidateAll: () => {
      invalidateOrders();
      invalidateProducts();
    },
  };
};
