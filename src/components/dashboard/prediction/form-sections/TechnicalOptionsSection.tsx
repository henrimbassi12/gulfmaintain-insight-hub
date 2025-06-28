
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PredictionData } from '../types';

interface TechnicalOptionsSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function TechnicalOptionsSection({ formData, onInputChange }: TechnicalOptionsSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Options Techniques</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label htmlFor="securite" className="text-xs">Sécurité</Label>
          <Select value={formData.securite} onValueChange={(value) => onInputChange('securite', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Oui">Oui</SelectItem>
              <SelectItem value="Non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="eclairage" className="text-xs">Éclairage</Label>
          <Select value={formData.eclairage} onValueChange={(value) => onInputChange('eclairage', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Oui">Oui</SelectItem>
              <SelectItem value="Non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="purge_circuit_eaux" className="text-xs">Purge du circuit</Label>
          <Select value={formData.purge_circuit_eaux} onValueChange={(value) => onInputChange('purge_circuit_eaux', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Oui">Oui</SelectItem>
              <SelectItem value="Non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="soufflage_parties_actives" className="text-xs">Soufflage parties actives</Label>
          <Select value={formData.soufflage_parties_actives} onValueChange={(value) => onInputChange('soufflage_parties_actives', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Oui">Oui</SelectItem>
              <SelectItem value="Non">Non</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
