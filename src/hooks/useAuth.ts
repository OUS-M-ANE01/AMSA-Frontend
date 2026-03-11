import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const { user, token, isLoading, isAuthenticated, login: setLogin, logout: setLogout, updateUser, setLoading } = useAuthStore();

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getMe();
      updateUser(response.data.data);
      setLoading(false);
    } catch (error) {
      setLogout();
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: userData } = response.data.data;
      
      setLogin(userData, newToken);
      
      return { success: true, user: userData };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion',
      };
    }
  };

  const register = async (data: {
    prenom: string;
    nom: string;
    email: string;
    password: string;
    telephone?: string;
  }) => {
    try {
      const response = await authAPI.register(data);
      const { token: newToken, user: userData } = response.data.data;
      
      setLogin(userData, newToken);
      
      return { success: true, user: userData };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'inscription',
      };
    }
  };

  const logout = () => {
    setLogout();
  };

  const updateProfile = async (data: {
    prenom?: string;
    nom?: string;
    telephone?: string;
    dateNaissance?: string;
    adresse?: string;
  }) => {
    try {
      const response = await authAPI.updateProfile(data);
      updateUser(response.data.data);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour',
      };
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authAPI.updatePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du changement de mot de passe',
      };
    }
  };

  const toggleFavorite = async (productId: string) => {
    try {
      const response = await authAPI.toggleFavorite(productId);
      updateUser(response.data.data);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur',
      };
    }
  };

  return {
    user,
    token,
    loading: isLoading,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    toggleFavorite,
    checkAuth,
  };
};
