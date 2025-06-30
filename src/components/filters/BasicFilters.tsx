
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from 'lucide-react';

interface BasicFiltersProps {
  searchTerm: string;
  afNfFilter: string; // Changé de statusFilter à afNfFilter
  onSearchChange: (value: string) => void;
  onAfNfChange: (value: string) => void; // Changé de onStatusChange à onAfNfChange
}

export function BasicFilters({ 
  searchTerm, 
  afNfFilter, 
  onSearchChange, 
  onAfNfChange 
}: BasicFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Recherche globale
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ID, localisation, marque, modèle..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          AF/NF
        </Label>
        <Select value={afNfFilter} onValueChange={onAfNfChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="AF">AF</SelectItem>
            <SelectItem value="NF">NF</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
