
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Route, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TechnicianLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  currentTask?: string;
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
  const [technicians] = useState<TechnicianLocation[]>([
    { id: '1', name: 'Ahmed Benali', lat: 33.5731, lng: -7.5898, status: 'available' },
    { id: '2', name: 'Fatima Zahra', lat: 34.0209, lng: -6.8416, status: 'busy', currentTask: 'FR-2024-012' },
    { id: '3', name: 'Mohamed Alami', lat: 31.6295, lng: -7.9811, status: 'available' }
  ]);
  
  const [maintenancePoints] = useState<MaintenanceLocation[]>([
    {
      id: '1',
      equipment: 'FR-2024-089',
      address: 'Agence Casablanca Nord',
      lat: 33.5731,
      lng: -7.5898,
      priority: 'medium',
      estimatedDuration: '2h 30min'
    },
    {
      id: '2',
      equipment: 'FR-2024-012',
      address: 'Agence Rabat Centre',
      lat: 34.0209,
      lng: -6.8416,
      priority: 'high',
      estimatedDuration: '1h 15min'
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive"
          });
        }
      );
    }
  }, [toast]);

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
          Géolocalisation
        </h2>
        <div className="flex gap-2">
          <Button onClick={optimizeRoute} className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            Optimiser les routes
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Ma position
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technicians Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Techniciens disponibles
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
                            {tech.name} ({userLocation && calculateDistance(
                              userLocation.lat, userLocation.lng,
                              tech.lat, tech.lng
                            )} km)
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

      {/* Interactive Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Carte interactive</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p>Carte interactive (intégration Mapbox)</p>
              <p className="text-sm">Affichage en temps réel des positions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
