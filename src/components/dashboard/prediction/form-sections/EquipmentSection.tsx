
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PredictionData } from '../types';

interface EquipmentSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function EquipmentSection({ formData, onInputChange }: EquipmentSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Équipement</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label htmlFor="type_frigo" className="text-xs">Type Frigo</Label>
          <Select value={formData.type_frigo} onValueChange={(value) => onInputChange('type_frigo', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INNOVA 420">INNOVA 420</SelectItem>
              <SelectItem value="INNOVA 1000">INNOVA 1000</SelectItem>
              <SelectItem value="INNOVA 650">INNOVA 650</SelectItem>
              <SelectItem value="SANDEN 500">SANDEN 500</SelectItem>
              <SelectItem value="SUPER-35">SUPER-35</SelectItem>
              <SelectItem value="FV 400">FV 400</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="af_nf" className="text-xs">AF/NF</Label>
          <Select value={formData.af_nf} onValueChange={(value) => onInputChange('af_nf', value)}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AF">AF</SelectItem>
              <SelectItem value="NF">NF</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="branding" className="text-xs">Branding</Label>
          <Input
            id="branding"
            size="sm"
            value={formData.branding}
            onChange={(e) => onInputChange('branding', e.target.value)}
            placeholder="Coca-Cola"
          />
        </div>
      </div>
    </div>
  );
}
