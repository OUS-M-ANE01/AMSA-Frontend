import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const isDev = import.meta.env.DEV;

// Instance Axios avec configuration de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 secondes timeout
});

// Compteur pour les retry
const retryConfig = {
  maxRetries: 3,
  retryDelay: 1000,
};

// Fonction pour attendre avant retry
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en développement
    if (isDev) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    // Log en développement
    if (isDev) {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Gestion du token expiré (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Déconnexion de l'utilisateur
      const { logout } = useAuthStore.getState();
      logout();
      
      // Redirection vers la page d'accueil
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin-login';
      }
      
      return Promise.reject(error);
    }

    // Retry automatique pour les erreurs réseau (pas de réponse du serveur)
    if (!error.response && originalRequest && !originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (
      !error.response &&
      originalRequest &&
      originalRequest._retryCount < retryConfig.maxRetries
    ) {
      originalRequest._retryCount++;
      
      if (isDev) {
        console.log(
          `🔄 Retry ${originalRequest._retryCount}/${retryConfig.maxRetries} pour ${originalRequest.url}`
        );
      }

      await delay(retryConfig.retryDelay * originalRequest._retryCount);
      return api(originalRequest);
    }

    // Log des erreurs en développement
    if (isDev) {
      console.error('❌ Erreur API:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// ============= AUTH =============
export const authAPI = {
  register: (data: {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    telephone?: string;
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),

  getMe: () => api.get('/auth/me'),

  updateProfile: (data: {
    prenom?: string;
    nom?: string;
    telephone?: string;
    dateNaissance?: string;
    adresse?: string;
  }) => api.put('/auth/profile', data),

  updatePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/password', { currentPassword, newPassword }),

  toggleFavorite: (productId: string) =>
    api.post(`/auth/favoris/${productId}`),
};

// ============= PRODUCTS =============
export const productsAPI = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    badge?: string;
    sortBy?: string;
  }) => api.get('/products', { params }),

  getById: (id: string) => api.get(`/products/${id}`),

  getFeatured: () => api.get('/products/featured'),

  create: (data: any) => api.post('/products', data),

  update: (id: string, data: any) => api.put(`/products/${id}`, data),

  delete: (id: string) => api.delete(`/products/${id}`),
};

// ============= CATEGORIES =============
export const categoriesAPI = {
  getAll: () => api.get('/categories'),

  getById: (id: string) => api.get(`/categories/${id}`),

  create: (data: Record<string, any>) =>
    api.post('/categories', data),

  update: (id: string, data: Record<string, any>) =>
    api.put(`/categories/${id}`, data),

  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ============= ORDERS =============
export const ordersAPI = {
  create: (data: {
    items: Array<{
      product: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress: {
      prenom: string;
      nom: string;
      adresse: string;
      ville: string;
      codePostal: string;
      telephone: string;
    };
    paymentMethod: string;
  }) => api.post('/orders', data),

  getMyOrders: () => api.get('/orders/myorders'),

  getById: (id: string) => api.get(`/orders/${id}`),

  cancel: (id: string) => api.put(`/orders/${id}/cancel`),

  // Admin only
  updateStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),

  markAsPaid: (id: string) => api.put(`/orders/${id}/pay`),
};

// ============= ADMIN =============
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),

  getSalesData: (period: 'week' | 'month' | 'year') =>
    api.get('/admin/sales', { params: { period } }),

  getUsers: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/users', { params }),

  getAllOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/orders', { params }),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),

  // Testimonials
  getTestimonials: () => api.get('/admin/testimonials'),
  getActiveTestimonials: () => api.get('/admin/testimonials/active'),
  createTestimonial: (data: any) => api.post('/admin/testimonials', data),
  updateTestimonial: (id: string, data: any) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id: string) => api.delete(`/admin/testimonials/${id}`),

  // Site Content
  getContentBySection: (section: string) => api.get(`/admin/content/${section}`),
  updateContentBySection: (section: string, data: any) => api.put(`/admin/content/${section}`, data),

  // Categories
  getCategories: () => api.get('/admin/categories'),
  updateCategory: (id: string, data: any) => api.put(`/admin/categories/${id}`, data),
};

export default api;
