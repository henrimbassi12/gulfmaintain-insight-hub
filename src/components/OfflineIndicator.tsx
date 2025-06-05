
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { WifiOff, Wifi, Upload } from 'lucide-react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

export function OfflineIndicator() {
  const { isOnline, hasOfflineData } = useOfflineStorage('maintenance');

  if (isOnline && !hasOfflineData) {
    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <Wifi className="w-3 h-3" />
        En ligne
      </Badge>
    );
  }

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="gap-1">
        <WifiOff className="w-3 h-3" />
        Hors ligne
      </Badge>
    );
  }

  if (hasOfflineData) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Upload className="w-3 h-3" />
        Sync en attente
      </Badge>
    );
  }

  return null;
}
