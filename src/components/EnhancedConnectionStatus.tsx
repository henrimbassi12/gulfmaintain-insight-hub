
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff, Database, AlertCircle, Upload, RefreshCw, CheckCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function EnhancedConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const { hasOfflineData: hasMaintenanceOfflineData, clearAllOfflineData: clearMaintenance } = useOfflineStorage('maintenance');
  const { hasOfflineData: hasReportsOfflineData, clearAllOfflineData: clearReports } = useOfflineStorage('reports');
  const hasOfflineData = hasMaintenanceOfflineData || hasReportsOfflineData;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connexion rétablie ! Synchronisation en cours...');
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Mode hors ligne activé. Vos données seront synchronisées automatiquement.');
    };

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
        if (!error) {
          setLastSyncTime(new Date().toLocaleTimeString('fr-FR'));
        }
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

  const handleClearOfflineData = () => {
    clearMaintenance();
    clearReports();
    toast.success('Données hors ligne supprimées');
  };

  const getConnectionStatus = () => {
    if (!isOnline) return { status: 'offline', color: 'destructive', icon: WifiOff, text: 'Hors ligne' };
    if (dbConnected === false) return { status: 'error', color: 'destructive', icon: AlertCircle, text: 'Erreur DB' };
    if (dbConnected === true && !hasOfflineData) return { status: 'online', color: 'default', icon: Database, text: 'Connecté' };
    if (hasOfflineData) return { status: 'syncing', color: 'secondary', icon: Upload, text: 'Sync en attente' };
    return { status: 'checking', color: 'secondary', icon: RefreshCw, text: 'Vérification...' };
  };

  const connectionInfo = getConnectionStatus();
  const IconComponent = connectionInfo.icon;

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <CollapsibleTrigger asChild>
        <Badge 
          variant={connectionInfo.color as any} 
          className={`gap-1 text-xs cursor-pointer hover:opacity-80 transition-opacity ${
            connectionInfo.status === 'online' ? 'bg-green-600' : ''
          }`}
        >
          <IconComponent className={`w-3 h-3 ${connectionInfo.status === 'checking' ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{connectionInfo.text}</span>
          <span className="sm:hidden">
            {connectionInfo.status === 'offline' ? 'OFF' : 
             connectionInfo.status === 'online' ? 'ON' : 
             connectionInfo.status === 'syncing' ? 'SYNC' : 'CHK'}
          </span>
        </Badge>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="absolute top-full right-0 mt-2 z-50">
        <Card className="w-72 shadow-lg border-2">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">État de la connexion</h4>
              <div className="flex items-center gap-1">
                <IconComponent className={`w-4 h-4 ${connectionInfo.status === 'checking' ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">{connectionInfo.text}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Internet:</span>
                <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                  {isOnline ? 'Connecté' : 'Déconnecté'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base de données:</span>
                <span className={dbConnected ? 'text-green-600' : 'text-red-600'}>
                  {dbConnected === null ? 'Vérification...' : dbConnected ? 'Accessible' : 'Inaccessible'}
                </span>
              </div>
              {lastSyncTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dernière sync:</span>
                  <span className="text-gray-800">{lastSyncTime}</span>
                </div>
              )}
              {hasOfflineData && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Données en attente:</span>
                  <span className="text-orange-600">Oui</span>
                </div>
              )}
            </div>

            {hasOfflineData && (
              <div className="pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={handleClearOfflineData}
                >
                  Vider le cache hors ligne
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
