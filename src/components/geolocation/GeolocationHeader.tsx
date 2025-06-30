
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Navigation } from 'lucide-react';
import { QuickActions } from './QuickActions';

interface GeolocationHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onGetCurrentLocation: () => void;
  isLoadingLocation: boolean;
  userLocation: {lat: number, lng: number} | null;
}

export function GeolocationHeader({ 
  searchQuery, 
  onSearchChange, 
  onGetCurrentLocation, 
  isLoadingLocation,
  userLocation 
}: GeolocationHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher technicien, équipement, site..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onGetCurrentLocation}
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
  );
}
