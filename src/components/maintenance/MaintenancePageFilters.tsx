
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface MaintenancePageFiltersProps {
  filterBy: string;
  technicianFilter: string;
  onFilterByChange: (value: string) => void;
  onTechnicianFilterChange: (value: string) => void;
  onReset: () => void;
}

export function MaintenancePageFilters({
  filterBy,
  technicianFilter,
  onFilterByChange,
  onTechnicianFilterChange,
  onReset
}: MaintenancePageFiltersProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Filter className="w-5 h-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Statut</label>
            <Select value={filterBy} onValueChange={onFilterByChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="Prévu">Prévu</SelectItem>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Technicien</label>
            <Select value={technicianFilter} onValueChange={onTechnicianFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les techniciens</SelectItem>
                <SelectItem value="VOUKENG">VOUKENG</SelectItem>
                <SelectItem value="MBAPBOU Grégoire">MBAPBOU Grégoire</SelectItem>
                <SelectItem value="TCHINDA Constant">TCHINDA Constant</SelectItem>
                <SelectItem value="Cédric">Cédric</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={onReset}
              className="w-full"
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
