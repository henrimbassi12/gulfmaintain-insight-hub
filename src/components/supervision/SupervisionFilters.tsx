
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface SupervisionFiltersProps {
  filters: {
    region: string;
    riskLevel: string;
    equipmentType: string;
    timeframe: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const SupervisionFilters: React.FC<SupervisionFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filtres:</span>
          </div>
          
          <Select value={filters.region} onValueChange={(value) => onFilterChange('region', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              <SelectItem value="tunis">Tunis</SelectItem>
              <SelectItem value="sfax">Sfax</SelectItem>
              <SelectItem value="sousse">Sousse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.riskLevel} onValueChange={(value) => onFilterChange('riskLevel', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Niveau de risque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="high">Élevé (&gt;70%)</SelectItem>
              <SelectItem value="medium">Moyen (30-70%)</SelectItem>
              <SelectItem value="low">Faible (&lt;30%)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.equipmentType} onValueChange={(value) => onFilterChange('equipmentType', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type d'équipement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="climatisation">Climatisation</SelectItem>
              <SelectItem value="electrique">Électrique</SelectItem>
              <SelectItem value="mecanique">Mécanique</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.timeframe} onValueChange={(value) => onFilterChange('timeframe', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 derniers jours</SelectItem>
              <SelectItem value="30">30 derniers jours</SelectItem>
              <SelectItem value="90">3 derniers mois</SelectItem>
              <SelectItem value="365">Année complète</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisionFilters;
