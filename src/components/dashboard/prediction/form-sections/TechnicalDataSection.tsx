
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PredictionData } from '../types';

interface TechnicalDataSectionProps {
  formData: PredictionData;
  onNumberInputChange: (field: keyof PredictionData, value: string) => void;
}

export function TechnicalDataSection({ formData, onNumberInputChange }: TechnicalDataSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Données Techniques Principales</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="taux_remplissage_pct" className="text-xs">Taux remplissage (%)</Label>
          <Input
            id="taux_remplissage_pct"
            type="number"
            step="0.1"
            size="sm"
            value={formData.taux_remplissage_pct === 0 ? '' : formData.taux_remplissage_pct.toString()}
            onChange={(e) => onNumberInputChange('taux_remplissage_pct', e.target.value)}
            placeholder="75.5"
          />
        </div>
        <div>
          <Label htmlFor="temperature_c" className="text-xs">Température (°C)</Label>
          <Input
            id="temperature_c"
            type="number"
            step="0.1"
            size="sm"
            value={formData.temperature_c === 0 ? '' : formData.temperature_c.toString()}
            onChange={(e) => onNumberInputChange('temperature_c', e.target.value)}
            placeholder="6.5"
          />
        </div>
        <div>
          <Label htmlFor="lineaire_val" className="text-xs">Linéaire</Label>
          <Input
            id="lineaire_val"
            type="number"
            step="0.1"
            size="sm"
            value={formData.lineaire_val === 0 ? '' : formData.lineaire_val.toString()}
            onChange={(e) => onNumberInputChange('lineaire_val', e.target.value)}
            placeholder="1.0"
          />
        </div>
        <div>
          <Label htmlFor="tension_v" className="text-xs">Tension (V)</Label>
          <Input
            id="tension_v"
            type="number"
            step="0.1"
            size="sm"
            value={formData.tension_v === 0 ? '' : formData.tension_v.toString()}
            onChange={(e) => onNumberInputChange('tension_v', e.target.value)}
            placeholder="220.0"
          />
        </div>
        <div>
          <Label htmlFor="intensite_avant_entretien_a" className="text-xs">Intensité avant entretien (A)</Label>
          <Input
            id="intensite_avant_entretien_a"
            type="number"
            step="0.1"
            size="sm"
            value={formData.intensite_avant_entretien_a === 0 ? '' : formData.intensite_avant_entretien_a.toString()}
            onChange={(e) => onNumberInputChange('intensite_avant_entretien_a', e.target.value)}
            placeholder="2.5"
          />
        </div>
      </div>
    </div>
  );
}
