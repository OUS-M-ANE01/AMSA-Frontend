import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Package, User, Settings } from 'lucide-react';
import { useNotificationStore } from '../../stores/notificationStore';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  // Fermer le panel si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package size={20} className="text-[#8B7355]" />;
      case 'user':
        return <User size={20} className="text-[#065F46]" />;
      case 'product':
        return <Package size={20} className="text-[#92400E]" />;
      default:
        return <Settings size={20} className="text-[#6B6B6B]" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 hover:bg-[#F5F1ED] rounded-xl transition-colors group"
      >
        <Bell
          size={20}
          className={`transition-colors ${
            unreadCount > 0 ? 'text-[#8B7355]' : 'text-[#6B6B6B]'
          } group-hover:text-[#8B7355]`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-[#C53030] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-[#E8E0D5] overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#E8E0D5] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#3A3A3A]">Notifications</h3>
              <p className="text-xs text-[#6B6B6B]">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune nouvelle notification'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#8B7355] hover:text-[#6D5942] font-medium flex items-center gap-1"
              >
                <Check size={14} />
                Tout marquer
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <Bell size={40} className="mx-auto text-[#E8E0D5] mb-3" />
                <p className="text-sm text-[#6B6B6B]">Aucune notification</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`px-4 py-3 border-b border-[#E8E0D5] cursor-pointer transition-colors group hover:bg-[#FAF8F5] ${
                    !notif.isRead ? 'bg-[#FEF9F5]' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      !notif.isRead ? 'bg-[#8B7355]/10' : 'bg-[#F5F1ED]'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`text-sm font-medium text-[#3A3A3A] ${!notif.isRead ? 'font-semibold' : ''}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-[#6B6B6B] mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-[#9B9B9B] mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: fr })}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#E8E0D5] rounded"
                        >
                          <X size={14} className="text-[#6B6B6B]" />
                        </button>
                      </div>
                      {!notif.isRead && (
                        <div className="w-2 h-2 bg-[#8B7355] rounded-full absolute right-4 top-5"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
