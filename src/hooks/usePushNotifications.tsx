
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPermission {
  permission: 'default' | 'granted' | 'denied';
  isSupported: boolean;
}

export function usePushNotifications() {
  const [permissionState, setPermissionState] = useState<NotificationPermission>({
    permission: 'default',
    isSupported: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier le support des notifications
    const isSupported = 'Notification' in window;
    setPermissionState({
      permission: isSupported ? Notification.permission : 'denied',
      isSupported
    });
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!permissionState.isSupported) {
      toast({
        title: "Non supporté",
        description: "Les notifications push ne sont pas supportées par ce navigateur.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(prev => ({ ...prev, permission }));
      
      if (permission === 'granted') {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez maintenant des notifications push pour les alertes importantes."
        });
        return true;
      } else {
        toast({
          title: "Permission refusée",
          description: "Les notifications push ont été désactivées.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast({
        title: "Erreur",
        description: "Impossible de demander la permission pour les notifications.",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendNotification = (title: string, options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
  }) => {
    if (!permissionState.isSupported || permissionState.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        body: options?.body,
        icon: options?.icon || '/favicon.ico',
        badge: options?.badge || '/favicon.ico',
        tag: options?.tag || 'maintenance-alert',
        requireInteraction: options?.requireInteraction || false,
        ...options
      });

      // Auto-fermer après 5 secondes si pas d'interaction requise
      if (!options?.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return notification;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  };

  return {
    permissionState,
    requestPermission,
    sendNotification,
    isEnabled: permissionState.permission === 'granted'
  };
}
