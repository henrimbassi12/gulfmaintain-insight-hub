
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NotificationPermission {
  permission: 'default' | 'granted' | 'denied';
  isSupported: boolean;
}

export function usePushNotifications() {
  const [permissionState, setPermissionState] = useState<NotificationPermission>({
    permission: 'default',
    isSupported: false
  });
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  useEffect(() => {
    // Vérifier le support des notifications
    const isSupported = 'Notification' in window;
    setPermissionState({
      permission: isSupported ? Notification.permission : 'denied',
      isSupported
    });

    // Écouter les changements de permission (si supporté par le navigateur)
    if (isSupported && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'notifications' as PermissionName }).then(result => {
        result.onchange = () => {
          setPermissionState(prev => ({
            ...prev,
            permission: Notification.permission
          }));
        };
      }).catch(() => {
        // Ignorer les erreurs de permissions query (pas supporté par tous les navigateurs)
      });
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!permissionState.isSupported) {
      toast.error("Les notifications push ne sont pas supportées par ce navigateur");
      return false;
    }

    if (permissionState.permission === 'denied') {
      toast.error("Les notifications ont été bloquées. Veuillez les autoriser dans les paramètres de votre navigateur");
      return false;
    }

    if (permissionState.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(prev => ({ ...prev, permission }));
      
      if (permission === 'granted') {
        toast.success("Notifications activées avec succès !");
        return true;
      } else if (permission === 'denied') {
        toast.error("Les notifications ont été refusées");
        return false;
      } else {
        toast.warning("Permission de notification non accordée");
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast.error("Erreur lors de la demande d'autorisation des notifications");
      return false;
    }
  };

  const sendNotification = (title: string, options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    silent?: boolean;
  }) => {
    // Vérifications préalables
    if (!permissionState.isSupported || permissionState.permission !== 'granted') {
      console.log('Notifications push non disponibles ou non autorisées');
      return null;
    }

    // Vérifier si l'utilisateur est en ligne
    if (!navigator.onLine) {
      console.log('Mode hors ligne - notification push ignorée');
      return null;
    }

    // Éviter le spam de notifications - minimum 10 secondes entre chaque notification
    const now = Date.now();
    const minInterval = 10 * 1000; // 10 secondes
    if (now - lastNotificationTime < minInterval) {
      console.log('Notification ignorée - trop récente');
      return null;
    }

    try {
      // Vérifier si le navigateur supporte les options de notification
      const soundEnabled = localStorage.getItem('soundEnabled');
      const isSilent = soundEnabled === 'false' || options?.silent;

      const notification = new Notification(title, {
        body: options?.body || '',
        icon: options?.icon || '/favicon.ico',
        badge: options?.badge || '/favicon.ico',
        tag: options?.tag || 'gulfmaintain-notification',
        requireInteraction: options?.requireInteraction || false,
        silent: isSilent,
        ...options
      });

      setLastNotificationTime(now);

      // Auto-fermer après 8 secondes si pas d'interaction requise
      if (!options?.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 8000);
      }

      // Gérer les clics sur la notification
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Optionnel: naviguer vers une page spécifique
        if (options?.tag === 'maintenance-alert') {
          window.location.href = '/maintenance';
        } else if (options?.tag === 'equipment-alert') {
          window.location.href = '/equipments';
        }
      };

      notification.onerror = (error) => {
        console.error('Erreur de notification:', error);
      };

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      toast.error('Erreur lors de l\'envoi de la notification');
      return null;
    }
  };

  const revokePermission = () => {
    // Note: JavaScript ne peut pas révoquer les permissions de notification
    // L'utilisateur doit le faire manuellement dans les paramètres du navigateur
    toast.info("Pour désactiver les notifications push, utilisez les paramètres de votre navigateur");
  };

  return {
    permissionState,
    requestPermission,
    sendNotification,
    revokePermission,
    isEnabled: permissionState.permission === 'granted'
  };
}
