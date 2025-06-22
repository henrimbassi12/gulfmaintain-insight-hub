
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useOfflineStorage } from './useOfflineStorage';

export function useSyncNotifications() {
  const { isOnline, hasOfflineData } = useOfflineStorage('maintenance');
  const { hasOfflineData: hasReportsOfflineData } = useOfflineStorage('reports');
  const wasOfflineRef = useRef(!navigator.onLine);
  const hadOfflineDataRef = useRef(hasOfflineData || hasReportsOfflineData);

  useEffect(() => {
    // Détection du passage en ligne
    if (!wasOfflineRef.current && !isOnline) {
      // Passage en mode hors ligne
      toast.warning('Mode hors ligne', {
        description: 'Vous pouvez continuer à travailler. Vos données seront synchronisées automatiquement.',
        duration: 4000,
      });
    } else if (wasOfflineRef.current && isOnline) {
      // Retour en ligne
      toast.success('Connexion rétablie', {
        description: 'Synchronisation des données en cours...',
        duration: 3000,
      });
    }

    wasOfflineRef.current = !isOnline;
  }, [isOnline]);

  useEffect(() => {
    const currentHasOfflineData = hasOfflineData || hasReportsOfflineData;
    
    // Détection de la fin de synchronisation
    if (hadOfflineDataRef.current && !currentHasOfflineData && isOnline) {
      toast.success('Synchronisation terminée', {
        description: 'Toutes vos données ont été synchronisées avec succès.',
        duration: 3000,
      });
    }

    hadOfflineDataRef.current = currentHasOfflineData;
  }, [hasOfflineData, hasReportsOfflineData, isOnline]);
}
