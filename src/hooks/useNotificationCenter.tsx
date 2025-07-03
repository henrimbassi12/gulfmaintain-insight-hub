
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export function useNotificationCenter() {
  const { toast } = useToast();
  const { sendNotification, isEnabled } = usePushNotifications();

  const notifyTaskStarted = useCallback((taskName: string, details?: string) => {
    console.log('🚀 Tâche démarrée:', taskName);
    
    toast({
      title: "✅ Tâche démarrée",
      description: `Vous avez démarré: ${taskName}${details ? ` - ${details}` : ''}`,
      duration: 4000,
    });

    if (isEnabled) {
      sendNotification(
        "Tâche démarrée",
        {
          body: `${taskName}${details ? ` - ${details}` : ''}`,
          icon: '/favicon.ico',
          tag: 'task-started'
        }
      );
    }
  }, [toast, sendNotification, isEnabled]);

  const notifyTaskCompleted = useCallback((taskName: string, duration?: string) => {
    console.log('✅ Tâche terminée:', taskName);
    
    toast({
      title: "🎉 Tâche terminée",
      description: `${taskName} terminée avec succès${duration ? ` (${duration})` : ''}`,
      duration: 4000,
    });

    if (isEnabled) {
      sendNotification(
        "Tâche terminée",
        {
          body: `${taskName} terminée avec succès`,
          icon: '/favicon.ico',
          tag: 'task-completed'
        }
      );
    }
  }, [toast, sendNotification, isEnabled]);

  const notifyEquipmentAlert = useCallback((equipmentName: string, alertType: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    console.log('⚠️ Alerte équipement:', equipmentName, alertType);
    
    const variant = priority === 'high' ? 'destructive' : 'default';
    const icon = priority === 'high' ? '🚨' : '⚠️';
    
    toast({
      title: `${icon} Alerte équipement`,
      description: `${equipmentName}: ${alertType}`,
      variant,
      duration: priority === 'high' ? 10000 : 6000,
    });

    if (isEnabled) {
      sendNotification(
        "Alerte équipement",
        {
          body: `${equipmentName}: ${alertType}`,
          icon: '/favicon.ico',
          tag: 'equipment-alert',
          requireInteraction: priority === 'high'
        }
      );
    }
  }, [toast, sendNotification, isEnabled]);

  const notifyMaintenanceScheduled = useCallback((equipmentName: string, date: string, technician: string) => {
    console.log('📅 Maintenance programmée:', equipmentName);
    
    toast({
      title: "📅 Maintenance programmée",
      description: `${equipmentName} - ${date} par ${technician}`,
      duration: 5000,
    });

    if (isEnabled) {
      sendNotification(
        "Maintenance programmée",
        {
          body: `${equipmentName} - ${date} par ${technician}`,
          icon: '/favicon.ico',
          tag: 'maintenance-scheduled'
        }
      );
    }
  }, [toast, sendNotification, isEnabled]);

  const notifyReportGenerated = useCallback((reportType: string, count: number) => {
    console.log('📊 Rapport généré:', reportType);
    
    toast({
      title: "📊 Rapport généré",
      description: `${reportType} - ${count} éléments exportés`,
      duration: 4000,
    });
  }, [toast]);

  return {
    notifyTaskStarted,
    notifyTaskCompleted,
    notifyEquipmentAlert,
    notifyMaintenanceScheduled,
    notifyReportGenerated
  };
}
