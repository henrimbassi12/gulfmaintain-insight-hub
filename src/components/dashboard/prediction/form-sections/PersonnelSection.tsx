
import React from 'react';
import { PredictionData } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PersonnelSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function PersonnelSection({ formData, onInputChange }: PersonnelSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Ressources Humaines</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="availableTechnicians">Techniciens disponibles</Label>
          <Input
            id="availableTechnicians"
            type="number"
            value={formData.availableTechnicians}
            onChange={(e) => onInputChange('availableTechnicians', e.target.value)}
            className="mt-1"
            placeholder="Ex: 3"
            min="0"
          />
        </div>
        
        <div>
          <Label htmlFor="technicianExperience">Expérience moyenne (années)</Label>
          <Input
            id="technicianExperience"
            type="number"
            value={formData.technicianExperience}
            onChange={(e) => onInputChange('technicianExperience', e.target.value)}
            className="mt-1"
            placeholder="Ex: 5"
            min="0"
          />
        </div>
        
        <div>
          <Label htmlFor="workload">Charge de travail actuelle (%)</Label>
          <Input
            id="workload"
            type="number"
            value={formData.workload}
            onChange={(e) => onInputChange('workload', e.target.value)}
            className="mt-1"
            placeholder="Ex: 75"
            min="0"
            max="100"
          />
        </div>
        
        <div>
          <Label htmlFor="responseTime">Temps de réponse souhaité (heures)</Label>
          <Input
            id="responseTime"
            type="number"
            value={formData.responseTime}
            onChange={(e) => onInputChange('responseTime', e.target.value)}
            className="mt-1"
            placeholder="Ex: 2"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
