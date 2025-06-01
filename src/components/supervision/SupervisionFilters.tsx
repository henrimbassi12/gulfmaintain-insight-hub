
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, RotateCcw, User, MapPin } from "lucide-react";

interface SupervisionFiltersProps {
  filters: {
    dateRange: string;
    technician: string;
    region: string;
    riskLevel: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
}

const SupervisionFilters: React.FC<SupervisionFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onResetFilters 
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Filtres globaux</h3>
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Période
            </label>
            <Select value={filters.dateRange} onValueChange={(value) => onFilterChange('dateRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="all">Toutes périodes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-4 h-4" />
              Technicien
            </label>
            <Select value={filters.technician} onValueChange={(value) => onFilterChange('technician', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous techniciens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="ahmed">Ahmed Ben Ali</SelectItem>
                <SelectItem value="fatma">Fatma Trabelsi</SelectItem>
                <SelectItem value="mohamed">Mohamed Khelifi</SelectItem>
                <SelectItem value="sara">Sara Mansouri</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Région
            </label>
            <Select value={filters.region} onValueChange={(value) => onFilterChange('region', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes régions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="tunis-centre">Tunis Centre</SelectItem>
                <SelectItem value="tunis-nord">Tunis Nord</SelectItem>
                <SelectItem value="tunis-sud">Tunis Sud</SelectItem>
                <SelectItem value="ariana">Ariana</SelectItem>
                <SelectItem value="ben-arous">Ben Arous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1">
              Niveau de risque
            </label>
            <Select value={filters.riskLevel} onValueChange={(value) => onFilterChange('riskLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tous niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="high">🔴 Élevé (80%+)</SelectItem>
                <SelectItem value="medium">🔶 Moyen (60-79%)</SelectItem>
                <SelectItem value="low">🟢 Faible (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisionFilters;
