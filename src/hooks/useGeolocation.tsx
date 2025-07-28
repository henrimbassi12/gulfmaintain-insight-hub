
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationState {
  userLocation: {lat: number, lng: number} | null;
  locationError: string | null;
  isLoadingLocation: boolean;
  userLocationDetails: string | null;
}

export function useGeolocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    userLocation: null,
    locationError: null,
    isLoadingLocation: false,
    userLocationDetails: null
  });

  const { toast } = useToast();

  // Position par défaut (Douala, Cameroun)
  const defaultLocation = { lat: 4.0511, lng: 9.7679 };

  const getLocationDetails = async (lat: number, lng: number) => {
    try {
      if (lat >= 4.0300 && lat <= 4.0600 && lng >= 9.7500 && lng <= 9.7800) {
        if (lat > 4.0450 && lng > 9.7650) {
          return `Akwa, Douala, Région du Littoral, Cameroun - Zone commerciale centrale`;
        } else if (lng < 9.7600) {
          return `Bonabéri, Douala, Région du Littoral, Cameroun - Zone industrielle et portuaire`;
        } else if (lat < 4.0400) {
          return `Deïdo, Douala, Région du Littoral, Cameroun - Zone résidentielle`;
        } else {
          return `Bonanjo, Douala, Région du Littoral, Cameroun - Centre administratif`;
        }
      }
      
      return `Douala, Région du Littoral, Cameroun (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    } catch (error) {
      return `Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const getCurrentLocation = async () => {
    setLocationState(prev => ({ ...prev, isLoadingLocation: true, locationError: null }));

    if (!navigator.geolocation) {
      const details = await getLocationDetails(defaultLocation.lat, defaultLocation.lng);
      setLocationState({
        userLocation: defaultLocation,
        locationError: "La géolocalisation n'est pas supportée par ce navigateur",
        isLoadingLocation: false,
        userLocationDetails: details
      });
      toast({
        title: "Position par défaut utilisée",
        description: details,
        variant: "destructive"
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        const details = await getLocationDetails(location.lat, location.lng);
        
        setLocationState({
          userLocation: location,
          locationError: null,
          isLoadingLocation: false,
          userLocationDetails: details
        });
        
        toast({
          title: "📍 Position actuelle déterminée",
          description: details,
        });
      },
      async (error) => {
        let errorMessage = "Erreur inconnue";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée. Veuillez autoriser l'accès à votre position. Position par défaut utilisée: Akwa, Douala, Région du Littoral, Cameroun - Zone commerciale centrale";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible. Vérifiez votre connexion GPS et votre réseau.";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé pour obtenir votre position. Utilisation de la position par défaut.";
            break;
        }
        
        const details = await getLocationDetails(defaultLocation.lat, defaultLocation.lng);
        
        setLocationState({
          userLocation: defaultLocation,
          locationError: errorMessage,
          isLoadingLocation: false,
          userLocationDetails: details
        });
        
        toast({
          title: "⚠️ Erreur de géolocalisation",
          description: `${errorMessage} Position par défaut utilisée: ${details}`,
          variant: "destructive"
        });
      },
      options
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    ...locationState,
    getCurrentLocation
  };
}
