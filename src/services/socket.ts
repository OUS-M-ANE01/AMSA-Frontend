import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useOrdersStore } from '../stores/ordersStore';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) {
      console.log('Socket déjà connecté');
      return;
    }

    // Remove /api from URL for socket connection
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const BACKEND_URL = apiUrl.replace(/\/api\/?$/, '');

    this.socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connecté:', this.socket?.id);
      this.reconnectAttempts = 0;

      // Envoyer les infos de connexion
      const { user } = useAuthStore.getState();
      if (user) {
        this.socket?.emit('user:connect', {
          userId: user._id,
          role: user.role,
        });
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket déconnecté:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erreur de connexion socket:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Nombre maximum de tentatives de reconnexion atteint');
      }
    });

    // Écouter les nouvelles commandes (pour les admins)
    this.socket.on('order:new', (data: any) => {
      console.log('📦 Nouvelle commande reçue:', data);
      
      const { addOrder } = useOrdersStore.getState();
      const { addNotification } = useNotificationStore.getState();

      // Ajouter la commande au store
      if (data.order) {
        addOrder(data.order);
      }

      // Créer une notification
      addNotification({
        type: 'order',
        title: 'Nouvelle commande',
        message: `Commande #${data.order._id.slice(-6)} de ${data.order.user.prenom} ${data.order.user.nom}`,
        data: data.order,
      });

      // Notification sonore (optionnel)
      this.playNotificationSound();
    });

    // Écouter les mises à jour de commandes
    this.socket.on('order:updated', (data: any) => {
      console.log('📝 Commande mise à jour:', data);
      
      const { updateOrder } = useOrdersStore.getState();
      const { addNotification } = useNotificationStore.getState();

      if (data.order) {
        updateOrder(data.order._id, data.order);
      }

      addNotification({
        type: 'order',
        title: 'Commande mise à jour',
        message: `La commande #${data.order._id.slice(-6)} a été ${data.order.status}`,
        data: data.order,
      });
    });

    // Écouter les utilisateurs en ligne (pour les admins)
    this.socket.on('users:online', (data: any) => {
      console.log('👥 Utilisateurs en ligne:', data.count);
    });

    // Produit en rupture de stock
    this.socket.on('product:out-of-stock', (data: any) => {
      const { addNotification } = useNotificationStore.getState();
      
      addNotification({
        type: 'product',
        title: 'Rupture de stock',
        message: `Le produit "${data.product.name}" est en rupture de stock`,
        data: data.product,
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket déconnecté manuellement');
    }
  }

  // Méthode pour émettre des événements
  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket non connecté, impossible d\'émettre:', event);
    }
  }

  // Jouer un son de notification
  private playNotificationSound() {
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.log('Impossible de jouer le son:', error);
      });
    } catch (error) {
      console.log('Audio non disponible');
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
