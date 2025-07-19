import React, { useState, useEffect } from 'react';
import { Bell, X, Brain, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'prediction' | 'maintenance' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  read: boolean;
  data?: any;
}

export function RealtimeNotificationCenter() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Écouter les nouvelles prédictions
    const predictionChannel = supabase
      .channel('prediction-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'failure_predictions'
        },
        handleNewPredictionNotification
      )
      .subscribe();

    // Écouter les nouveaux rapports de maintenance
    const maintenanceChannel = supabase
      .channel('maintenance-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'maintenance_reports'
        },
        handleNewMaintenanceNotification
      )
      .subscribe();

    return () => {
      supabase.removeChannel(predictionChannel);
      supabase.removeChannel(maintenanceChannel);
    };
  }, []);

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleNewPredictionNotification = (payload: any) => {
    const prediction = payload.new;
    const priority = determinePriority(prediction.failure_risk, prediction.confidence_score);
    
    const notification: NotificationItem = {
      id: `pred-${prediction.id}`,
      title: '🤖 Nouvelle Prédiction IA',
      message: `${prediction.equipment_name} - Risque de panne: ${prediction.failure_risk}%`,
      type: 'prediction',
      priority,
      timestamp: new Date(),
      read: false,
      data: prediction
    };

    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Garder max 20 notifications

    // Toast notification
    const toastType = priority === 'urgent' ? 'error' : 
                     priority === 'high' ? 'warning' : 'success';
    
    if (toastType === 'error') {
      toast.error(notification.title, {
        description: notification.message,
        duration: 8000
      });
    } else if (toastType === 'warning') {
      toast.warning(notification.title, {
        description: notification.message,
        duration: 6000
      });
    } else {
      toast.success(notification.title, {
        description: notification.message,
        duration: 4000
      });
    }
  };

  const handleNewMaintenanceNotification = (payload: any) => {
    const report = payload.new;
    
    const notification: NotificationItem = {
      id: `maint-${report.id}`,
      title: '🔧 Nouveau Rapport de Maintenance',
      message: `${report.equipment} - ${report.type} par ${report.technician}`,
      type: 'maintenance',
      priority: report.status === 'urgent' ? 'urgent' : 'medium',
      timestamp: new Date(),
      read: false,
      data: report
    };

    setNotifications(prev => [notification, ...prev.slice(0, 19)]);

    toast.info(notification.title, {
      description: notification.message,
      duration: 4000
    });
  };

  const determinePriority = (failureRisk: number, confidence: number): 'low' | 'medium' | 'high' | 'urgent' => {
    if (failureRisk >= 80 && confidence >= 80) return 'urgent';
    if (failureRisk >= 60 && confidence >= 70) return 'high';
    if (failureRisk >= 40 && confidence >= 60) return 'medium';
    return 'low';
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-3 h-3" />;
      case 'high': return <AlertTriangle className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <Brain className="w-4 h-4 text-purple-600" />;
      case 'maintenance': return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative hover-lift glass-effect border-purple-200 dark:border-purple-600"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce-gentle">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </Button>

      {/* Panel de notifications */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 max-h-96 z-50 animate-scale-in">
          <Card className="glass-effect floating-shadow border border-purple-100/50 dark:border-purple-700/30">
            <div className="p-4 border-b border-purple-100 dark:border-purple-700/30">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-purple-600 hover:text-purple-700"
                    >
                      Tout marquer lu
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`
                        p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 
                        transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-900/20
                        ${!notification.read ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}
                      `}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </h4>
                            <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                              {getPriorityIcon(notification.priority)}
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {notification.timestamp.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notification.id);
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}