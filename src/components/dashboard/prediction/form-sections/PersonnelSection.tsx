
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PredictionData } from '../types';

interface PersonnelSectionProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string) => void;
}

export function PersonnelSection({ formData, onInputChange }: PersonnelSectionProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Personnel & Organisation</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label htmlFor="technicien_gfi" className="text-xs">Technicien GFI</Label>
          <Select value={formData.technicien_gfi} onValueChange={(value) => onInputChange('technicien_gfi', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VOUKENG">VOUKENG</SelectItem>
              <SelectItem value="MBAPBOU Grégoire">MBAPBOU Grégoire</SelectItem>
              <SelectItem value="TCHINDA Constant">TCHINDA Constant</SelectItem>
              <SelectItem value="Cédric">Cédric</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="division" className="text-xs">Division</Label>
          <Input
            id="division"
            size="sm"
            value={formData.division}
            onChange={(e) => onInputChange('division', e.target.value)}
            placeholder="Centre"
          />
        </div>
        <div>
          <Label htmlFor="secteur" className="text-xs">Secteur</Label>
          <Input
            id="secteur"
            size="sm"
            value={formData.secteur}
            onChange={(e) => onInputChange('secteur', e.target.value)}
            placeholder="Commercial"
          />
        </div>
        <div>
          <Label htmlFor="partenaire" className="text-xs">Partenaire</Label>
          <Input
            id="partenaire"
            size="sm"
            value={formData.partenaire}
            onChange={(e) => onInputChange('partenaire', e.target.value)}
            placeholder="SABC"
          />
        </div>
      </div>
    </div>
  );
}
