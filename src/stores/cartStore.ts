import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.productId);
        
        if (existingItem) {
          // Item exists, update quantity
          set({
            items: items.map(item =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            ),
            // isOpen: true, // Auto-open disabled - toast notification instead
          });
        } else {
          // New item
          set({
            items: [...items, { ...product, quantity: product.quantity || 1 }],
            // isOpen: true, // Auto-open disabled
          });
        }
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], isOpen: false });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find(i => i.productId === productId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'asma-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen
    }
  )
);
