
import React from 'react';
import { PredictionData } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EquipmentSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function EquipmentSection({ formData, onInputChange }: EquipmentSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Informations Équipement</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="equipmentType">Type d'équipement</Label>
          <Select value={formData.equipmentType} onValueChange={(value) => onInputChange('equipmentType', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="refrigerator">Réfrigérateur</SelectItem>
              <SelectItem value="freezer">Congélateur</SelectItem>
              <SelectItem value="air_conditioner">Climatiseur</SelectItem>
              <SelectItem value="generator">Générateur</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="equipmentAge">Âge de l'équipement (années)</Label>
          <Input
            id="equipmentAge"
            type="number"
            value={formData.equipmentAge}
            onChange={(e) => onInputChange('equipmentAge', e.target.value)}
            className="mt-1"
            placeholder="Ex: 5"
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="lastMaintenanceDate">Dernière maintenance</Label>
          <Input
            id="lastMaintenanceDate"
            type="date"
            value={formData.lastMaintenanceDate}
            onChange={(e) => onInputChange('lastMaintenanceDate', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="usageIntensity">Intensité d'usage (1-10)</Label>
          <Input
            id="usageIntensity"
            type="number"
            value={formData.usageIntensity}
            onChange={(e) => onInputChange('usageIntensity', e.target.value)}
            className="mt-1"
            placeholder="Ex: 7"
            min="1"
            max="10"
          />
        </div>
      </div>
    </div>
  );
}
