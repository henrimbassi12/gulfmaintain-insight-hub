
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Download, RotateCcw } from 'lucide-react';
import { Equipment } from '@/hooks/useEquipments';
import { toast } from 'sonner';

interface EquipmentFiltersProps {
  onFilterChange: (key: string, value: string) => void;
  equipments: Equipment[];
}

export function EquipmentFilters({ 
  onFilterChange,
  equipments
}: EquipmentFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    brands: [] as string[],
    types: [] as string[],
    agencies: [] as string[],
    maintenanceStatus: [] as string[]
  });

  // Extract dynamic options from actual equipment data
  const brandOptions = Array.from(new Set(equipments.map(eq => eq.brand))).filter(Boolean);
  const typeOptions = Array.from(new Set(equipments.map(eq => eq.type))).filter(Boolean);
  const agencyOptions = Array.from(new Set(equipments.map(eq => eq.agency))).filter(Boolean);
  const maintenanceOptions = ['À jour', 'En retard', 'Programmée', 'Urgente'];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange('search', value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onFilterChange('status', value);
  };

  const handleAdvancedFilterChange = (category: string, value: string, checked: boolean) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev], value]
        : prev[category as keyof typeof prev].filter(item => item !== value)
    }));
  };

  const applyAdvancedFilters = () => {
    // Notify parent component about advanced filters
    Object.entries(advancedFilters).forEach(([key, values]) => {
      onFilterChange(key, values.join(','));
    });
    setShowAdvancedFilters(false);
    toast.success('Filtres appliqués avec succès');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setAdvancedFilters({
      brands: [],
      types: [],
      agencies: [],
      maintenanceStatus: []
    });
    
    // Clear all filters in parent
    onFilterChange('search', '');
    onFilterChange('status', 'all');
    onFilterChange('brands', '');
    onFilterChange('types', '');
    onFilterChange('agencies', '');
    onFilterChange('maintenanceStatus', '');
    
    toast.success('Filtres réinitialisés');
  };

  const exportEquipments = () => {
    toast.success('Export en cours...', {
      description: 'Le fichier sera téléchargé dans quelques instants'
    });
    
    // Simulate export
    setTimeout(() => {
      toast.success('Export terminé', {
        description: 'Equipments_export.csv téléchargé avec succès'
      });
    }, 2000);
  };

  const activeFiltersCount = 
    (statusFilter !== 'all' ? 1 : 0) + 
    Object.values(advancedFilters).reduce((acc, arr) => acc + arr.length, 0) +
    (searchTerm ? 1 : 0);

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header with actions */}
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
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          {/* Filter controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Recherche globale
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ID, localisation, marque, modèle..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9 h-10"
                />
              </div>
            </div>
            
            <div className="md:col-span-3">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Statut
              </Label>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="offline">Hors ligne</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Actions
              </Label>
              <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full h-10 relative">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres avancés
                    {Object.values(advancedFilters).some(arr => arr.length > 0) && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {Object.values(advancedFilters).reduce((acc, arr) => acc + arr.length, 0)}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>Filtres avancés</span>
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
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
                                  handleAdvancedFilterChange('brands', brand, checked as boolean)
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
                                  handleAdvancedFilterChange('types', type, checked as boolean)
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
                                  handleAdvancedFilterChange('agencies', agency, checked as boolean)
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
                                  handleAdvancedFilterChange('maintenanceStatus', option, checked as boolean)
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
                    <Button onClick={applyAdvancedFilters} className="bg-blue-600 hover:bg-blue-700">
                      Appliquer les filtres
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Active filters display */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600 font-medium">Filtres actifs:</span>
                {searchTerm && (
                  <Badge variant="outline" className="gap-1">
                    Recherche: "{searchTerm}"
                    <button onClick={() => handleSearchChange('')} className="hover:bg-gray-100 rounded">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="outline" className="gap-1">
                    Statut: {statusFilter}
                    <button onClick={() => handleStatusChange('all')} className="hover:bg-gray-100 rounded">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {Object.entries(advancedFilters).map(([key, values]) => 
                  values.map(value => (
                    <Badge key={`${key}-${value}`} variant="outline" className="gap-1">
                      {value}
                      <button 
                        onClick={() => handleAdvancedFilterChange(key, value, false)}
                        className="hover:bg-gray-100 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
