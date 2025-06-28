
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
            <Label htmlFor="taux_remplissage" className="text-xs">Taux remplissage (%)</Label>
            <Input
              id="taux_remplissage"
              type="number"
              step="0.1"
              size="sm"
              value={formData.taux_remplissage === 0 ? '' : formData.taux_remplissage.toString()}
              onChange={(e) => onNumberInputChange('taux_remplissage', e.target.value)}
              placeholder="75.5"
            />
          </div>
          <div>
            <Label htmlFor="temperature" className="text-xs">Température (°C)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              size="sm"
              value={formData.temperature === 0 ? '' : formData.temperature.toString()}
              onChange={(e) => onNumberInputChange('temperature', e.target.value)}
              placeholder="6.5"
            />
          </div>
          <div>
            <Label htmlFor="lineaire" className="text-xs">Linéaire</Label>
            <Input
              id="lineaire"
              type="number"
              step="0.1"
              size="sm"
              value={formData.lineaire === 0 ? '' : formData.lineaire.toString()}
              onChange={(e) => onNumberInputChange('lineaire', e.target.value)}
              placeholder="1.0"
            />
          </div>
          <div>
            <Label htmlFor="tension" className="text-xs">Tension (V)</Label>
            <Input
              id="tension"
              type="number"
              step="0.1"
              size="sm"
              value={formData.tension === 0 ? '' : formData.tension.toString()}
              onChange={(e) => onNumberInputChange('tension', e.target.value)}
              placeholder="220.0"
            />
          </div>
          <div>
            <Label htmlFor="intensite_avant" className="text-xs">Intensité avant entretien (A)</Label>
            <Input
              id="intensite_avant"
              type="number"
              step="0.1"
              size="sm"
              value={formData.intensite_avant === 0 ? '' : formData.intensite_avant.toString()}
              onChange={(e) => onNumberInputChange('intensite_avant', e.target.value)}
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
            <Label htmlFor="technicien_gfi" className="text-xs">Technicien GFI</Label>
            <Select value={formData.technicien_gfi} onValueChange={(value) => onInputChange('technicien_gfi', value)}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VOUKENG">VOUKENG</SelectItem>
                <SelectItem value="MBAPBOU Grégoire">MBAPBOU Grégoire</SelectItem>
                <SelectItem value="TCHINDA Constant">TCHINDA Constant</SelectItem>
                <SelectItem value="Cédric">Cédrice</SelectItem>
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

      {/* Localisation */}
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

      {/* Équipement */}
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

      {/* Options techniques */}
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
                <SelectItem value="Disjoncteur">Disjoncteur</SelectItem>
                <SelectItem value="Régulateur">Régulateur</SelectItem>
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
                <SelectItem value="O">O (Oui)</SelectItem>
                <SelectItem value="N">N (Non)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="purge_circuit" className="text-xs">Purge du circuit</Label>
            <Select value={formData.purge_circuit} onValueChange={(value) => onInputChange('purge_circuit', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="O">O (Oui)</SelectItem>
                <SelectItem value="N">N (Non)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="soufflage_parties" className="text-xs">Soufflage parties actives</Label>
            <Select value={formData.soufflage_parties} onValueChange={(value) => onInputChange('soufflage_parties', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="O">O (Oui)</SelectItem>
                <SelectItem value="N">N (Non)</SelectItem>
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
            <Label htmlFor="date" className="text-xs">Date</Label>
            <Input
              id="date"
              type="date"
              size="sm"
              value={formData.date}
              onChange={(e) => onInputChange('date', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
