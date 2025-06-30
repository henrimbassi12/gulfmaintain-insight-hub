
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';

interface ActiveFiltersDisplayProps {
  searchTerm: string;
  afNfFilter: string; // Changé de statusFilter à afNfFilter
  advancedFilters: {
    brands: string[];
    types: string[];
    agencies: string[];
    maintenanceStatus: string[];
  };
  onSearchChange: (value: string) => void;
  onAfNfChange: (value: string) => void; // Changé de onStatusChange à onAfNfChange
}

export function ActiveFiltersDisplay({
  searchTerm,
  afNfFilter, // Changé de statusFilter à afNfFilter
  advancedFilters,
  onSearchChange,
  onAfNfChange // Changé de onStatusChange à onAfNfChange
}: ActiveFiltersDisplayProps) {
  const activeFiltersCount = 
    (afNfFilter !== 'all' ? 1 : 0) + // Changé de statusFilter à afNfFilter
    Object.values(advancedFilters).reduce((acc, arr) => acc + arr.length, 0) +
    (searchTerm ? 1 : 0);

  if (activeFiltersCount === 0) return null;

  return (
    <div className="pt-4 border-t border-gray-100">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-gray-600 font-medium">Filtres actifs:</span>
        {searchTerm && (
          <Badge variant="outline" className="gap-1">
            Recherche: "{searchTerm}"
            <button onClick={() => onSearchChange('')} className="hover:bg-gray-100 rounded">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        )}
        {Object.entries(advancedFilters).map(([key, values]) => 
          values.map(value => (
            <Badge key={`${key}-${value}`} variant="outline" className="gap-1">
              {value}
              <button 
                onClick={() => console.log('Remove advanced filter')}
                className="hover:bg-gray-100 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
