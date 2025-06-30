
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Equipment } from '@/hooks/useEquipments';
import { toast } from 'sonner';
import { FilterHeader } from './filters/FilterHeader';
import { BasicFilters } from './filters/BasicFilters';
import { AdvancedFiltersDialog } from './filters/AdvancedFiltersDialog';
import { ActiveFiltersDisplay } from './filters/ActiveFiltersDisplay';

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
  const [afNfFilter, setAfNfFilter] = useState('all'); // Changé de statusFilter à afNfFilter
  const [advancedFilters, setAdvancedFilters] = useState({
    brands: [] as string[],
    types: [] as string[],
    agencies: [] as string[],
    maintenanceStatus: [] as string[]
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onFilterChange('search', value);
  };

  const handleAfNfChange = (value: string) => { // Changé de handleStatusChange à handleAfNfChange
    setAfNfFilter(value);
    onFilterChange('afNf', value); // Changé de 'status' à 'afNf'
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
    Object.entries(advancedFilters).forEach(([key, values]) => {
      onFilterChange(key, values.join(','));
    });
    setShowAdvancedFilters(false);
    toast.success('Filtres appliqués avec succès');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAfNfFilter('all'); // Changé de setStatusFilter à setAfNfFilter
    setAdvancedFilters({
      brands: [],
      types: [],
      agencies: [],
      maintenanceStatus: []
    });
    
    onFilterChange('search', '');
    onFilterChange('afNf', 'all'); // Changé de 'status' à 'afNf'
    onFilterChange('brands', '');
    onFilterChange('types', '');
    onFilterChange('agencies', '');
    onFilterChange('maintenanceStatus', '');
    
    toast.success('Filtres réinitialisés');
  };

  const activeFiltersCount = 
    (afNfFilter !== 'all' ? 1 : 0) + // Changé de statusFilter à afNfFilter
    Object.values(advancedFilters).reduce((acc, arr) => acc + arr.length, 0) +
    (searchTerm ? 1 : 0);

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <FilterHeader 
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-8">
              <BasicFilters
                searchTerm={searchTerm}
                afNfFilter={afNfFilter} // Changé de statusFilter à afNfFilter
                onSearchChange={handleSearchChange}
                onAfNfChange={handleAfNfChange} // Changé de onStatusChange à onAfNfChange
              />
            </div>
            
            <div className="md:col-span-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Actions
              </Label>
              <AdvancedFiltersDialog
                showAdvancedFilters={showAdvancedFilters}
                setShowAdvancedFilters={setShowAdvancedFilters}
                advancedFilters={advancedFilters}
                equipments={equipments}
                onAdvancedFilterChange={handleAdvancedFilterChange}
                onApplyFilters={applyAdvancedFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </div>

          <ActiveFiltersDisplay
            searchTerm={searchTerm}
            afNfFilter={afNfFilter} // Changé de statusFilter à afNfFilter
            advancedFilters={advancedFilters}
            onSearchChange={handleSearchChange}
            onAfNfChange={handleAfNfChange} // Changé de onStatusChange à onAfNfChange
          />
        </div>
      </CardContent>
    </Card>
  );
}
