
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  onTogglePush?: (enabled: boolean) => void;
}

export function NotificationSettings({ onTogglePush }: NotificationSettingsProps) {
  const { permissionState, requestPermission, isEnabled, sendNotification, isSupported, permission } = usePushNotifications();
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedBrowserNotifications = localStorage.getItem('browserNotifications');
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    
    if (savedBrowserNotifications !== null) {
      setBrowserNotifications(JSON.parse(savedBrowserNotifications));
    }
    if (savedSoundEnabled !== null) {
      setSoundEnabled(JSON.parse(savedSoundEnabled));
    }
  }, []);

  // Sauvegarder les préférences dans localStorage
  useEffect(() => {
    localStorage.setItem('browserNotifications', JSON.stringify(browserNotifications));
  }, [browserNotifications]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const handleTogglePush = async () => {
    if (!isEnabled) {
      const granted = await requestPermission();
      if (granted) {
        setBrowserNotifications(true);
        toast.success('Notifications push activées avec succès');
      }
      onTogglePush?.(granted);
    } else {
      setBrowserNotifications(false);
      toast.info('Pour désactiver complètement les notifications push, utilisez les paramètres de votre navigateur');
      onTogglePush?.(false);
    }
  };

  const testNotification = () => {
    if (isEnabled && browserNotifications) {
      sendNotification('Test de notification', {
        body: 'Ceci est un test de notification push du système GulfMaintain.',
        requireInteraction: false
      });
      toast.success('Notification test envoyée');
    } else {
      toast.error('Les notifications push ne sont pas activées');
    }
  };

  const getPermissionBadge = () => {
    if (!isSupported) {
      return <Badge variant="secondary">Non supporté</Badge>;
    }
    
    switch (permission) {
      case 'granted':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Activées
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Bloquées
          </Badge>
        );
      default:
        return <Badge variant="secondary">Non configurées</Badge>;
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <BellOff className="w-5 h-5 text-gray-400" />
          <h4 className="font-medium text-gray-700">Notifications Push</h4>
        </div>
        <p className="text-sm text-gray-500">
          Les notifications push ne sont pas supportées par ce navigateur.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <div>
            <h4 className="font-medium">Notifications Push</h4>
            <p className="text-sm text-gray-500">
              Recevoir des alertes importantes même quand l'onglet n'est pas actif
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPermissionBadge()}
          <Switch
            checked={isEnabled && browserNotifications}
            onCheckedChange={handleTogglePush}
            disabled={permission === 'denied'}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Son des notifications</h4>
          <p className="text-sm text-gray-500">
            Activer le son pour les notifications
          </p>
        </div>
        <Switch
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
        />
      </div>

      {permission === 'denied' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-orange-800 font-medium">Notifications bloquées</p>
              <p className="text-sm text-orange-700 mt-1">
                Pour réactiver les notifications :
              </p>
              <div className="mt-2 text-sm text-orange-700">
                <p><strong>Sur Safari :</strong> Touchez "aA" → "Paramètres du site web" → Activez "Notifications"</p>
                <p className="mt-1"><strong>Sur Chrome :</strong> Touchez l'icône de cadenas → Autorisez les notifications</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEnabled && browserNotifications && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={testNotification}>
            Tester une notification
          </Button>
        </div>
      )}

      {!isEnabled && permission === 'default' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Bell className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Activer les notifications</p>
              <p className="text-sm text-blue-700 mt-1">
                Cliquez sur le bouton ci-dessus pour activer les notifications push et 
                recevoir des alertes importantes même lorsque vous n'êtes pas sur l'application.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
