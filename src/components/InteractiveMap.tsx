
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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

interface InteractiveMapProps {
  userLocation: {lat: number, lng: number} | null;
  technicians: TechnicianLocation[];
  maintenancePoints: MaintenanceLocation[];
}

export function InteractiveMap({ userLocation, technicians, maintenancePoints }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenError, setTokenError] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const handleTokenSubmit = () => {
    console.log('🗺️ Tentative d\'initialisation de la carte avec token:', mapboxToken.substring(0, 10) + '...');
    
    if (!mapboxToken.trim()) {
      setTokenError('Veuillez entrer un token Mapbox valide');
      return;
    }
    
    if (!mapboxToken.startsWith('pk.')) {
      setTokenError('Le token Mapbox doit commencer par "pk."');
      return;
    }

    setTokenError('');
    setIsMapLoading(true);
    setIsTokenSet(true);
    
    // Délai pour permettre le rendu du container
    setTimeout(() => {
      initializeMap(mapboxToken);
    }, 100);
  };

  const initializeMap = (token: string) => {
    console.log('🗺️ Initialisation de la carte...');
    
    if (!mapContainer.current) {
      console.error('❌ Container de carte non disponible');
      setTokenError('Container de carte non disponible');
      setIsMapLoading(false);
      return;
    }

    console.log('✅ Container trouvé, dimensions:', {
      width: mapContainer.current.offsetWidth,
      height: mapContainer.current.offsetHeight
    });

    try {
      mapboxgl.accessToken = token;
      console.log('🔑 Token Mapbox configuré');
      
      const centerLng = userLocation ? userLocation.lng : 9.7679;
      const centerLat = userLocation ? userLocation.lat : 4.0511;
      
      console.log('🎯 Centre de la carte:', { lat: centerLat, lng: centerLng });

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [centerLng, centerLat],
        zoom: 12,
        pitch: 0,
      });

      console.log('🗺️ Carte Mapbox créée');

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('✅ Carte chargée avec succès');
        setIsMapLoading(false);
        addMarkersToMap();
      });

      map.current.on('error', (e) => {
        console.error('❌ Erreur Mapbox:', e);
        setTokenError('Erreur lors du chargement de la carte: ' + e.error?.message);
        setIsMapLoading(false);
      });

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la carte:', error);
      setTokenError('Erreur lors de l\'initialisation de la carte. Vérifiez votre token.');
      setIsTokenSet(false);
      setIsMapLoading(false);
    }
  };

  const addMarkersToMap = () => {
    if (!map.current) {
      console.error('❌ Carte non disponible pour ajouter les marqueurs');
      return;
    }

    console.log('📍 Ajout des marqueurs...');

    // Position utilisateur
    if (userLocation) {
      console.log('👤 Ajout marqueur utilisateur:', userLocation);
      const userMarker = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">Votre position</h3>
            <p class="text-sm text-gray-600">Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}</p>
          </div>
        `))
        .addTo(map.current);
    }

    // Techniciens
    console.log('👷 Ajout de', technicians.length, 'techniciens');
    technicians.forEach(tech => {
      const color = tech.status === 'available' ? '#22c55e' : 
                   tech.status === 'busy' ? '#eab308' : '#6b7280';
      
      const techMarker = new mapboxgl.Marker({ color })
        .setLngLat([tech.lng, tech.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <h3 class="font-semibold">${tech.name}</h3>
            <p class="text-sm text-gray-600">${tech.sectors}</p>
            <p class="text-xs mt-1">
              <span class="inline-block w-2 h-2 rounded-full mr-1" style="background-color: ${color}"></span>
              ${tech.status === 'available' ? 'Disponible' : 
                tech.status === 'busy' ? 'Occupé' : 'Hors ligne'}
            </p>
            ${tech.currentTask ? `<p class="text-xs text-blue-600 mt-1">Tâche: ${tech.currentTask}</p>` : ''}
          </div>
        `))
        .addTo(map.current);
    });

    // Points de maintenance
    console.log('🔧 Ajout de', maintenancePoints.length, 'points de maintenance');
    maintenancePoints.forEach(point => {
      const color = point.priority === 'high' ? '#ef4444' : 
                   point.priority === 'medium' ? '#eab308' : '#22c55e';
      
      const maintenanceMarker = new mapboxgl.Marker({ color })
        .setLngLat([point.lng, point.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <h3 class="font-semibold">${point.equipment}</h3>
            <p class="text-sm text-gray-600">${point.address}</p>
            <p class="text-xs mt-1">
              <span class="inline-block w-2 h-2 rounded-full mr-1" style="background-color: ${color}"></span>
              Priorité: ${point.priority === 'high' ? 'Urgent' : 
                          point.priority === 'medium' ? 'Moyen' : 'Faible'}
            </p>
            <p class="text-xs text-gray-600 mt-1">Durée estimée: ${point.estimatedDuration}</p>
          </div>
        `))
        .addTo(map.current);
    });

    console.log('✅ Tous les marqueurs ajoutés');
  };

  useEffect(() => {
    return () => {
      if (map.current) {
        console.log('🧹 Nettoyage de la carte');
        map.current.remove();
      }
    };
  }, []);

  if (!isTokenSet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configuration de la carte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              Pour afficher la carte interactive, veuillez entrer votre token Mapbox public. 
              Vous pouvez l'obtenir gratuitement sur <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mapbox.com</a>
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <label htmlFor="mapbox-token" className="text-sm font-medium">Token Mapbox (commence par "pk.")</label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          {tokenError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {tokenError}
              </AlertDescription>
            </Alert>
          )}
          
          <Button onClick={handleTokenSubmit} className="w-full">
            Initialiser la carte
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carte interactive - Douala par secteur</CardTitle>
      </CardHeader>
      <CardContent>
        {isMapLoading && (
          <div className="h-96 rounded-lg bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Chargement de la carte...</p>
            </div>
          </div>
        )}
        <div 
          ref={mapContainer} 
          className={`h-96 rounded-lg overflow-hidden shadow-lg ${isMapLoading ? 'hidden' : ''}`}
          style={{ minHeight: '384px' }}
        />
        {tokenError && (
          <Alert className="mt-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {tokenError}
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Techniciens disponibles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Occupés / Priorité moyenne</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Interventions urgentes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
