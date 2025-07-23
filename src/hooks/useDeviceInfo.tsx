import { useState, useEffect } from 'react';
import { capacitorService } from '@/services/capacitorPlugins';

interface ExtendedDeviceInfo {
  platform: string;
  isNative: boolean;
  deviceId?: string;
  model?: string;
  manufacturer?: string;
  osVersion?: string;
  appVersion?: string;
  webViewVersion?: string;
  isVirtual?: boolean;
  memUsed?: number;
  diskFree?: number;
  diskTotal?: number;
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<ExtendedDeviceInfo>({
    platform: capacitorService.getPlatform(),
    isNative: capacitorService.isNativePlatform()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      setIsLoading(true);
      
      const info = await capacitorService.getDeviceInfo();
      
      if (info) {
        setDeviceInfo({
          platform: info.platform,
          isNative: capacitorService.isNativePlatform(),
          deviceId: (info as any).identifier || (info as any).uuid || 'unknown',
          model: info.model,
          manufacturer: info.manufacturer,
          osVersion: info.osVersion,
          appVersion: (info as any).appVersion || '1.0.0',
          webViewVersion: (info as any).webViewVersion,
          isVirtual: (info as any).isVirtual,
          memUsed: (info as any).memUsed,
          diskFree: (info as any).diskFree,
          diskTotal: (info as any).diskTotal
        });
      } else {
        // Informations web basiques
        setDeviceInfo({
          platform: 'web',
          isNative: false,
          model: navigator.userAgent,
          manufacturer: 'Unknown',
          osVersion: navigator.platform,
          appVersion: '1.0.0'
        });
      }
    } catch (error) {
      console.error('Error loading device info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormattedMemoryUsage = (): string => {
    if (!deviceInfo.memUsed) return 'N/A';
    return `${(deviceInfo.memUsed / 1024 / 1024).toFixed(0)} MB`;
  };

  const getFormattedDiskSpace = (): { free: string; total: string; percentage: number } => {
    if (!deviceInfo.diskFree || !deviceInfo.diskTotal) {
      return { free: 'N/A', total: 'N/A', percentage: 0 };
    }

    const freeGB = deviceInfo.diskFree / 1024 / 1024 / 1024;
    const totalGB = deviceInfo.diskTotal / 1024 / 1024 / 1024;
    const usedPercentage = ((deviceInfo.diskTotal - deviceInfo.diskFree) / deviceInfo.diskTotal) * 100;

    return {
      free: `${freeGB.toFixed(1)} GB`,
      total: `${totalGB.toFixed(1)} GB`,
      percentage: Math.round(usedPercentage)
    };
  };

  const getPlatformLabel = (): string => {
    switch (deviceInfo.platform) {
      case 'ios':
        return 'iOS';
      case 'android':
        return 'Android';
      case 'web':
        return 'Navigateur Web';
      default:
        return deviceInfo.platform;
    }
  };

  const isLowMemoryDevice = (): boolean => {
    if (!deviceInfo.memUsed) return false;
    // Considérer comme faible mémoire si moins de 2GB
    return deviceInfo.memUsed < 2 * 1024 * 1024 * 1024;
  };

  const isLowStorageDevice = (): boolean => {
    const diskInfo = getFormattedDiskSpace();
    return diskInfo.percentage > 90; // Plus de 90% utilisé
  };

  return {
    deviceInfo,
    isLoading,
    getFormattedMemoryUsage,
    getFormattedDiskSpace,
    getPlatformLabel,
    isLowMemoryDevice,
    isLowStorageDevice,
    refresh: loadDeviceInfo
  };
}