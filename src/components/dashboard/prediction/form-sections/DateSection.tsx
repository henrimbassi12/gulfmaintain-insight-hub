
import React from 'react';
import { PredictionData } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DateSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function DateSection({ formData, onInputChange }: DateSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="interventionDate">Date d'intervention</Label>
        <Input
          id="interventionDate"
          type="date"
          value={formData.interventionDate}
          onChange={(e) => onInputChange('interventionDate', e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="seasonality">Saisonnalité (mois)</Label>
        <Input
          id="seasonality"
          type="number"
          value={formData.seasonality}
          onChange={(e) => onInputChange('seasonality', e.target.value)}
          className="mt-1"
          placeholder="Ex: 6"
        />
      </div>
    </div>
  );
}
