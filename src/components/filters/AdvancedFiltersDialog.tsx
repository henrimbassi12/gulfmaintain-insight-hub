
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, X } from 'lucide-react';
import { Equipment } from '@/hooks/useEquipments';

interface AdvancedFilters {
  brands: string[];
  types: string[];
  agencies: string[];
  maintenanceStatus: string[];
}

interface AdvancedFiltersDialogProps {
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  advancedFilters: AdvancedFilters;
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
  const brandOptions = Array.from(new Set(equipments.map(eq => eq.brand))).filter(Boolean);
  const typeOptions = Array.from(new Set(equipments.map(eq => eq.type))).filter(Boolean);
  const agencyOptions = Array.from(new Set(equipments.map(eq => eq.agency))).filter(Boolean);
  const maintenanceOptions = ['À jour', 'En retard', 'Programmée', 'Urgente'];

  const hasActiveFilters = Object.values(advancedFilters).some(arr => arr.length > 0);
  const totalActiveFilters = Object.values(advancedFilters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-10 relative">
          <Filter className="w-4 h-4 mr-2" />
          Filtres avancés
          {hasActiveFilters && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalActiveFilters}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filtres avancés</span>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Effacer tout
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Marques ({brandOptions.length})</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {brandOptions.length > 0 ? brandOptions.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={advancedFilters.brands.includes(brand)}
                      onCheckedChange={(checked) => 
                        onAdvancedFilterChange('brands', brand, checked as boolean)
                      }
                    />
                    <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">{brand}</Label>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">Aucune marque disponible</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Types d'équipement ({typeOptions.length})</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {typeOptions.length > 0 ? typeOptions.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={advancedFilters.types.includes(type)}
                      onCheckedChange={(checked) => 
                        onAdvancedFilterChange('types', type, checked as boolean)
                      }
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">{type}</Label>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">Aucun type disponible</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Agences ({agencyOptions.length})</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {agencyOptions.length > 0 ? agencyOptions.map(agency => (
                  <div key={agency} className="flex items-center space-x-2">
                    <Checkbox
                      id={`agency-${agency}`}
                      checked={advancedFilters.agencies.includes(agency)}
                      onCheckedChange={(checked) => 
                        onAdvancedFilterChange('agencies', agency, checked as boolean)
                      }
                    />
                    <Label htmlFor={`agency-${agency}`} className="text-sm cursor-pointer">{agency}</Label>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 italic">Aucune agence disponible</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">État maintenance</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                {maintenanceOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`maintenance-${option}`}
                      checked={advancedFilters.maintenanceStatus.includes(option)}
                      onCheckedChange={(checked) => 
                        onAdvancedFilterChange('maintenanceStatus', option, checked as boolean)
                      }
                    />
                    <Label htmlFor={`maintenance-${option}`} className="text-sm cursor-pointer">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={() => setShowAdvancedFilters(false)}>
            Annuler
          </Button>
          <Button onClick={onApplyFilters} className="bg-blue-600 hover:bg-blue-700">
            Appliquer les filtres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
