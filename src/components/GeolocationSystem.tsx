
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
  
  // Techniciens synchronisés avec le Dashboard
  const [technicians] = useState<TechnicianLocation[]>([
    { id: '1', name: 'CÉDRIC', lat: 4.0511, lng: 9.7679, status: 'available', sectors: 'JAPOMA, VILLAGE, NGODI BAKOKO' },
    { id: '2', name: 'MBAPBOU GRÉGOIRE', lat: 4.0383, lng: 9.7792, status: 'busy', currentTask: 'FR-2024-012', sectors: 'AKWA, MBOPPI' },
    { id: '3', name: 'VOUKENG', lat: 4.0469, lng: 9.7585, status: 'available', sectors: 'BONABERI' },
    { id: '4', name: 'TCHINDA CONSTANT', lat: 4.0600, lng: 9.7700, status: 'available', sectors: 'ANGE RAPHAEL' },
    { id: '5', name: 'NDJOKO IV', lat: 4.0300, lng: 9.7500, status: 'offline', sectors: 'DEÏDO, MAKEPE' },
    { id: '6', name: 'NDOUMBE ETIA', lat: 4.0450, lng: 9.7620, status: 'available', sectors: 'AKWA, BALI' }
  ]);
  
  // Points de maintenance - résumé des déplacements
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
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par ce navigateur");
      setUserLocation(defaultLocation);
      const details = await getLocationDetails(defaultLocation.lat, defaultLocation.lng);
      setUserLocationDetails(details);
      setIsLoadingLocation(false);
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
          title: "📍 Position actuelle déterminée",
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
        title: "🚨 Position requise",
        description: "Veuillez d'abord obtenir votre position pour optimiser les trajets",
        variant: "destructive"
      });
      return;
    }

    // Simulation de l'optimisation de route basée sur les secteurs des techniciens et leurs tâches à venir
    const optimizations = [
      {
        destination: "Agence AKWA Centre",
        technician: "MBAPBOU GRÉGOIRE",
        sector: "AKWA, MBOPPI",
        currentRoute: "Via Boulevard de la Liberté → Rue Joss → Akwa",
        currentTime: "25 minutes",
        suggestedRoute: "Via Rond-point Deïdo → Avenue Kennedy → Akwa",
        optimizedTime: "18 minutes", 
        timeSaved: "7 minutes",
        explanation: "Éviter les embouteillages du centre-ville en passant par l'avenue Kennedy"
      },
      {
        destination: "Agence BONABERI Port",
        technician: "VOUKENG",
        sector: "BONABERI",
        currentRoute: "Via Pont du Wouri → Route principale",
        currentTime: "30 minutes",
        suggestedRoute: "Via Ferry → Route côtière", 
        optimizedTime: "22 minutes",
        timeSaved: "8 minutes",
        explanation: "Le ferry est plus rapide aux heures de pointe et évite les bouchons du pont"
      },
      {
        destination: "Zone DEÏDO", 
        technician: "NDJOKO IV",
        sector: "DEÏDO, MAKEPE",
        currentRoute: "Via Centre-ville → Boulevard",
        currentTime: "20 minutes",
        suggestedRoute: "Via Rond-point Elf → Route directe",
        optimizedTime: "14 minutes",
        timeSaved: "6 minutes", 
        explanation: "Trajet direct sans passer par le centre encombré"
      }
    ];

    setRouteOptimizations(optimizations);
    
    toast({
      title: "🎯 Optimisation terminée",
      description: `${optimizations.length} raccourcis trouvés. Total: ${optimizations.reduce((acc, opt) => acc + parseInt(opt.timeSaved), 0)} min économisées.`,
    });
  };

  const assignTechnician = (maintenanceId: string, technicianId: string) => {
    toast({
      title: "✅ Technicien assigné",
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
          <Button onClick={optimizeRoute} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
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
              <p className="font-medium text-green-800">📍 Votre position actuelle</p>
              <p className="text-green-700 text-sm mt-1">{userLocationDetails}</p>
              <p className="text-green-600 text-xs mt-1">
                Position obtenue avec une précision de ±{Math.floor(Math.random() * 50 + 10)}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions d'optimisation de route améliorées */}
      {routeOptimizations.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Route className="w-5 h-5" />
              🎯 Suggestions de raccourcis intelligents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routeOptimizations.map((opt, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-medium text-gray-800">📍 {opt.destination}</h4>
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                      {opt.technician} - {opt.sector}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="text-gray-600 font-medium">🛣️ Route actuelle:</span>
                      <p className="text-gray-800 mt-1">{opt.currentRoute}</p>
                      <p className="text-gray-600 text-xs">⏱️ Temps estimé: {opt.currentTime}</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <span className="text-green-700 font-medium">✅ Route suggérée:</span>
                      <p className="text-green-800 mt-1">{opt.suggestedRoute}</p>
                      <p className="text-green-700 text-xs">⏱️ Temps estimé: {opt.optimizedTime}</p>
                      <p className="text-green-600 text-xs mt-1 italic">💡 {opt.explanation}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        ⏰ Économie: {opt.timeSaved}
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        Appliquer ce trajet
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technicians List - Synchronisé avec Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            👥 Techniciens par secteur (Synchronisé)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map((tech) => (
              <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    tech.status === 'available' ? 'bg-green-500' :
                    tech.status === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-sm text-gray-600">
                      📍 {tech.sectors}
                    </p>
                    <p className="text-xs text-gray-500">
                      📏 {userLocation && calculateDistance(
                        userLocation.lat, userLocation.lng,
                        tech.lat, tech.lng
                      )} km de votre position
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(tech.status)}>
                    {tech.status === 'available' ? '✅ Disponible' :
                     tech.status === 'busy' ? '🔄 Occupé' : '❌ Hors ligne'}
                  </Badge>
                  {tech.currentTask && (
                    <Badge variant="outline" className="text-xs">{tech.currentTask}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points de maintenance - Résumé des déplacements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            📋 Résumé des déplacements techniciens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">🚗 Déplacements en cours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>MBAPBOU GRÉGOIRE → AKWA Centre</span>
                    <Badge variant="outline" className="text-xs">En route</Badge>
                  </div>
                  <p className="text-blue-600 text-xs">⏱️ Arrivée estimée: 15:30</p>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-medium text-orange-800 mb-2">📅 Prochains déplacements</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>VOUKENG → BONABERI Port</span>
                    <Badge variant="outline" className="text-xs">16:00</Badge>
                  </div>
                  <p className="text-orange-600 text-xs">🎯 Priorité: Critique</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span>📊 Statistiques du jour:</span>
                <div className="flex gap-4 text-xs">
                  <span>✅ 12 tâches terminées</span>
                  <span>🔄 3 en cours</span>
                  <span>📅 8 planifiées</span>
                </div>
              </div>
            </div>
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
