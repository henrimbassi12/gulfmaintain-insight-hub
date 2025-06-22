
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WifiOff, X, Info, Upload } from 'lucide-react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDismissed, setIsDismissed] = useState(false);
  const { hasOfflineData: hasMaintenanceOfflineData } = useOfflineStorage('maintenance');
  const { hasOfflineData: hasReportsOfflineData } = useOfflineStorage('reports');
  const hasOfflineData = hasMaintenanceOfflineData || hasReportsOfflineData;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsDismissed(false); // Reset dismissal when coming back online
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsDismissed(false); // Show banner immediately when going offline
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isDismissed) return null;

  if (!isOnline) {
    return (
      <Alert className="border-orange-200 bg-orange-50 text-orange-800 mx-4 mt-4">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Mode hors ligne activé</span>
            <span className="text-sm opacity-90">
              • Vos modifications sont sauvegardées localement et seront synchronisées automatiquement.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-orange-600 hover:text-orange-800 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isOnline && hasOfflineData) {
    return (
      <Alert className="border-blue-200 bg-blue-50 text-blue-800 mx-4 mt-4">
        <Upload className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Synchronisation en cours</span>
            <span className="text-sm opacity-90">
              • Vos données hors ligne sont en cours de synchronisation avec le serveur.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-blue-600 hover:text-blue-800 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
