
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PredictionData } from '../types';

interface TechnicalDataSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function TechnicalDataSection({ formData, onInputChange }: TechnicalDataSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Données techniques</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="taux_remplissage_pct" className="text-xs">Taux de remplissage (%)</Label>
          <Input
            id="taux_remplissage_pct"
            type="number"
            size="sm"
            value={formData.taux_remplissage_pct}
            onChange={(e) => onInputChange('taux_remplissage_pct', e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="temperature_c" className="text-xs">Température (°C)</Label>
          <Input
            id="temperature_c"
            type="number"
            size="sm"
            value={formData.temperature_c}
            onChange={(e) => onInputChange('temperature_c', e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="lineaire_val" className="text-xs">Valeur linéaire</Label>
          <Input
            id="lineaire_val"
            type="number"
            size="sm"
            value={formData.lineaire_val}
            onChange={(e) => onInputChange('lineaire_val', e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="tension_v" className="text-xs">Tension (V)</Label>
          <Input
            id="tension_v"
            type="number"
            size="sm"
            value={formData.tension_v}
            onChange={(e) => onInputChange('tension_v', e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="intensite_avant_entretien_a" className="text-xs">Intensité avant entretien (A)</Label>
          <Input
            id="intensite_avant_entretien_a"
            type="number"
            size="sm"
            value={formData.intensite_avant_entretien_a}
            onChange={(e) => onInputChange('intensite_avant_entretien_a', e.target.value)}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
