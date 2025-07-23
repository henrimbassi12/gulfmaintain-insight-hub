import React from 'react';
import { Cloud, CloudOff, RotateCcw } from 'lucide-react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SyncStatusIndicatorProps {
  storageKeys?: string[];
}

export function SyncStatusIndicator({ storageKeys = ['reports', 'equipments', 'predictions'] }: SyncStatusIndicatorProps) {
  const reportsSync = useOfflineStorage('reports');
  const equipmentsSync = useOfflineStorage('equipments');
  const predictionsSync = useOfflineStorage('predictions');
  
  const totalPendingItems = [reportsSync, equipmentsSync, predictionsSync]
    .reduce((total, sync) => total + Object.keys(sync.offlineData).length, 0);

  const isOnline = reportsSync.isOnline;

  const handleForceClearOfflineData = () => {
    [reportsSync, equipmentsSync, predictionsSync].forEach(sync => {
      sync.clearAllOfflineData();
    });
    toast.success('Données hors ligne effacées');
  };

  if (totalPendingItems === 0) {
    return (
      <Badge variant="outline" className="flex items-center gap-2">
        <Cloud className="w-3 h-3" />
        Synchronisé
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={isOnline ? "default" : "secondary"}
        className="flex items-center gap-2"
      >
        {isOnline ? (
          <RotateCcw className="w-3 h-3 animate-spin" />
        ) : (
          <CloudOff className="w-3 h-3" />
        )}
        {totalPendingItems} en attente
      </Badge>
      
      {totalPendingItems > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleForceClearOfflineData}
          className="text-xs h-6 px-2"
        >
          Effacer
        </Button>
      )}
    </div>
  );
}