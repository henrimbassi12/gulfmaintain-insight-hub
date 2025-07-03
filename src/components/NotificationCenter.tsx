
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationCenterProps {
  onTaskStarted?: (taskId: string, taskName: string) => void;
  onTaskCompleted?: (taskId: string, taskName: string) => void;
  onEquipmentAlert?: (equipmentId: string, equipmentName: string) => void;
}

export function NotificationCenter({ 
  onTaskStarted, 
  onTaskCompleted, 
  onEquipmentAlert 
}: NotificationCenterProps) {
  const { toast } = useToast();
  const { sendNotification, isEnabled } = usePushNotifications();
  const { user } = useAuth();

  const notifyTaskStarted = (taskId: string, taskName: string) => {
    console.log('🚀 Notification: Tâche démarrée', { taskId, taskName });
    
    // Toast notification
    toast({
      title: "Tâche démarrée",
      description: `Vous avez démarré la tâche: ${taskName}`,
      duration: 5000,
    });

    // Push notification si activée
    if (isEnabled) {
      sendNotification(
        "Tâche démarrée",
        {
          body: `Vous avez démarré la tâche: ${taskName}`,
          icon: '/favicon.ico',
          tag: 'task-started',
          requireInteraction: false
        }
      );
    }

    // Callback personnalisé
    onTaskStarted?.(taskId, taskName);
  };

  const notifyTaskCompleted = (taskId: string, taskName: string) => {
    console.log('✅ Notification: Tâche terminée', { taskId, taskName });
    
    toast({
      title: "Tâche terminée",
      description: `Vous avez terminé la tâche: ${taskName}`,
      duration: 5000,
    });

    if (isEnabled) {
      sendNotification(
        "Tâche terminée",
        {
          body: `Vous avez terminé la tâche: ${taskName}`,
          icon: '/favicon.ico',
          tag: 'task-completed',
          requireInteraction: false
        }
      );
    }

    onTaskCompleted?.(taskId, taskName);
  };

  const notifyEquipmentAlert = (equipmentId: string, equipmentName: string, alertType: string = 'maintenance') => {
    console.log('⚠️ Notification: Alerte équipement', { equipmentId, equipmentName, alertType });
    
    toast({
      title: "Alerte équipement",
      description: `${equipmentName} nécessite une attention: ${alertType}`,
      variant: "destructive",
      duration: 8000,
    });

    if (isEnabled) {
      sendNotification(
        "Alerte équipement",
        {
          body: `${equipmentName} nécessite une attention: ${alertType}`,
          icon: '/favicon.ico',
          tag: 'equipment-alert',
          requireInteraction: true
        }
      );
    }

    onEquipmentAlert?.(equipmentId, equipmentName);
  };

  // Exposer les fonctions globalement pour utilisation dans d'autres composants
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).notificationCenter = {
        notifyTaskStarted,
        notifyTaskCompleted,
        notifyEquipmentAlert
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).notificationCenter;
      }
    };
  }, []);

  return null; // Composant invisible qui gère les notifications
}
