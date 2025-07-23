import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { toast } from 'sonner';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export function useNativeGeolocation() {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<string | null>(null);

  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    return () => {
      if (watchId) {
        stopTracking();
      }
    };
  }, [watchId]);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      const permissions = await Geolocation.requestPermissions();
      
      if (permissions.location === 'granted') {
        setError(null);
        return true;
      } else {
        setError('Permission de géolocalisation refusée');
        toast.error('Permission de géolocalisation refusée');
        return false;
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la demande de permissions';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const getCurrentPosition = async (): Promise<LocationData | null> => {
    try {
      setIsLoading(true);
      setError(null);

      if (isNativeApp) {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
          return null;
        }
      }

      const position: Position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude ?? undefined,
        altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
        heading: position.coords.heading ?? undefined,
        speed: position.coords.speed ?? undefined,
        timestamp: position.timestamp
      };

      setCurrentLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage = 'Erreur lors de la récupération de la position';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const startTracking = async (): Promise<boolean> => {
    if (isTracking) {
      return true;
    }

    try {
      if (isNativeApp) {
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
          return false;
        }
      }

      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        },
        (position) => {
          if (position) {
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude ?? undefined,
              altitudeAccuracy: position.coords.altitudeAccuracy ?? undefined,
              heading: position.coords.heading ?? undefined,
              speed: position.coords.speed ?? undefined,
              timestamp: position.timestamp
            };
            setCurrentLocation(locationData);
          }
        }
      );

      setWatchId(id);
      setIsTracking(true);
      setError(null);
      toast.success('Suivi de position activé');
      return true;
    } catch (err) {
      const errorMessage = 'Erreur lors du démarrage du suivi';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const stopTracking = async () => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId });
      setWatchId(null);
      setIsTracking(false);
      toast.info('Suivi de position désactivé');
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en kilomètres
  };

  return {
    isNativeApp,
    currentLocation,
    isTracking,
    isLoading,
    error,
    getCurrentPosition,
    startTracking,
    stopTracking,
    calculateDistance
  };
}