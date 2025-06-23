
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Route, Clock, AlertCircle, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InteractiveMap } from './InteractiveMap';

interface TechnicianLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  currentTask?: string;
  sectors: string;
}

interface MaintenanceLocation {
  id: string;
  equipment: string;
  address: string;
  lat: number;
  lng: number;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: string;
}

export function GeolocationSystem() {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocationDetails, setUserLocationDetails] = useState<string | null>(null);
  const [routeOptimizations, setRouteOptimizations] = useState<any[]>([]);
  
  const [technicians] = useState<TechnicianLocation[]>([
    { id: '1', name: 'CÉDRIC', lat: 4.0511, lng: 9.7679, status: 'available', sectors: 'JAPOMA, VILLAGE, NGODI BAKOKO' },
    { id: '2', name: 'MBAPBOU GRÉGOIRE', lat: 4.0383, lng: 9.7792, status: 'busy', currentTask: 'FR-2024-012', sectors: 'AKWA, MBOPPI' },
    { id: '3', name: 'VOUKENG', lat: 4.0469, lng: 9.7585, status: 'available', sectors: 'BONABERI' },
    { id: '4', name: 'TCHINDA CONSTANT', lat: 4.0600, lng: 9.7700, status: 'available', sectors: 'ANGE RAPHAEL' },
    { id: '5', name: 'NDJOKO IV', lat: 4.0300, lng: 9.7500, status: 'offline', sectors: 'DEÏDO, MAKEPE' },
    { id: '6', name: 'NDOUMBE ETIA', lat: 4.0450, lng: 9.7620, status: 'available', sectors: 'AKWA, BALI' }
  ]);
  
  const [maintenancePoints] = useState<MaintenanceLocation[]>([
    {
      id: '1',
      equipment: 'FR-2024-089',
      address: 'Agence AKWA Centre',
      lat: 4.0511,
      lng: 9.7679,
      priority: 'medium',
      estimatedDuration: '2h 30min'
    },
    {
      id: '2',
      equipment: 'FR-2024-012',
      address: 'Agence BONABERI Port',
      lat: 4.0383,
      lng: 9.7792,
      priority: 'high',
      estimatedDuration: '1h 15min'
    }
  ]);

  const { toast } = useToast();

  // Position par défaut (Douala, Cameroun)
  const defaultLocation = { lat: 4.0511, lng: 9.7679 };

  // Fonction pour obtenir les détails d'une localisation à partir des coordonnées
  const getLocationDetails = async (lat: number, lng: number) => {
    try {
      // Simulation d'un appel à une API de géolocalisation inverse
      // Dans un vrai projet, vous utiliseriez une API comme OpenStreetMap Nominatim ou Google Maps
      const simulatedLocation = `Douala, Région du Littoral, Cameroun (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      
      if (lat >= 4.0300 && lat <= 4.0600 && lng >= 9.7500 && lng <= 9.7800) {
        if (lat > 4.0450) {
          return `Akwa, Douala, Région du Littoral, Cameroun`;
        } else if (lng < 9.7600) {
          return `Bonabéri, Douala, Région du Littoral, Cameroun`;
        } else {
          return `Bonanjo, Douala, Région du Littoral, Cameroun`;
        }
      }
      
      return simulatedLocation;
    } catch (error) {
      return `Position: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par ce navigateur");
      setUserLocation(defaultLocation);
      const details = await getLocationDetails(defaultLocation.lat, defaultLocation.lng);
      setUserLocationDetails(details);
      setIsLoadingLocation(false);
      toast({
        title: "Position par défaut",
        description: details,
        variant: "destructive"
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Position obtenue:', position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        
        const details = await getLocationDetails(location.lat, location.lng);
        setUserLocationDetails(details);
        
        setLocationError(null);
        setIsLoadingLocation(false);
        toast({
          title: "Position obtenue",
          description: details,
        });
      },
      async (error) => {
        console.error('Erreur de géolocalisation:', error);
        let errorMessage = "Erreur inconnue";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permission de géolocalisation refusée. Veuillez autoriser l'accès à votre position.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Position non disponible. Vérifiez votre connexion.";
            break;
          case error.TIMEOUT:
            errorMessage = "Délai d'attente dépassé pour obtenir votre position.";
            break;
        }
        
        setLocationError(errorMessage);
        setUserLocation(defaultLocation);
        const details = await getLocationDetails(defaultLocation.lat, defaultLocation.lng);
        setUserLocationDetails(details);
        setIsLoadingLocation(false);
        
        toast({
          title: "Erreur de géolocalisation",
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

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const optimizeRoute = () => {
    if (!userLocation) {
      toast({
        title: "Position requise",
        description: "Veuillez d'abord obtenir votre position pour optimiser les trajets",
        variant: "destructive"
      });
      return;
    }

    // Simulation de l'optimisation de route basée sur les secteurs des techniciens
    const optimizations = [
      {
        destination: "Agence AKWA Centre",
        currentRoute: "Via Boulevard de la Liberté → Rue Joss → Akwa (25 min)",
        suggestedRoute: "Via Rond-point Deïdo → Avenue Kennedy → Akwa (18 min)",
        timeSaved: "7 minutes"
      },
      {
        destination: "Agence BONABERI Port",
        currentRoute: "Via Pont du Wouri → Route principale (30 min)",
        suggestedRoute: "Via Ferry → Route côtière (22 min)",
        timeSaved: "8 minutes"
      }
    ];

    setRouteOptimizations(optimizations);
    
    toast({
      title: "Optimisation terminée",
      description: `${optimizations.length} raccourcis trouvés. Consultez les suggestions ci-dessous.`,
    });
  };

  const assignTechnician = (maintenanceId: string, technicianId: string) => {
    toast({
      title: "Technicien assigné",
      description: "L'intervention a été assignée avec succès",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-orange-100 text-orange-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Géolocalisation par secteur
        </h2>
        <div className="flex gap-2">
          <Button onClick={optimizeRoute} className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            Optimiser trajets
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            <Navigation className="w-4 h-4" />
            {isLoadingLocation ? 'Localisation...' : 'Ma position'}
          </Button>
        </div>
      </div>

      {/* Status de géolocalisation */}
      {locationError && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            {locationError}
          </AlertDescription>
        </Alert>
      )}

      {userLocationDetails && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-800">Votre position actuelle</p>
              <p className="text-green-700 text-sm mt-1">{userLocationDetails}</p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions d'optimisation de route */}
      {routeOptimizations.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Route className="w-5 h-5" />
              Suggestions de raccourcis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeOptimizations.map((opt, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <h4 className="font-medium text-gray-800 mb-2">📍 {opt.destination}</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Route actuelle:</span>
                      <p className="text-gray-800">{opt.currentRoute}</p>
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">✅ Route suggérée:</span>
                      <p className="text-green-800">{opt.suggestedRoute}</p>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        ⏱️ Économie: {opt.timeSaved}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technicians List - Étendu sur toute la largeur */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Techniciens par secteur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map((tech) => (
              <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    tech.status === 'available' ? 'bg-green-500' :
                    tech.status === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-gray-600">
                      {tech.sectors}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userLocation && calculateDistance(
                        userLocation.lat, userLocation.lng,
                        tech.lat, tech.lng
                      )} km de votre position
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(tech.status)}>
                    {tech.status === 'available' ? 'Disponible' :
                     tech.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                  </Badge>
                  {tech.currentTask && (
                    <Badge variant="outline">{tech.currentTask}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Carte interactive */}
      <InteractiveMap 
        userLocation={userLocation}
        technicians={technicians}
        maintenancePoints={maintenancePoints}
      />
    </div>
  );
}
