
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { Equipment } from '@/hooks/useEquipments';

interface AdvancedFiltersDialogProps {
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  advancedFilters: {
    brands: string[];
    types: string[];
    agencies: string[];
    maintenanceStatus: string[];
  };
  equipments: Equipment[];
  onAdvancedFilterChange: (category: string, value: string, checked: boolean) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export function AdvancedFiltersDialog({
  showAdvancedFilters,
  setShowAdvancedFilters,
  advancedFilters,
  equipments,
  onAdvancedFilterChange,
  onApplyFilters,
  onClearFilters
}: AdvancedFiltersDialogProps) {
  const uniqueBrands = [...new Set(equipments.map(eq => eq.branding))];
  const uniqueTypes = [...new Set(equipments.map(eq => eq.type_frigo))];
  const uniqueAgencies = [...new Set(equipments.map(eq => eq.division))];

  return (
    <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
          <Filter className="w-4 h-4 mr-2" />
          Filtres avancés
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filtres avancés
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Réinitialiser
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Marques ({uniqueBrands.length})
            </Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {uniqueBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={advancedFilters.brands.includes(brand)}
                    onCheckedChange={(checked) => 
                      onAdvancedFilterChange('brands', brand, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Types ({uniqueTypes.length})
            </Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {uniqueTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={advancedFilters.types.includes(type)}
                    onCheckedChange={(checked) => 
                      onAdvancedFilterChange('types', type, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Divisions ({uniqueAgencies.length})
            </Label>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {uniqueAgencies.map((agency) => (
                <div key={agency} className="flex items-center space-x-2">
                  <Checkbox
                    id={`agency-${agency}`}
                    checked={advancedFilters.agencies.includes(agency)}
                    onCheckedChange={(checked) => 
                      onAdvancedFilterChange('agencies', agency, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`agency-${agency}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {agency}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setShowAdvancedFilters(false)}>
            Annuler
          </Button>
          <Button onClick={onApplyFilters}>
            Appliquer les filtres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
