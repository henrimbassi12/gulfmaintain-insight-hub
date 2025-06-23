
import React, { useState } from 'react';
import { GeolocationSystem } from '@/components/GeolocationSystem';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, RefreshCw, Activity, Navigation, Route } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

export default function GeolocationPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des positions...',
        success: 'Positions actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleOptimizeRoutes = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Optimisation des trajets en cours...',
        success: 'Trajets optimisés avec succès! Économie estimée: 15%',
        error: 'Erreur lors de l\'optimisation'
      }
    );
  };

  const handleGetCurrentPosition = () => {
    if (navigator.geolocation) {
      toast.loading('Localisation en cours...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.success(`Position obtenue: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          toast.error('Erreur de géolocalisation: ' + error.message);
        }
      );
    } else {
      toast.error('Géolocalisation non supportée par ce navigateur');
    }
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Géolocalisation"
        subtitle="Suivi en temps réel des équipements et techniciens"
        icon={MapPin}
      >
        <ModernButton 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          icon={RefreshCw}
          className={refreshing ? 'animate-spin' : ''}
        >
          Actualiser
        </ModernButton>
        
        <ModernButton 
          variant="outline"
          onClick={handleGetCurrentPosition}
          icon={Navigation}
        >
          Ma position
        </ModernButton>
        
        <ModernButton 
          onClick={handleOptimizeRoutes}
          icon={Route}
        >
          Optimiser trajets
        </ModernButton>
      </AirbnbHeader>

      {/* Statistiques de géolocalisation */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Suivi en temps réel
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              Actif
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-blue-600 mb-1">24</p>
              <p className="text-sm text-gray-600">Techniciens connectés</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-green-600 mb-1">156</p>
              <p className="text-sm text-gray-600">Équipements localisés</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-orange-600 mb-1">8</p>
              <p className="text-sm text-gray-600">Interventions en cours</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-purple-600 mb-1">95%</p>
              <p className="text-sm text-gray-600">Précision GPS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Carte de géolocalisation */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <GeolocationSystem />
        </CardContent>
      </Card>
    </AirbnbContainer>
  );
}
