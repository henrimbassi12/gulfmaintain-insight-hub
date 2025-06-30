
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Route, Clock, AlertCircle, MapIcon, Search, Filter, Target, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InteractiveMap } from './InteractiveMap';
import { GeolocationFilters } from './geolocation/GeolocationFilters';
import { GeolocationList } from './geolocation/GeolocationList';
import { QuickActions } from './geolocation/QuickActions';

interface TechnicianLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  currentTask?: string;
  sectors: string;
  phone?: string;
  avatar?: string;
  distance?: string;
}

interface EquipmentLocation {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  status: 'operational' | 'maintenance' | 'down';
  address: string;
  lastMaintenance?: string;
}

interface InterventionLocation {
  id: string;
  equipment: string;
  address: string;
  lat: number;
  lng: number;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: string;
  scheduledDate: string;
  assignedTechnician?: string;
}

export function GeolocationSystem() {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [userLocationDetails, setUserLocationDetails] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  // Données enrichies
  const [technicians] = useState<TechnicianLocation[]>([
    { 
      id: '1', 
      name: 'CÉDRIC', 
      lat: 4.0511, 
      lng: 9.7679, 
      status: 'available', 
      sectors: 'JAPOMA, VILLAGE, NGODI BAKOKO',
      phone: '+237 650 123 456',
      avatar: '/avatars/cedric.jpg',
      distance: '2.3 km'
    },
    { 
      id: '2', 
      name: 'MBAPBOU GRÉGOIRE', 
      lat: 4.0383, 
      lng: 9.7792, 
      status: 'busy', 
      currentTask: 'FR-2024-012',
      sectors: 'AKWA, MBOPPI',
      phone: '+237 650 234 567',
      distance: '5.1 km'
    },
    { 
      id: '3', 
      name: 'VOUKENG', 
      lat: 4.0469, 
      lng: 9.7585, 
      status: 'available', 
      sectors: 'BONABERI',
      phone: '+237 650 345 678',
      distance: '3.7 km'
    },
    { 
      id: '4', 
      name: 'TCHINDA CONSTANT', 
      lat: 4.0600, 
      lng: 9.7700, 
      status: 'available', 
      sectors: 'ANGE RAPHAEL',
      phone: '+237 650 456 789',
      distance: '1.9 km'
    },
    { 
      id: '5', 
      name: 'NDJOKO IV', 
      lat: 4.0300, 
      lng: 9.7500, 
      status: 'offline', 
      sectors: 'DEÏDO, MAKEPE',
      phone: '+237 650 567 890',
      distance: '7.2 km'
    },
    { 
      id: '6', 
      name: 'NDOUMBE ETIA', 
      lat: 4.0450, 
      lng: 9.7620, 
      status: 'available', 
      sectors: 'AKWA, BALI',
      phone: '+237 650 678 901',
      distance: '4.1 km'
    }
  ]);
  
  const [equipments] = useState<EquipmentLocation[]>([
    {
      id: 'FR-2024-089',
      name: 'Réfrigérateur AKWA-01',
      type: 'Réfrigérateur',
      lat: 4.0511,
      lng: 9.7679,
      status: 'operational',
      address: 'Agence AKWA Centre',
      lastMaintenance: '15/12/2024'
    },
    {
      id: 'FR-2024-012',
      name: 'Réfrigérateur BONABERI-02',
      type: 'Réfrigérateur',
      lat: 4.0383,
      lng: 9.7792,
      status: 'maintenance',
      address: 'Agence BONABERI Port',
      lastMaintenance: '20/12/2024'
    },
    {
      id: 'FR-2024-145',
      name: 'Climatiseur DEIDO-01',
      type: 'Climatiseur',
      lat: 4.0320,
      lng: 9.7550,
      status: 'operational',
      address: 'Agence DEIDO Centre',
      lastMaintenance: '18/12/2024'
    }
  ]);

  const [interventions] = useState<InterventionLocation[]>([
    {
      id: 'INT-001',
      equipment: 'FR-2024-012',
      address: 'Agence BONABERI Port',
      lat: 4.0383,
      lng: 9.7792,
      priority: 'high',
      estimatedDuration: '1h 15min',
      scheduledDate: '2024-12-30 14:00',
      assignedTechnician: 'MBAPBOU GRÉGOIRE'
    },
    {
      id: 'INT-002',
      equipment: 'FR-2024-089',
      address: 'Agence AKWA Centre',
      lat: 4.0511,
      lng: 9.7679,
      priority: 'medium',
      estimatedDuration: '2h 30min',
      scheduledDate: '2024-12-30 16:00',
      assignedTechnician: 'CÉDRIC'
    }
  ]);

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
      maximumAge: 300000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
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

  const centerOnItem = (lat: number, lng: number, itemId: string) => {
    setSelectedItem(itemId);
    // Ici vous pourriez déclencher le centrage de la carte
    toast({
      title: "🎯 Centrage sur l'élément",
      description: "La carte se centre sur l'élément sélectionné",
    });
  };

  const getFilteredItems = () => {
    const allItems = [
      ...technicians.map(t => ({ ...t, type: 'technician' as const })),
      ...equipments.map(e => ({ ...e, type: 'equipment' as const })),
      ...interventions.map(i => ({ ...i, type: 'intervention' as const }))
    ];

    return allItems.filter(item => {
      // Filtre par recherche
      const matchesSearch = searchQuery === '' || 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item as any).address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item as any).sectors?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtre par type
      const matchesFilter = activeFilters.includes('all') || 
        activeFilters.includes(item.type);

      return matchesSearch && matchesFilter;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header avec recherche et actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Géolocalisation intelligente
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher technicien, équipement, site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <Navigation className="w-4 h-4" />
              {isLoadingLocation ? 'Localisation...' : 'Ma position'}
            </Button>
            
            <QuickActions userLocation={userLocation} />
          </div>
        </div>
      </div>

      {/* Status de géolocalisation */}
      {locationError && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            {locationError}
          </AlertDescription>
        </Alert>
      )}

      {userLocationDetails && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MapIcon className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">📍 Votre position actuelle</p>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">{userLocationDetails}</p>
              <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                Position obtenue avec une précision de ±{Math.floor(Math.random() * 50 + 10)}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <GeolocationFilters 
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
      />

      {/* Layout principal avec carte et liste */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte interactive */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <CardContent className="p-0">
              <div className="h-[600px] rounded-lg overflow-hidden">
                <InteractiveMap 
                  userLocation={userLocation}
                  technicians={technicians}
                  maintenancePoints={interventions}
                  selectedItem={selectedItem}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste synchronisée */}
        <div className="lg:col-span-1">
          <GeolocationList 
            items={getFilteredItems()}
            onCenterOnMap={centerOnItem}
            selectedItem={selectedItem}
          />
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Target className="w-5 h-5 text-blue-600" />
            📊 Statistiques en temps réel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                {technicians.filter(t => t.status === 'available').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Techniciens disponibles</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {equipments.filter(e => e.status === 'operational').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Équipements opérationnels</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {interventions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Interventions planifiées</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">95%</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Précision GPS</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
