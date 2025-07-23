import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNativeCapabilities } from '@/hooks/useNativeCapabilities';
import { Badge } from '@/components/ui/badge';

export function OfflineIndicatorMobile() {
  const { isOnline, isNativeApp } = useNativeCapabilities();

  if (!isNativeApp) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className={`flex items-center gap-2 px-3 py-2 ${
          isOnline 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
        } text-white`}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            En ligne
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            Hors ligne
          </>
        )}
      </Badge>
    </div>
  );
}