import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: any;
}

export function usePushNotifications() {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    setIsNativeApp(isNative);
    
    if (isNative) {
      initializePushNotifications();
    }
  }, []);

  const initializePushNotifications = async () => {
    try {
      // Pour l'instant, simulation sans les plugins réels
      console.log('Push notifications initialized (simulation mode)');
      setIsPermissionGranted(true);
      setDeviceToken('simulated-token-' + Date.now());
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  };

  const scheduleLocalNotification = async (
    title: string,
    body: string,
    scheduleAt?: Date
  ) => {
    try {
      // Simulation d'une notification locale
      const newNotification: PushNotification = {
        id: Date.now().toString(),
        title,
        body,
        data: { scheduledAt: scheduleAt?.toISOString() }
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      toast.success('Notification programmée');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      toast.error('Erreur lors de la programmation de la notification');
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const sendNotification = async (title: string, body?: string | { body: string; [key: string]: any }) => {
    if (typeof body === 'string') {
      return await scheduleLocalNotification(title, body);
    } else if (body && typeof body === 'object' && 'body' in body) {
      return await scheduleLocalNotification(title, body.body);
    } else {
      return await scheduleLocalNotification(title, '');
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    setIsPermissionGranted(true);
    return true;
  };

  return {
    isPermissionGranted,
    deviceToken,
    notifications,
    scheduleLocalNotification,
    clearNotifications,
    isNativeApp,
    // Compatibilité avec l'ancien hook
    sendNotification,
    isEnabled: isPermissionGranted,
    permissionState: isPermissionGranted ? 'granted' : 'denied',
    requestPermission,
    // Propriétés supplémentaires pour compatibilité
    isSupported: true,
    permission: isPermissionGranted ? 'granted' : 'denied'
  };
}