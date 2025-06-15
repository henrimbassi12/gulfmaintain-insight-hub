import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Database, AlertCircle, Upload } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const { hasOfflineData: hasMaintenanceOfflineData } = useOfflineStorage('maintenance');
  const { hasOfflineData: hasReportsOfflineData } = useOfflineStorage('reports');
  const hasOfflineData = hasMaintenanceOfflineData || hasReportsOfflineData;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const { error } = await supabase.from('equipments').select('count').limit(1);
        setDbConnected(!error);
      } catch (error) {
        setDbConnected(false);
      }
    };

    if (isOnline) {
      checkDatabaseConnection();
      const interval = setInterval(checkDatabaseConnection, 30000);
      return () => clearInterval(interval);
    } else {
      setDbConnected(false);
    }
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div className="flex gap-1 md:gap-2 flex-wrap">
        <Badge variant="destructive" className="gap-1 text-xs">
          <WifiOff className="w-3 h-3" />
          <span className="hidden sm:inline">Hors ligne</span>
          <span className="sm:hidden">Offline</span>
        </Badge>
        {hasOfflineData && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Upload className="w-3 h-3" />
            <span className="hidden sm:inline">Données en attente</span>
            <span className="sm:hidden">Pending</span>
          </Badge>
        )}
      </div>
    );
  }

  if (dbConnected === false) {
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <AlertCircle className="w-3 h-3" />
        <span className="hidden sm:inline">DB déconnectée</span>
        <span className="sm:hidden">DB Error</span>
      </Badge>
    );
  }

  if (dbConnected === true) {
    return (
      <div className="flex gap-1 md:gap-2 flex-wrap">
        <Badge variant="default" className="gap-1 bg-green-600 text-xs">
          <Database className="w-3 h-3" />
          <span className="hidden sm:inline">Connecté</span>
          <span className="sm:hidden">Online</span>
        </Badge>
        {hasOfflineData && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Upload className="w-3 h-3" />
            <span className="hidden sm:inline">Sync en attente</span>
            <span className="sm:hidden">Sync</span>
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      <Wifi className="w-3 h-3" />
      <span className="hidden sm:inline">Vérification...</span>
      <span className="sm:hidden">Check...</span>
    </Badge>
  );
}
