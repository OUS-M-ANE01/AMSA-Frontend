import { useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../stores/authStore';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  const { isConnected } = useSocket();

  useEffect(() => {
    if (isAuthenticated && user && !isConnected) {
      console.log('🔌 Initialisation de la connexion socket...');
    }
  }, [isAuthenticated, user, isConnected]);

  return <>{children}</>;
};
