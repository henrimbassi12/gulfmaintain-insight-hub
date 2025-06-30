
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw } from 'lucide-react';

interface FilterHeaderProps {
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function FilterHeader({ activeFiltersCount, onClearFilters }: FilterHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Filtres et recherche</h3>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {activeFiltersCount} actif{activeFiltersCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      <div className="flex gap-2">
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  );
}
