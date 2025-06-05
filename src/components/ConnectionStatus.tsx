
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Database, AlertCircle, Upload } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const { hasOfflineData } = useOfflineStorage('maintenance');

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
      <div className="flex gap-2">
        <Badge variant="destructive" className="gap-1">
          <WifiOff className="w-3 h-3" />
          Hors ligne
        </Badge>
        {hasOfflineData && (
          <Badge variant="secondary" className="gap-1">
            <Upload className="w-3 h-3" />
            Données en attente
          </Badge>
        )}
      </div>
    );
  }

  if (dbConnected === false) {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertCircle className="w-3 h-3" />
        DB déconnectée
      </Badge>
    );
  }

  if (dbConnected === true) {
    return (
      <div className="flex gap-2">
        <Badge variant="default" className="gap-1 bg-green-600">
          <Database className="w-3 h-3" />
          Connecté
        </Badge>
        {hasOfflineData && (
          <Badge variant="secondary" className="gap-1">
            <Upload className="w-3 h-3" />
            Sync en attente
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Wifi className="w-3 h-3" />
      Vérification...
    </Badge>
  );
}
