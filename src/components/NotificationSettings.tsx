
import React from 'react';
import { Bell, BellOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface NotificationSettingsProps {
  onTogglePush?: (enabled: boolean) => void;
}

export function NotificationSettings({ onTogglePush }: NotificationSettingsProps) {
  const { permissionState, requestPermission, isEnabled, sendNotification } = usePushNotifications();

  const handleTogglePush = async () => {
    if (!isEnabled) {
      const granted = await requestPermission();
      onTogglePush?.(granted);
    } else {
      // Note: On ne peut pas révoquer la permission via JS, 
      // mais on peut informer l'utilisateur comment le faire
      onTogglePush?.(false);
    }
  };

  const testNotification = () => {
    if (isEnabled) {
      sendNotification('Test de notification', {
        body: 'Ceci est un test de notification push du système de maintenance.',
        requireInteraction: false
      });
    }
  };

  const getPermissionBadge = () => {
    switch (permissionState.permission) {
      case 'granted':
        return <Badge className="bg-green-100 text-green-800">Activées</Badge>;
      case 'denied':
        return <Badge variant="destructive">Bloquées</Badge>;
      default:
        return <Badge variant="secondary">Non configurées</Badge>;
    }
  };

  if (!permissionState.isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="w-5 h-5 text-gray-400" />
            Notifications Push
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Les notifications push ne sont pas supportées par ce navigateur.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications Push
          {getPermissionBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Notifications push</p>
            <p className="text-sm text-gray-500">
              Recevoir des alertes importantes même quand l'onglet n'est pas actif
            </p>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={handleTogglePush}
          />
        </div>

        {permissionState.permission === 'denied' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-sm text-orange-800">
              Les notifications sont bloquées. Pour les réactiver, cliquez sur l'icône de cadenas dans la barre d'adresse de votre navigateur.
            </p>
          </div>
        )}

        {isEnabled && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={testNotification}>
              Tester une notification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
