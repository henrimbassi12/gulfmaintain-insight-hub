
import React, { useState, useEffect } from 'react';
import { Bell, X, Clock, Wrench, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  type: 'urgent' | 'maintenance' | 'success' | 'info';
  title: string;
  message: string;
  equipment?: string;
  location?: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Maintenance Urgente',
      message: 'Température critique détectée sur le réfrigérateur',
      equipment: 'FR-2024-012',
      location: 'Région Littoral',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'maintenance',
      title: 'Maintenance Préventive',
      message: 'Entretien programmé nécessaire',
      equipment: 'FR-2024-089',
      location: 'Région Ouest',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Réparation Terminée',
      message: 'L\'intervention a été completée avec succès',
      equipment: 'FR-2024-156',
      location: 'Région Nord',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const { sendNotification, isEnabled: pushEnabled } = usePushNotifications();
  const { user } = useAuth();

  // Fonction pour vérifier si les notifications par email sont activées
  const areEmailNotificationsEnabled = () => {
    const emailNotifications = localStorage.getItem('emailNotifications');
    // Si pas de préférences sauvegardées, considérer comme activées par défaut
    return emailNotifications !== null ? JSON.parse(emailNotifications) : true;
  };

  // Fonction pour vérifier si les notifications sont activées
  const areNotificationsEnabled = () => {
    const emailNotifications = localStorage.getItem('emailNotifications');
    const maintenanceReminders = localStorage.getItem('maintenanceReminders');
    
    // Si pas de préférences sauvegardées, considérer comme activées par défaut
    const emailEnabled = emailNotifications !== null ? JSON.parse(emailNotifications) : true;
    const maintenanceEnabled = maintenanceReminders !== null ? JSON.parse(maintenanceReminders) : true;
    
    return { emailEnabled, maintenanceEnabled };
  };

  // Simuler des notifications en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const { emailEnabled, maintenanceEnabled } = areNotificationsEnabled();
      
      // Ne pas générer de notifications si elles sont désactivées
      if (!emailEnabled && !maintenanceEnabled && !pushEnabled) {
        return;
      }

      const mockNotifications: Notification[] = [
        {
          id: Date.now().toString(),
          type: 'urgent',
          title: 'Maintenance Urgente',
          message: 'Température critique détectée sur le réfrigérateur',
          equipment: 'FR-2024-012',
          location: 'Région Littoral',
          timestamp: new Date(),
          read: false
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'maintenance',
          title: 'Maintenance Préventive',
          message: 'Entretien programmé nécessaire',
          equipment: 'FR-2024-089',
          location: 'Région Ouest',
          timestamp: new Date(),
          read: false
        },
        {
          id: (Date.now() + 2).toString(),
          type: 'success',
          title: 'Réparation Terminée',
          message: 'L\'intervention a été completée avec succès',
          equipment: 'FR-2024-156',
          location: 'Région Nord',
          timestamp: new Date(),
          read: false
        }
      ];

      if (Math.random() > 0.8) {
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        
        // Toujours ajouter la notification à la liste et afficher un toast
        setNotifications(prev => [randomNotification, ...prev.slice(0, 9)]);
        
        toast({
          title: randomNotification.title,
          description: randomNotification.message,
          variant: randomNotification.type === 'urgent' ? 'destructive' : 'default'
        });

        // Envoyer une notification Push si activée
        if (pushEnabled) {
          sendNotification(randomNotification.title, {
            body: `${randomNotification.message} - ${randomNotification.equipment}`,
            tag: randomNotification.id,
            requireInteraction: randomNotification.type === 'urgent'
          });
        }
        
        // Envoyer une notification par email si activée
        const emailEnabled = areEmailNotificationsEnabled();
        if (emailEnabled && user?.email) {
          const emailHtml = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <h1 style="color: #333;">${randomNotification.title}</h1>
              <p style="font-size: 16px;">${randomNotification.message}</p>
              <hr style="border: 0; border-top: 1px solid #eee;" />
              <p><strong>Équipement:</strong> ${randomNotification.equipment || 'N/A'}</p>
              <p><strong>Lieu:</strong> ${randomNotification.location || 'N/A'}</p>
              <p style="font-size: 12px; color: #888;">Ceci est une notification automatique.</p>
            </div>
          `;
          
          supabase.functions.invoke('send-notification-email', {
            body: {
              to: user.email,
              subject: `Alerte de maintenance : ${randomNotification.title}`,
              html: emailHtml,
            }
          }).then(({ error }) => {
            if (error) {
              console.error("Erreur lors de l'envoi de l'email via la fonction Supabase:", error);
            }
          });
        }
      }
    }, 15000); // Toutes les 15 secondes pour demo

    return () => clearInterval(interval);
  }, [toast, sendNotification, pushEnabled, user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'maintenance': return <Wrench className="w-4 h-4 text-orange-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  };

  // Fermer les notifications quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('[data-notification-panel]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex items-center gap-2">
      {/* Bouton paramètres notifications */}
      <Drawer open={showSettings} onOpenChange={setShowSettings}>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Paramètres de notifications</DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <NotificationSettings />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Système de notifications principal */}
      <div className="relative" data-notification-panel>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="relative"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {isOpen && (
          <>
            {/* Overlay pour mobile */}
            <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsOpen(false)} />
            
            <Card className="absolute right-0 top-12 w-80 max-w-[90vw] max-h-96 overflow-y-auto z-50 shadow-xl border bg-white dark:bg-gray-800 md:w-96">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                        Tout marquer lu
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune notification</p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          notification.read 
                            ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' 
                            : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600'
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-white">{notification.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                            {notification.equipment && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                {notification.equipment} - {notification.location}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              {notification.timestamp.toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
