// Configuration globale pour l'optimisation des performances

export const cacheConfig = {
  // Durées de cache (en ms)
  products: 5 * 60 * 1000, // 5 minutes
  orders: 2 * 60 * 1000, // 2 minutes
  users: 5 * 60 * 1000, // 5 minutes
  categories: 30 * 60 * 1000, // 30 minutes (rarement modifiées)
  settings: 10 * 60 * 1000, // 10 minutes
  testimonials: 10 * 60 * 1000, // 10 minutes
  content: 15 * 60 * 1000, // 15 minutes
};

export const apiConfig = {
  // Timeout pour les requêtes API (en ms)
  timeout: 15000,
  
  // Configuration du retry
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryOn: [408, 429, 500, 502, 503, 504], // Status codes à retry
  },
};

export const socketConfig = {
  // Configuration Socket.IO
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
};

export const performanceConfig = {
  // Lazy loading
  lazyLoadDelay: 100, // Délai avant chargement lazy (ms)
  
  // Prefetching
  enablePrefetch: true,
  prefetchDelay: 2000, // Délai avant prefetch (ms)
  
  // Image optimization
  imageQuality: 85,
  imagePlaceholder: 'blur',
  
  // Debounce/Throttle
  searchDebounce: 300, // Délai pour la recherche (ms)
  scrollThrottle: 100, // Délai pour le scroll (ms)
};

// Routes à prefetch pour améliorer la navigation
export const prefetchRoutes = {
  'admin-dashboard': ['admin-orders', 'admin-products'],
  'admin-products': ['admin-orders'],
  'admin-orders': ['admin-users'],
};
