import { useEffect } from 'react';
import { socketService } from '../services/socket';
import { useAuthStore } from '../stores/authStore';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connecter le socket si l'utilisateur est authentifié
      socketService.connect();

      return () => {
        // Déconnecter le socket quand le composant est démonté
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isConnected(),
    emit: (event: string, data: any) => socketService.emit(event, data),
  };
};
