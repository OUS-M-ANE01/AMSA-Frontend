import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

export const useFavorites = () => {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const favoriteIds = user?.favoris || [];

  const isFavorite = useCallback((productId: string | number) => {
    const id = String(productId);
    return favoriteIds.includes(id);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (productId: string | number) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter aux favoris');
      return false;
    }

    const id = String(productId);
    const wasFavorite = isFavorite(id);
    
    // Optimistic update
    const newFavorites = wasFavorite
      ? favoriteIds.filter((fav: string) => fav !== id)
      : [...favoriteIds, id];
    
    updateUser({ ...user, favoris: newFavorites });

    setIsLoading(true);
    
    try {
      await authAPI.toggleFavorite(id);
      
      toast.success(
        wasFavorite 
          ? 'Retiré des favoris' 
          : 'Ajouté aux favoris',
        { duration: 2000 }
      );
      
      return true;
    } catch (error: any) {
      // Revert on error
      updateUser({ ...user, favoris: favoriteIds });
      
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour';
      toast.error(errorMessage);
      console.error('Error toggling favorite:', error);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, favoriteIds, isFavorite, updateUser]);

  const addFavorite = useCallback(async (productId: string | number) => {
    const id = String(productId);
    if (!isFavorite(id)) {
      return toggleFavorite(id);
    }
    return true;
  }, [isFavorite, toggleFavorite]);

  const removeFavorite = useCallback(async (productId: string | number) => {
    const id = String(productId);
    if (isFavorite(id)) {
      return toggleFavorite(id);
    }
    return true;
  }, [isFavorite, toggleFavorite]);

  const clearAllFavorites = useCallback(async () => {
    if (!user || favoriteIds.length === 0) return;

    const promises = favoriteIds.map((id: string) => toggleFavorite(id));
    await Promise.all(promises);
    
    toast.success('Tous les favoris ont été retirés');
  }, [user, favoriteIds, toggleFavorite]);

  return {
    favoriteIds,
    favoritesCount: favoriteIds.length,
    isLoading,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearAllFavorites,
  };
};
