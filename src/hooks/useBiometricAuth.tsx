import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

export function useBiometricAuth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNativeApp) {
      checkAvailability();
    }
  }, [isNativeApp]);

  const checkAvailability = async () => {
    try {
      // Simulation pour l'instant
      setIsAvailable(isNativeApp);
      setBiometryType(isNativeApp ? 'fingerprint' : '');
    } catch (error) {
      console.error('Error checking biometry availability:', error);
      setIsAvailable(false);
    }
  };

  const authenticate = async (
    reason: string = 'Authentifiez-vous pour continuer'
  ): Promise<boolean> => {
    if (!isNativeApp || !isAvailable) {
      toast.error('Authentification biométrique non disponible');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Simulation d'authentification biométrique
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Authentification réussie');
      return true;
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      
      if (error.message?.includes('User cancelled')) {
        toast.info('Authentification annulée');
      } else if (error.message?.includes('Authentication failed')) {
        toast.error('Échec de l\'authentification');
      } else {
        toast.error('Erreur lors de l\'authentification biométrique');
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getBiometryTypeLabel = (): string => {
    switch (biometryType) {
      case 'fingerprint':
        return 'Empreinte digitale';
      case 'face':
        return 'Reconnaissance faciale';
      case 'iris':
        return 'Reconnaissance d\'iris';
      default:
        return 'Biométrie';
    }
  };

  return {
    isNativeApp,
    isAvailable,
    biometryType,
    isLoading,
    authenticate,
    checkAvailability,
    getBiometryTypeLabel
  };
}