
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
    const newOfflineData = { 
      ...offlineData, 
      [dataKey]: { 
        ...data, 
        timestamp: Date.now(),
        retryCount: 0 // Pour les tentatives de synchronisation
      } 
    };
    
    setOfflineData(newOfflineData);
    localStorage.setItem(`offline_${key}`, JSON.stringify(newOfflineData));
    
    console.log('💾 Données sauvegardées hors-ligne:', dataKey);
    return dataKey;
  }, [key, offlineData]);

  const removeOfflineData = useCallback((id: string) => {
    const newOfflineData = { ...offlineData };
    delete newOfflineData[id];
    
    setOfflineData(newOfflineData);
    localStorage.setItem(`offline_${key}`, JSON.stringify(newOfflineData));
    console.log('🗑️ Données hors-ligne supprimées:', id);
  }, [key, offlineData]);

  const syncOfflineData = useCallback(async (syncFunction: (data: any) => Promise<boolean>) => {
    if (!isOnline) return {};

    const dataToSync = Object.entries(offlineData);
    const syncResults: { [key: string]: boolean } = {};

    console.log(`🔄 Démarrage de la synchronisation pour ${dataToSync.length} éléments`);

    for (const [id, data] of dataToSync) {
      try {
        // Ajouter un délai progressif basé sur les tentatives
        const retryCount = data.retryCount || 0;
        if (retryCount > 0) {
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 10000)));
        }

        const success = await syncFunction(data);
        syncResults[id] = success;
        
        if (success) {
          console.log('✅ Synchronisation réussie:', id);
          removeOfflineData(id);
        } else {
          // Incrémenter le compteur de tentatives
          const updatedData = { ...data, retryCount: retryCount + 1 };
          const newOfflineData = { ...offlineData, [id]: updatedData };
          setOfflineData(newOfflineData);
          localStorage.setItem(`offline_${key}`, JSON.stringify(newOfflineData));
          console.log('⚠️ Échec de synchronisation, tentative:', retryCount + 1);
        }
      } catch (error) {
        console.error(`❌ Erreur de synchronisation pour ${id}:`, error);
        syncResults[id] = false;
        
        // Incrémenter le compteur de tentatives même en cas d'erreur
        const retryCount = data.retryCount || 0;
        const updatedData = { ...data, retryCount: retryCount + 1 };
        const newOfflineData = { ...offlineData, [id]: updatedData };
        setOfflineData(newOfflineData);
        localStorage.setItem(`offline_${key}`, JSON.stringify(newOfflineData));
      }
    }

    console.log('📊 Résultats de synchronisation:', syncResults);
    return syncResults;
  }, [isOnline, offlineData, removeOfflineData, key]);

  const clearAllOfflineData = useCallback(() => {
    setOfflineData({});
    localStorage.removeItem(`offline_${key}`);
    console.log('🧹 Toutes les données hors-ligne supprimées pour:', key);
  }, [key]);

  const getOfflineDataStats = useCallback(() => {
    const entries = Object.entries(offlineData);
    return {
      total: entries.length,
      pending: entries.filter(([, data]) => (data.retryCount || 0) === 0).length,
      retrying: entries.filter(([, data]) => (data.retryCount || 0) > 0).length,
      oldest: entries.length > 0 ? Math.min(...entries.map(([, data]) => data.timestamp)) : null
    };
  }, [offlineData]);

  return {
    isOnline,
    offlineData,
    saveOfflineData,
    removeOfflineData,
    syncOfflineData,
    clearAllOfflineData,
    hasOfflineData: Object.keys(offlineData).length > 0,
    getOfflineDataStats
  };
}
