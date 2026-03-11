import { useEffect } from 'react';
import { useOrdersStore } from '../stores/ordersStore';
import { adminAPI } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOrders = () => {
  const { orders, isLoading, lastUpdated, setOrders, setLoading, invalidateCache } = useOrdersStore();

  useEffect(() => {
    const fetchOrders = async () => {
      // Vérifier si les données sont en cache et encore valides
      if (lastUpdated && Date.now() - lastUpdated < CACHE_DURATION) {
        console.log('📦 Utilisation du cache pour les commandes');
        return;
      }

      setLoading(true);
      try {
        const response = await adminAPI.getAllOrders();
        if (response.data.success) {
          setOrders(response.data.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [lastUpdated, setOrders, setLoading]);

  return {
    orders,
    isLoading,
    refetch: invalidateCache,
  };
};
