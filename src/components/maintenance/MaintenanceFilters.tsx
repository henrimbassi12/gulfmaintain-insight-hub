
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";

interface MaintenanceFiltersProps {
  filters: {
    technician: string;
    status: string;
    agency: string;
    equipment: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const MaintenanceFilters: React.FC<MaintenanceFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onResetFilters 
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filtres</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResetFilters}
            className="ml-auto"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Rechercher intervention, équipement..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Technicien
            </label>
            <Select value={filters.technician} onValueChange={(value) => onFilterChange('technician', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="ahmed">Ahmed Benali</SelectItem>
                <SelectItem value="fatima">Fatima Zahra</SelectItem>
                <SelectItem value="mohamed">Mohamed Alami</SelectItem>
                <SelectItem value="youssef">Youssef Idrissi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Statut
            </label>
            <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="planned">Planifié</SelectItem>
                <SelectItem value="in-progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Agence
            </label>
            <Select value={filters.agency} onValueChange={(value) => onFilterChange('agency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="casablanca-nord">Casablanca Nord</SelectItem>
                <SelectItem value="rabat-centre">Rabat Centre</SelectItem>
                <SelectItem value="marrakech-sud">Marrakech Sud</SelectItem>
                <SelectItem value="tanger-port">Tanger Port</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceFilters;
