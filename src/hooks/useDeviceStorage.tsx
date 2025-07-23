import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export function useDeviceStorage() {
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
  }, []);

  // Stockage sécurisé (simulation pour les données sensibles)
  const setSecureItem = async (key: string, value: string): Promise<boolean> => {
    try {
      // Pour l'instant, utilisation du localStorage avec préfixe sécurisé
      localStorage.setItem(`secure_${key}`, value);
      return true;
    } catch (error) {
      console.error('Error setting secure item:', error);
      return false;
    }
  };

  const getSecureItem = async (key: string): Promise<string | null> => {
    try {
      return localStorage.getItem(`secure_${key}`);
    } catch (error) {
      console.error('Error getting secure item:', error);
      return null;
    }
  };

  const removeSecureItem = async (key: string): Promise<boolean> => {
    try {
      localStorage.removeItem(`secure_${key}`);
      return true;
    } catch (error) {
      console.error('Error removing secure item:', error);
      return false;
    }
  };

  // Stockage standard (pour les préférences)
  const setPreference = async (key: string, value: string): Promise<boolean> => {
    try {
      if (isNativeApp) {
        await Preferences.set({ key, value });
      } else {
        localStorage.setItem(`pref_${key}`, value);
      }
      return true;
    } catch (error) {
      console.error('Error setting preference:', error);
      return false;
    }
  };

  const getPreference = async (key: string): Promise<string | null> => {
    try {
      if (isNativeApp) {
        const result = await Preferences.get({ key });
        return result.value;
      } else {
        return localStorage.getItem(`pref_${key}`);
      }
    } catch (error) {
      console.error('Error getting preference:', error);
      return null;
    }
  };

  const removePreference = async (key: string): Promise<boolean> => {
    try {
      if (isNativeApp) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(`pref_${key}`);
      }
      return true;
    } catch (error) {
      console.error('Error removing preference:', error);
      return false;
    }
  };

  const clearAllPreferences = async (): Promise<boolean> => {
    try {
      if (isNativeApp) {
        await Preferences.clear();
      } else {
        // Supprimer uniquement les clés de préférences
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('pref_')) {
            localStorage.removeItem(key);
          }
        });
      }
      return true;
    } catch (error) {
      console.error('Error clearing preferences:', error);
      return false;
    }
  };

  return {
    isNativeApp,
    // Stockage sécurisé
    setSecureItem,
    getSecureItem,
    removeSecureItem,
    // Préférences
    setPreference,
    getPreference,
    removePreference,
    clearAllPreferences
  };
}