
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Database, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);

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

    checkDatabaseConnection();
    const interval = setInterval(checkDatabaseConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="gap-1">
        <WifiOff className="w-3 h-3" />
        Hors ligne
      </Badge>
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
      <Badge variant="default" className="gap-1 bg-green-600">
        <Database className="w-3 h-3" />
        Connecté
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <Wifi className="w-3 h-3" />
      Vérification...
    </Badge>
  );
}
