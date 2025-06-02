
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, RotateCcw, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation...",
    });
    
    // Simuler l'export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Le fichier a été téléchargé avec succès.",
      });
    }, 2000);
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => 
      key !== 'search' && value !== 'all' && value !== ''
    ).length + (filters.search ? 1 : 0);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filtres</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
            </Badge>
          )}
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportData}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Exporter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResetFilters}
              disabled={activeFiltersCount === 0}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Réinitialiser
            </Button>
          </div>
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
                <SelectItem value="sara">Sara Tazi</SelectItem>
                <SelectItem value="karim">Karim Bennani</SelectItem>
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
                <SelectItem value="urgent">Urgent</SelectItem>
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
                <SelectItem value="fes-centre">Fès Centre</SelectItem>
                <SelectItem value="agadir-sud">Agadir Sud</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Filtres actifs:</span>
              {filters.search && (
                <Badge variant="outline" className="gap-1">
                  Recherche: "{filters.search}"
                  <button onClick={() => onFilterChange('search', '')}>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.technician !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Technicien: {filters.technician}
                  <button onClick={() => onFilterChange('technician', 'all')}>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.status !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Statut: {filters.status}
                  <button onClick={() => onFilterChange('status', 'all')}>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.agency !== 'all' && (
                <Badge variant="outline" className="gap-1">
                  Agence: {filters.agency}
                  <button onClick={() => onFilterChange('agency', 'all')}>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceFilters;
