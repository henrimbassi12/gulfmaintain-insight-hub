
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PredictionData } from '../types';

interface LocationSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function LocationSection({ formData, onInputChange }: LocationSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Localisation</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ville" className="text-xs">Ville</Label>
          <Input
            id="ville"
            size="sm"
            value={formData.ville}
            onChange={(e) => onInputChange('ville', e.target.value)}
            placeholder="Douala"
          />
        </div>
        <div>
          <Label htmlFor="quartier" className="text-xs">Quartier</Label>
          <Input
            id="quartier"
            size="sm"
            value={formData.quartier}
            onChange={(e) => onInputChange('quartier', e.target.value)}
            placeholder="Akwa"
          />
        </div>
      </div>
    </div>
  );
}
