
import { useState, useEffect, useCallback } from 'react';

interface OfflineData {
  [key: string]: any;
}

export function useOfflineStorage(key: string) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>({});

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data from localStorage
    const savedData = localStorage.getItem(`offline_${key}`);
    if (savedData) {
      try {
        setOfflineData(JSON.parse(savedData));
      } catch (error) {
        console.error('Erreur lors du chargement des données hors-ligne:', error);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [key]);

  const saveOfflineData = useCallback((data: any, id?: string) => {
    const dataKey = id || `temp_${Date.now()}`;
    const newOfflineData = { ...offlineData, [dataKey]: { ...data, timestamp: Date.now() } };
    
    setOfflineData(newOfflineData);
    localStorage.setItem(`offline_${key}`, JSON.stringify(newOfflineData));
    
    console.log('Données sauvegardées hors-ligne:', dataKey);
    return dataKey;
  }, [key, offlineData]);

  const removeOfflineData = useCallback((id: string) => {
    const newOfflineData = { ...offlineData };
    delete newOfflineData[id];
    
    setOfflineData(newOfflineData);
    localStorage.setItem(`offline_${key}`, JSON.stringify(newOfflineData));
  }, [key, offlineData]);

  const syncOfflineData = useCallback(async (syncFunction: (data: any) => Promise<boolean>) => {
    if (!isOnline) return;

    const dataToSync = Object.entries(offlineData);
    const syncResults: { [key: string]: boolean } = {};

    for (const [id, data] of dataToSync) {
      try {
        const success = await syncFunction(data);
        syncResults[id] = success;
        
        if (success) {
          removeOfflineData(id);
        }
      } catch (error) {
        console.error(`Erreur de synchronisation pour ${id}:`, error);
        syncResults[id] = false;
      }
    }

    return syncResults;
  }, [isOnline, offlineData, removeOfflineData]);

  const clearAllOfflineData = useCallback(() => {
    setOfflineData({});
    localStorage.removeItem(`offline_${key}`);
  }, [key]);

  return {
    isOnline,
    offlineData,
    saveOfflineData,
    removeOfflineData,
    syncOfflineData,
    clearAllOfflineData,
    hasOfflineData: Object.keys(offlineData).length > 0
  };
}
