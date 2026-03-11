import { useEffect } from 'react';
import { adminAPI, ordersAPI } from '../services/api';
import { useAdminStore } from '../stores/adminStore';

const STATS_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache pour les stats
const SALES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache pour les ventes

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: Array<{
    _id: string;
    name: string;
    image: string;
    price: number;
    sales: number;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    image: string;
    stock: number;
  }>;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    user: { prenom: string; nom: string };
    total: number;
    status: string;
    createdAt: string;
    isPaid: boolean;
  }>;
}

export const useAdmin = () => {
  const { 
    stats, 
    statsLastUpdated,
    salesData, 
    salesPeriod,
    salesLastUpdated,
    isLoadingStats,
    isLoadingSales,
    error,
    setStats,
    setSalesData,
    setLoadingStats,
    setLoadingSales,
    setError,
    invalidateStatsCache,
    invalidateSalesCache
  } = useAdminStore();

  const fetchStats = async (forceRefresh = false) => {
    // Utiliser le cache si disponible et valide (sauf si forceRefresh)
    if (!forceRefresh && statsLastUpdated && Date.now() - statsLastUpdated < STATS_CACHE_DURATION) {
      console.log('📊 Utilisation du cache pour les stats admin');
      return;
    }

    setLoadingStats(true);
    setError(null);
    
    try {
      const response = await adminAPI.getStats();
      const backendData = response.data.data;
      
      // Mapper les données du backend vers la structure attendue par le frontend
      const mappedData: Stats = {
        totalUsers: backendData.overview.totalUsers,
        totalProducts: backendData.overview.totalProducts,
        totalOrders: backendData.overview.totalOrders,
        totalRevenue: backendData.overview.totalRevenue,
        topProducts: backendData.topProducts || [],
        lowStockProducts: backendData.lowStockProducts || [],
        recentOrders: backendData.recentOrders || [],
      };
      
      setStats(mappedData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement');
      setLoadingStats(false);
    }
  };

  const fetchSalesData = async (period: 'week' | 'month' | 'year', forceRefresh = false) => {
    // Utiliser le cache si la période est la même et le cache est valide
    if (!forceRefresh && 
        salesPeriod === period && 
        salesLastUpdated && 
        Date.now() - salesLastUpdated < SALES_CACHE_DURATION) {
      console.log(`📈 Utilisation du cache pour les ventes (${period})`);
      return { success: true, data: salesData };
    }

    setLoadingSales(true);
    
    try {
      const response = await adminAPI.getSalesData(period);
      setSalesData(response.data.data, period);
      return { success: true, data: response.data.data };
    } catch (err: any) {
      setLoadingSales(false);
      return {
        success: false,
        error: err.response?.data?.message || 'Erreur lors du chargement',
      };
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      await fetchStats(true); // Force refresh après modification
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Erreur lors de la mise à jour',
      };
    }
  };

  const markOrderAsPaid = async (orderId: string) => {
    try {
      await ordersAPI.markAsPaid(orderId);
      await fetchStats(true); // Force refresh après modification
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || 'Erreur',
      };
    }
  };

  // Charger les stats au montage initial (avec cache)
  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stats,
    salesData,
    loading: isLoadingStats || isLoadingSales,
    error,
    fetchStats: (forceRefresh?: boolean) => fetchStats(forceRefresh || false),
    fetchSalesData,
    updateOrderStatus,
    markOrderAsPaid,
    invalidateCache: () => {
      invalidateStatsCache();
      invalidateSalesCache();
    },
  };
};
