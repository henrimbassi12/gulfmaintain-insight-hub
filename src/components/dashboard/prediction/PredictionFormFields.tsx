
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PredictionData } from './types';

interface PredictionFormFieldsProps {
  formData: PredictionData;
  onInputChange: (field: keyof PredictionData, value: string | number) => void;
  onNumberInputChange: (field: keyof PredictionData, value: string) => void;
}

export function PredictionFormFields({ formData, onInputChange, onNumberInputChange }: PredictionFormFieldsProps) {
  return (
    <div className="space-y-4">
      
      {/* Données techniques essentielles */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Données Techniques Principales</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="Taux_remplissage_pct" className="text-xs">Taux remplissage (%)</Label>
            <Input
              id="Taux_remplissage_pct"
              type="number"
              step="0.1"
              size="sm"
              value={formData.Taux_remplissage_pct === 0 ? '' : formData.Taux_remplissage_pct.toString()}
              onChange={(e) => onNumberInputChange('Taux_remplissage_pct', e.target.value)}
              placeholder="75.5"
            />
          </div>
          <div>
            <Label htmlFor="Temperature_C" className="text-xs">Température (°C)</Label>
            <Input
              id="Temperature_C"
              type="number"
              step="0.1"
              size="sm"
              value={formData.Temperature_C === 0 ? '' : formData.Temperature_C.toString()}
              onChange={(e) => onNumberInputChange('Temperature_C', e.target.value)}
              placeholder="6.5"
            />
          </div>
          <div>
            <Label htmlFor="Lineaire_val" className="text-xs">Linéaire</Label>
            <Input
              id="Lineaire_val"
              type="number"
              step="0.1"
              size="sm"
              value={formData.Lineaire_val === 0 ? '' : formData.Lineaire_val.toString()}
              onChange={(e) => onNumberInputChange('Lineaire_val', e.target.value)}
              placeholder="1.0"
            />
          </div>
          <div>
            <Label htmlFor="Tension_V" className="text-xs">Tension (V)</Label>
            <Input
              id="Tension_V"
              type="number"
              step="0.1"
              size="sm"
              value={formData.Tension_V === 0 ? '' : formData.Tension_V.toString()}
              onChange={(e) => onNumberInputChange('Tension_V', e.target.value)}
              placeholder="220.0"
            />
          </div>
          <div>
            <Label htmlFor="Intensite_avant_entretien_A" className="text-xs">Intensité avant entretien (A)</Label>
            <Input
              id="Intensite_avant_entretien_A"
              type="number"
              step="0.1"
              size="sm"
              value={formData.Intensite_avant_entretien_A === 0 ? '' : formData.Intensite_avant_entretien_A.toString()}
              onChange={(e) => onNumberInputChange('Intensite_avant_entretien_A', e.target.value)}
              placeholder="2.5"
            />
          </div>
        </div>
      </div>

      {/* Personnel & Organisation */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Personnel & Organisation</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="Technicien_GFI" className="text-xs">Technicien GFI</Label>
            <Select value={formData.Technicien_GFI} onValueChange={(value) => onInputChange('Technicien_GFI', value)}>
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
            <Label htmlFor="Division" className="text-xs">Division</Label>
            <Input
              id="Division"
              size="sm"
              value={formData.Division}
              onChange={(e) => onInputChange('Division', e.target.value)}
              placeholder="Centre"
            />
          </div>
          <div>
            <Label htmlFor="Secteur" className="text-xs">Secteur</Label>
            <Input
              id="Secteur"
              size="sm"
              value={formData.Secteur}
              onChange={(e) => onInputChange('Secteur', e.target.value)}
              placeholder="Commercial"
            />
          </div>
          <div>
            <Label htmlFor="Partenaire" className="text-xs">Partenaire</Label>
            <Input
              id="Partenaire"
              size="sm"
              value={formData.Partenaire}
              onChange={(e) => onInputChange('Partenaire', e.target.value)}
              placeholder="SABC"
            />
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Localisation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="Ville" className="text-xs">Ville</Label>
            <Input
              id="Ville"
              size="sm"
              value={formData.Ville}
              onChange={(e) => onInputChange('Ville', e.target.value)}
              placeholder="Douala"
            />
          </div>
          <div>
            <Label htmlFor="Quartier" className="text-xs">Quartier</Label>
            <Input
              id="Quartier"
              size="sm"
              value={formData.Quartier}
              onChange={(e) => onInputChange('Quartier', e.target.value)}
              placeholder="Akwa"
            />
          </div>
        </div>
      </div>

      {/* Équipement */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Équipement</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="Type_Frigo" className="text-xs">Type Frigo</Label>
            <Select value={formData.Type_Frigo} onValueChange={(value) => onInputChange('Type_Frigo', value)}>
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
            <Label htmlFor="AF_NF" className="text-xs">AF/NF</Label>
            <Select value={formData.AF_NF} onValueChange={(value) => onInputChange('AF_NF', value)}>
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
            <Label htmlFor="Branding" className="text-xs">Branding</Label>
            <Input
              id="Branding"
              size="sm"
              value={formData.Branding}
              onChange={(e) => onInputChange('Branding', e.target.value)}
              placeholder="Coca-Cola"
            />
          </div>
        </div>
      </div>

      {/* Options techniques */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Options Techniques</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="Securite" className="text-xs">Sécurité</Label>
            <Select value={formData.Securite} onValueChange={(value) => onInputChange('Securite', value)}>
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
            <Label htmlFor="Eclairage" className="text-xs">Éclairage</Label>
            <Select value={formData.Eclairage} onValueChange={(value) => onInputChange('Eclairage', value)}>
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
            <Label htmlFor="Purge_circuit_eaux" className="text-xs">Purge du circuit</Label>
            <Select value={formData.Purge_circuit_eaux} onValueChange={(value) => onInputChange('Purge_circuit_eaux', value)}>
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
            <Label htmlFor="Soufflage_parties_actives" className="text-xs">Soufflage parties actives</Label>
            <Select value={formData.Soufflage_parties_actives} onValueChange={(value) => onInputChange('Soufflage_parties_actives', value)}>
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

      {/* Date */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Date d'intervention</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="Date" className="text-xs">Date</Label>
            <Input
              id="Date"
              type="date"
              size="sm"
              value={formData.Date}
              onChange={(e) => onInputChange('Date', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
