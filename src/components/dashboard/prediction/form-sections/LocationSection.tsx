
import React from 'react';
import { PredictionData } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LocationSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function LocationSection({ formData, onInputChange }: LocationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Localisation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => onInputChange('latitude', e.target.value)}
            className="mt-1"
            placeholder="Ex: 4.0511"
          />
        </div>
        
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => onInputChange('longitude', e.target.value)}
            className="mt-1"
            placeholder="Ex: 9.7679"
          />
        </div>
      </div>
    </div>
  );
}
