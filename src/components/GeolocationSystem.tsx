
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { InteractiveMap } from './InteractiveMap';
import { GeolocationFilters } from './geolocation/GeolocationFilters';
import { GeolocationList } from './geolocation/GeolocationList';
import { GeolocationHeader } from './geolocation/GeolocationHeader';
import { LocationStatus } from './geolocation/LocationStatus';
import { GeolocationStats } from './geolocation/GeolocationStats';
import { useGeolocation } from '@/hooks/useGeolocation';
import { sampleTechnicians, sampleEquipments, sampleInterventions } from '@/data/geolocation-data';

export function GeolocationSystem() {
  const { userLocation, locationError, isLoadingLocation, userLocationDetails, getCurrentLocation } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>(['all']);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  
  const { toast } = useToast();

  const centerOnItem = (lat: number, lng: number, itemId: string) => {
    setSelectedItem(itemId);
    toast({
      title: "🎯 Centrage sur l'élément",
      description: "La carte se centre sur l'élément sélectionné",
    });
  };

  const getFilteredItems = () => {
    const allItems = [
      ...sampleTechnicians.map(t => ({ ...t, type: 'technician' as const })),
      ...sampleEquipments.map(e => ({ ...e, type: 'equipment' as const })),
      ...sampleInterventions.map(i => ({ ...i, type: 'intervention' as const, name: i.equipment }))
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
    <div className="space-y-4">
      {/* Header avec recherche et actions */}
      <GeolocationHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGetCurrentLocation={getCurrentLocation}
        isLoadingLocation={isLoadingLocation}
        userLocation={userLocation}
      />

      {/* Status de géolocalisation */}
      <LocationStatus 
        locationError={locationError}
        userLocationDetails={userLocationDetails}
      />

      {/* Filtres */}
      <GeolocationFilters 
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}
      />

      {/* Layout principal avec carte et liste - sections empilées verticalement */}
      <div className="space-y-4 w-full">
        {/* Carte interactive */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 w-full">
          <CardContent className="p-0">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <InteractiveMap 
                userLocation={userLocation}
                technicians={sampleTechnicians}
                maintenancePoints={sampleInterventions}
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste synchronisée */}
        <div className="w-full">
          <GeolocationList 
            items={getFilteredItems()}
            onCenterOnMap={centerOnItem}
            selectedItem={selectedItem}
          />
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <GeolocationStats 
        technicians={sampleTechnicians}
        equipments={sampleEquipments}
        interventions={sampleInterventions}
      />
    </div>
  );
}
