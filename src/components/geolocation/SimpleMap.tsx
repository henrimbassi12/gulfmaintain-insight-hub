import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, User, Wrench, Calendar, Target } from 'lucide-react';

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

interface SimpleMapProps {
  userLocation: {lat: number, lng: number} | null;
  technicians: TechnicianLocation[];
  maintenancePoints: MaintenanceLocation[];
}

export function SimpleMap({ userLocation, technicians, maintenancePoints }: SimpleMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Occupé';
      case 'offline': return 'Hors ligne';
      case 'high': return 'Critique';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return status;
    }
  };

  // Calcul simple des positions relatives (simulation carte)
  const getRelativePosition = (lat: number, lng: number) => {
    const baseLatRatio = userLocation ? userLocation.lat : 4.0511;
    const baseLngRatio = userLocation ? userLocation.lng : 9.7679;
    
    // Convertir les coordonnées en positions relatives (0-100%)
    const minLat = 4.0300, maxLat = 4.0700;
    const minLng = 9.7400, maxLng = 9.7900;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100; // Inverser Y pour avoir le nord en haut
    
    return {
      left: Math.max(5, Math.min(95, x)) + '%',
      top: Math.max(5, Math.min(95, y)) + '%'
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Vue d'ensemble - Douala par secteur
          <Badge variant="secondary" className="ml-auto">
            {technicians.length + maintenancePoints.length} éléments
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Zone carte simulée */}
        <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          {/* Fond de carte stylisé */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-8 h-8 bg-blue-300 rounded-full"></div>
            <div className="absolute top-12 right-8 w-6 h-6 bg-green-300 rounded-full"></div>
            <div className="absolute bottom-16 left-12 w-4 h-4 bg-yellow-300 rounded-full"></div>
            <div className="absolute bottom-8 right-16 w-10 h-10 bg-blue-200 rounded-full"></div>
          </div>

          {/* Marqueur utilisateur */}
          {userLocation && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={getRelativePosition(userLocation.lat, userLocation.lng)}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-8 -left-8 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Votre position
                </div>
              </div>
            </div>
          )}

          {/* Marqueurs techniciens */}
          {technicians.map((tech) => (
            <div 
              key={tech.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={getRelativePosition(tech.lat, tech.lng)}
            >
              <div className="relative group cursor-pointer">
                <div className={`w-3 h-3 ${getStatusColor(tech.status)} rounded-full border-2 border-white shadow-md`}></div>
                <div className="absolute -top-12 -left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  <div className="font-semibold">{tech.name}</div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {getStatusText(tech.status)}
                  </div>
                  <div>{tech.sectors}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Marqueurs interventions */}
          {maintenancePoints.map((point) => (
            <div 
              key={point.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={getRelativePosition(point.lat, point.lng)}
            >
              <div className="relative group cursor-pointer">
                <div className={`w-3 h-3 ${getStatusColor(point.priority)} rounded-full border-2 border-white shadow-md`}></div>
                <div className="absolute -top-14 -left-20 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  <div className="font-semibold">{point.equipment}</div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Priorité {getStatusText(point.priority)}
                  </div>
                  <div>{point.address}</div>
                  <div>Durée: {point.estimatedDuration}</div>
                </div>
              </div>
            </div>
          ))}

          {/* Quadrillage pour simuler une carte */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-gray-400" style={{ top: `${i * 20}%` }}></div>
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-gray-400" style={{ left: `${i * 20}%` }}></div>
            ))}
          </div>

          {/* Zones géographiques labels */}
          <div className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
            BONABÉRI
          </div>
          <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
            AKWA
          </div>
          <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
            DEÏDO
          </div>
          <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded text-xs font-medium">
            MAKEPE
          </div>
        </div>
        
        {/* Légende */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span>Votre position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Disponible / Priorité faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Occupé / Priorité moyenne</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Priorité critique</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Hors ligne</span>
          </div>
        </div>

        {/* Note sur la carte avancée */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Carte simplifiée active</strong> - Pour une carte interactive complète avec navigation GPS, 
            utilisez le composant InteractiveMap en configurant un token Mapbox.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}