
import React, { useState } from 'react';
import { Shield, Bell, X } from 'lucide-react';
import { MobileDrawer } from './ui/mobile-drawer';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function MobileHeader() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  // Notifications simulées
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Maintenance Urgente',
      message: 'Température critique détectée sur le réfrigérateur FR-2024-012',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      title: 'Maintenance Préventive',
      message: 'Entretien programmé nécessaire pour FR-2024-089',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: '3',
      title: 'Réparation Terminée',
      message: 'L\'intervention a été completée avec succès pour FR-2024-156',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleProfileClick = () => {
    navigate('/settings');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications",
      description: "Toutes les notifications ont été marquées comme lues",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <>
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <MobileDrawer />
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">GulfMaintain</h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          
          {userProfile && (
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <span className="text-white text-sm font-medium">
                E
              </span>
            </button>
          )}
        </div>
      </header>

      {/* Panel de notifications mobile */}
      {showNotifications && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden" 
            onClick={() => setShowNotifications(false)} 
          />
          
          {/* Panel de notifications */}
          <Card className="fixed top-16 right-4 left-4 max-h-96 overflow-y-auto z-50 shadow-xl border bg-white md:hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                      Marquer tout comme lu
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setShowNotifications(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Aucune notification</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
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
    </>
  );
}
