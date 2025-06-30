
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Wrench, Calendar, MapPin } from 'lucide-react';

interface GeolocationFiltersProps {
  activeFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

export function GeolocationFilters({ activeFilters, onFiltersChange }: GeolocationFiltersProps) {
  const filterOptions = [
    { id: 'all', label: 'Tout', icon: MapPin, count: 0 },
    { id: 'technician', label: 'Techniciens', icon: User, count: 6 },
    { id: 'equipment', label: 'Équipements', icon: Wrench, count: 3 },
    { id: 'intervention', label: 'Interventions', icon: Calendar, count: 2 }
  ];

  const toggleFilter = (filterId: string) => {
    if (filterId === 'all') {
      onFiltersChange(['all']);
    } else {
      const newFilters = activeFilters.includes(filterId)
        ? activeFilters.filter(f => f !== filterId)
        : [...activeFilters.filter(f => f !== 'all'), filterId];
      
      if (newFilters.length === 0) {
        onFiltersChange(['all']);
      } else {
        onFiltersChange(newFilters);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        🎯 Filtrer par type :
      </span>
      
      {filterOptions.map((option) => {
        const IconComponent = option.icon;
        const isActive = activeFilters.includes(option.id);
        
        return (
          <Button
            key={option.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => toggleFilter(option.id)}
            className={`flex items-center gap-2 ${
              isActive 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'hover:bg-blue-50 dark:hover:bg-gray-700'
            }`}
          >
            <IconComponent className="w-4 h-4" />
            {option.label}
            {option.count > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {option.count}
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
