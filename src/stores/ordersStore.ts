import { create } from 'zustand';

interface Order {
  _id: string;
  user: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
  };
  items: any[];
  status: 'en-attente' | 'confirmee' | 'en-preparation' | 'expediee' | 'livree' | 'annulee';
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  lastUpdated: number | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  setLoading: (isLoading: boolean) => void;
  invalidateCache: () => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  isLoading: false,
  lastUpdated: null,

  setOrders: (orders) => {
    set({
      orders,
      lastUpdated: Date.now(),
      isLoading: false,
    });
  },

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
      lastUpdated: Date.now(),
    }));
  },

  updateOrder: (orderId, updates) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, ...updates } : order
      ),
      lastUpdated: Date.now(),
    }));
  },

  removeOrder: (orderId) => {
    set((state) => ({
      orders: state.orders.filter((order) => order._id !== orderId),
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
