import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function useNativeCapabilities() {
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [platform, setPlatform] = useState<string>('web');

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
    setPlatform(Capacitor.getPlatform());
  }, []);

  const isOnline = navigator.onLine;
  
  return {
    isNativeApp,
    platform,
    isOnline,
    isMobile: platform === 'ios' || platform === 'android',
    isWeb: platform === 'web'
  };
}