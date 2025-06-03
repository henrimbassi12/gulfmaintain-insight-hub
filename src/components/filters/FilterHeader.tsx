
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface FilterHeaderProps {
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function FilterHeader({ activeFiltersCount, onClearFilters }: FilterHeaderProps) {
  const exportEquipments = () => {
    toast.success('Export en cours...', {
      description: 'Le fichier sera téléchargé dans quelques instants'
    });
    
    setTimeout(() => {
      toast.success('Export terminé', {
        description: 'Equipments_export.csv téléchargé avec succès'
      });
    }, 2000);
  };

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
        <Button variant="outline" size="sm" onClick={exportEquipments}>
          <Download className="w-4 h-4 mr-1" />
          Exporter
        </Button>
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
