import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Route, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Remove react-leaflet import temporarily to fix the context error
// We'll implement a simple placeholder map instead
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

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par ce navigateur");
      setUserLocation(defaultLocation);
      setIsLoadingLocation(false);
      toast({
        title: "Géolocalisation non supportée",
        description: "Utilisation de la position par défaut (Douala)",
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
      (position) => {
        console.log('Position obtenue:', position.coords);
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationError(null);
        setIsLoadingLocation(false);
        toast({
          title: "Position obtenue",
          description: "Votre position a été déterminée avec succès",
        });
      },
      (error) => {
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
        setIsLoadingLocation(false);
        
        toast({
          title: "Erreur de géolocalisation",
          description: `${errorMessage} Position par défaut utilisée.`,
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
    toast({
      title: "Optimisation de route",
      description: "Calcul de l'itinéraire optimal en cours...",
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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
            Optimiser les routes
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

      {userLocation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">
            Position actuelle: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            {userLocation.lat === defaultLocation.lat && userLocation.lng === defaultLocation.lng && 
              " (Position par défaut - Douala)"
            }
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technicians List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Techniciens par secteur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicians.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-gray-600">
                        {tech.sectors}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userLocation && calculateDistance(
                          userLocation.lat, userLocation.lng,
                          tech.lat, tech.lng
                        )} km
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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

        {/* Maintenance Points */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Points de maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenancePoints.map((point) => (
                <div key={point.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{point.equipment}</p>
                      <p className="text-sm text-gray-600">{point.address}</p>
                    </div>
                    <Badge className={getPriorityColor(point.priority)}>
                      {point.priority === 'high' ? 'Urgent' :
                       point.priority === 'medium' ? 'Moyen' : 'Faible'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {point.estimatedDuration}
                    </div>
                    
                    <select 
                      className="text-sm border rounded px-2 py-1"
                      onChange={(e) => assignTechnician(point.id, e.target.value)}
                    >
                      <option value="">Assigner technicien</option>
                      {technicians
                        .filter(t => t.status === 'available')
                        .map(tech => (
                          <option key={tech.id} value={tech.id}>
                            {tech.name} ({tech.sectors}) - {userLocation && calculateDistance(
                              userLocation.lat, userLocation.lng,
                              tech.lat, tech.lng
                            )} km
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temporary Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Carte interactive - Douala par secteur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Carte temporairement indisponible</p>
              <p className="text-sm text-gray-500">
                Position: {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'En cours...'}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-blue-600">🔵 {technicians.filter(t => t.status === 'available').length} Techniciens disponibles</p>
                <p className="text-sm text-red-600">🔴 {maintenancePoints.filter(p => p.priority === 'high').length} Interventions urgentes</p>
                <p className="text-sm text-yellow-600">🟡 {maintenancePoints.filter(p => p.priority === 'medium').length} Interventions moyennes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
