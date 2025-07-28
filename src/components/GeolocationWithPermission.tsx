import React, { useState } from 'react';
import { GeolocationSystem } from './GeolocationSystem';
import { PermissionGuide } from './PermissionGuide';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Button } from '@/components/ui/button';

export function GeolocationWithPermission() {
  const { locationError, getCurrentLocation } = useGeolocation();
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  // Vérifier si c'est une erreur de permission
  const isPermissionError = locationError && locationError.includes('Permission de géolocalisation refusée');

  if (isPermissionError && showPermissionGuide) {
    return (
      <div className="space-y-4 p-4">
        <PermissionGuide 
          type="location" 
          onRetry={() => {
            setShowPermissionGuide(false);
            getCurrentLocation();
          }} 
        />
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => setShowPermissionGuide(false)}
          >
            Continuer sans localisation
          </Button>
        </div>
      </div>
    );
  }

  if (isPermissionError && !showPermissionGuide) {
    return (
      <div className="space-y-4">
        <div className="text-center bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800 mb-3">
            Permission de géolocalisation requise pour une meilleure expérience
          </p>
          <Button onClick={() => setShowPermissionGuide(true)}>
            Voir comment activer
          </Button>
        </div>
        <GeolocationSystem />
      </div>
    );
  }

  return <GeolocationSystem />;
}