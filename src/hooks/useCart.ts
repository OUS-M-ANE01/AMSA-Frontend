import { useCartStore } from '../stores/cartStore';

export const useCart = () => {
  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
    getItemQuantity,
  } = useCartStore();

  // Helper function to add product with minimal data
  const addToCart = (product: {
    _id?: string;
    id?: number | string;
    name: string;
    price: number;
    image: string;
    category?: string;
  }, quantity: number = 1) => {
    // Support both _id (backend) and id (frontend static data)
    const productId = product._id || String(product.id);
    
    addItem({
      productId,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity,
    });
  };

  return {
    // State
    items,
    isOpen,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),

    // Actions
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getItemQuantity,
  };
};
