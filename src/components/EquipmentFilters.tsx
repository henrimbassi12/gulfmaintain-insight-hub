
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from 'lucide-react';

interface EquipmentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function EquipmentFilters({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter 
}: EquipmentFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    brands: [] as string[],
    types: [] as string[],
    agencies: [] as string[],
    maintenanceStatus: [] as string[]
  });

  const brandOptions = ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'Electrolux'];
  const typeOptions = ['Réfrigérateur', 'Congélateur', 'Vitrine réfrigérée', 'Chambre froide'];
  const agencyOptions = ['Casablanca Nord', 'Rabat Centre', 'Marrakech Sud', 'Tanger Port'];
  const maintenanceOptions = ['À jour', 'En retard', 'Programmée', 'Urgente'];

  const handleAdvancedFilterChange = (category: string, value: string, checked: boolean) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev], value]
        : prev[category as keyof typeof prev].filter(item => item !== value)
    }));
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
  };

  const activeFiltersCount = 
    (statusFilter !== 'all' ? 1 : 0) + 
    Object.values(advancedFilters).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par ID, localisation, marque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="operational">Opérationnel</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="offline">Hors ligne</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="w-4 h-4 mr-2" />
                Plus de filtres
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  Filtres avancés
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Effacer tout
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Marques</Label>
                  <div className="space-y-2">
                    {brandOptions.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={advancedFilters.brands.includes(brand)}
                          onCheckedChange={(checked) => 
                            handleAdvancedFilterChange('brands', brand, checked as boolean)
                          }
                        />
                        <Label htmlFor={`brand-${brand}`} className="text-sm">{brand}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Types d'équipement</Label>
                  <div className="space-y-2">
                    {typeOptions.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={advancedFilters.types.includes(type)}
                          onCheckedChange={(checked) => 
                            handleAdvancedFilterChange('types', type, checked as boolean)
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Agences</Label>
                  <div className="space-y-2">
                    {agencyOptions.map(agency => (
                      <div key={agency} className="flex items-center space-x-2">
                        <Checkbox
                          id={`agency-${agency}`}
                          checked={advancedFilters.agencies.includes(agency)}
                          onCheckedChange={(checked) => 
                            handleAdvancedFilterChange('agencies', agency, checked as boolean)
                          }
                        />
                        <Label htmlFor={`agency-${agency}`} className="text-sm">{agency}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">État maintenance</Label>
                  <div className="space-y-2">
                    {maintenanceOptions.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`maintenance-${option}`}
                          checked={advancedFilters.maintenanceStatus.includes(option)}
                          onCheckedChange={(checked) => 
                            handleAdvancedFilterChange('maintenanceStatus', option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`maintenance-${option}`} className="text-sm">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setShowAdvancedFilters(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setShowAdvancedFilters(false)}>
                  Appliquer les filtres
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
