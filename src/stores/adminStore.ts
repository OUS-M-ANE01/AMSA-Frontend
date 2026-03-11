import { create } from 'zustand';

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

interface AdminState {
  stats: Stats | null;
  statsLastUpdated: number | null;
  salesData: any[];
  salesPeriod: 'week' | 'month' | 'year';
  salesLastUpdated: number | null;
  isLoadingStats: boolean;
  isLoadingSales: boolean;
  error: string | null;
  
  // Actions
  setStats: (stats: Stats) => void;
  setSalesData: (data: any[], period: 'week' | 'month' | 'year') => void;
  setLoadingStats: (loading: boolean) => void;
  setLoadingSales: (loading: boolean) => void;
  setError: (error: string | null) => void;
  invalidateStatsCache: () => void;
  invalidateSalesCache: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  statsLastUpdated: null,
  salesData: [],
  salesPeriod: 'week',
  salesLastUpdated: null,
  isLoadingStats: false,
  isLoadingSales: false,
  error: null,

  setStats: (stats) => set({ 
    stats, 
    statsLastUpdated: Date.now(),
    isLoadingStats: false,
    error: null 
  }),

  setSalesData: (data, period) => set({ 
    salesData: data,
    salesPeriod: period,
    salesLastUpdated: Date.now(),
    isLoadingSales: false,
    error: null 
  }),

  setLoadingStats: (loading) => set({ isLoadingStats: loading }),
  
  setLoadingSales: (loading) => set({ isLoadingSales: loading }),
  
  setError: (error) => set({ error }),

  invalidateStatsCache: () => set({ statsLastUpdated: null }),
  
  invalidateSalesCache: () => set({ salesLastUpdated: null }),
}));
