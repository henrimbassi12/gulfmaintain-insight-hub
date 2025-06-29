
import React from 'react';
import { PredictionData } from '../types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TechnicalDataSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function TechnicalDataSection({ formData, onInputChange }: TechnicalDataSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Données Techniques</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="temperature">Température (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => onInputChange('temperature', e.target.value)}
            className="mt-1"
            placeholder="Ex: 25.5"
          />
        </div>
        
        <div>
          <Label htmlFor="humidity">Humidité (%)</Label>
          <Input
            id="humidity"
            type="number"
            step="0.1"
            value={formData.humidity}
            onChange={(e) => onInputChange('humidity', e.target.value)}
            className="mt-1"
            placeholder="Ex: 65.0"
            min="0"
            max="100"
          />
        </div>
        
        <div>
          <Label htmlFor="vibration">Vibrations (Hz)</Label>
          <Input
            id="vibration"
            type="number"
            step="0.1"
            value={formData.vibration}
            onChange={(e) => onInputChange('vibration', e.target.value)}
            className="mt-1"
            placeholder="Ex: 50.0"
            min="0"
          />
        </div>
        
        <div>
          <Label htmlFor="operatingHours">Heures de fonctionnement</Label>
          <Input
            id="operatingHours"
            type="number"
            value={formData.operatingHours}
            onChange={(e) => onInputChange('operatingHours', e.target.value)}
            className="mt-1"
            placeholder="Ex: 8760"
            min="0"
          />
        </div>
        
        <div>
          <Label htmlFor="failureHistory">Historique de pannes</Label>
          <Input
            id="failureHistory"
            type="number"
            value={formData.failureHistory}
            onChange={(e) => onInputChange('failureHistory', e.target.value)}
            className="mt-1"
            placeholder="Ex: 3"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
