import { useAdminStore } from '../stores/adminStore';

export const clearAdminCache = () => {
  const { invalidateStatsCache, invalidateSalesCache } = useAdminStore.getState();
  
  // Invalider les caches
  invalidateStatsCache();
  invalidateSalesCache();
  
  // Vider le localStorage si nécessaire
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('admin')) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log('🧹 Cache admin vidé');
  
  // Recharger la page
  window.location.reload();
};
