
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="taux_remplissage" className="text-xs">Taux remplissage (%)</Label>
            <Input
              id="taux_remplissage"
              type="number"
              size="sm"
              value={formData.taux_remplissage === 0 ? '' : formData.taux_remplissage.toString()}
              onChange={(e) => onNumberInputChange('taux_remplissage', e.target.value)}
              placeholder="85"
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
            <Select value={formData.lineaire} onValueChange={(value) => onInputChange('lineaire', value)}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="0">0</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tension" className="text-xs">Tension (V)</Label>
            <Input
              id="tension"
              type="number"
              size="sm"
              value={formData.tension === 0 ? '' : formData.tension.toString()}
              onChange={(e) => onNumberInputChange('tension', e.target.value)}
              placeholder="220"
            />
          </div>
          <div>
            <Label htmlFor="intensite_avant" className="text-xs">Intensité avant (A)</Label>
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

      {/* Données techniques avancées */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Données Techniques Avancées</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label htmlFor="puissance_electrique" className="text-xs">Puissance électrique (W)</Label>
            <Input
              id="puissance_electrique"
              type="number"
              step="0.1"
              size="sm"
              value={formData.puissance_electrique === 0 ? '' : formData.puissance_electrique.toString()}
              onChange={(e) => onNumberInputChange('puissance_electrique', e.target.value)}
              placeholder="1500"
            />
          </div>
          <div>
            <Label htmlFor="debit_fluide" className="text-xs">Débit fluide (L/min)</Label>
            <Input
              id="debit_fluide"
              type="number"
              step="0.1"
              size="sm"
              value={formData.debit_fluide === 0 ? '' : formData.debit_fluide.toString()}
              onChange={(e) => onNumberInputChange('debit_fluide', e.target.value)}
              placeholder="8.5"
            />
          </div>
          <div>
            <Label htmlFor="pression_condenseur" className="text-xs">Pression condenseur (bar)</Label>
            <Input
              id="pression_condenseur"
              type="number"
              step="0.1"
              size="sm"
              value={formData.pression_condenseur === 0 ? '' : formData.pression_condenseur.toString()}
              onChange={(e) => onNumberInputChange('pression_condenseur', e.target.value)}
              placeholder="12.5"
            />
          </div>
          <div>
            <Label htmlFor="humidite" className="text-xs">Humidité (%)</Label>
            <Input
              id="humidite"
              type="number"
              step="0.1"
              size="sm"
              value={formData.humidite === 0 ? '' : formData.humidite.toString()}
              onChange={(e) => onNumberInputChange('humidite', e.target.value)}
              placeholder="65"
            />
          </div>
          <div>
            <Label htmlFor="co2_niveau" className="text-xs">Niveau CO2 (ppm)</Label>
            <Input
              id="co2_niveau"
              type="number"
              size="sm"
              value={formData.co2_niveau === 0 ? '' : formData.co2_niveau.toString()}
              onChange={(e) => onNumberInputChange('co2_niveau', e.target.value)}
              placeholder="400"
            />
          </div>
          <div>
            <Label htmlFor="vibrations" className="text-xs">Vibrations (Hz)</Label>
            <Input
              id="vibrations"
              type="number"
              step="0.1"
              size="sm"
              value={formData.vibrations === 0 ? '' : formData.vibrations.toString()}
              onChange={(e) => onNumberInputChange('vibrations', e.target.value)}
              placeholder="50"
            />
          </div>
          <div>
            <Label htmlFor="bruit" className="text-xs">Niveau sonore (dB)</Label>
            <Input
              id="bruit"
              type="number"
              step="0.1"
              size="sm"
              value={formData.bruit === 0 ? '' : formData.bruit.toString()}
              onChange={(e) => onNumberInputChange('bruit', e.target.value)}
              placeholder="45"
            />
          </div>
          <div>
            <Label htmlFor="consommation" className="text-xs">Consommation (kWh)</Label>
            <Input
              id="consommation"
              type="number"
              step="0.1"
              size="sm"
              value={formData.consommation === 0 ? '' : formData.consommation.toString()}
              onChange={(e) => onNumberInputChange('consommation', e.target.value)}
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

      {/* Paramètres supplémentaires */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Paramètres Environnementaux</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="performance_globale" className="text-xs">Performance globale (%)</Label>
            <Input
              id="performance_globale"
              type="number"
              step="0.1"
              size="sm"
              value={formData.performance_globale === 0 ? '' : formData.performance_globale.toString()}
              onChange={(e) => onNumberInputChange('performance_globale', e.target.value)}
              placeholder="85"
            />
          </div>
          <div>
            <Label htmlFor="temperature_ambiante" className="text-xs">Température ambiante (°C)</Label>
            <Input
              id="temperature_ambiante"
              type="number"
              step="0.1"
              size="sm"
              value={formData.temperature_ambiante === 0 ? '' : formData.temperature_ambiante.toString()}
              onChange={(e) => onNumberInputChange('temperature_ambiante', e.target.value)}
              placeholder="25"
            />
          </div>
          <div>
            <Label htmlFor="poids_frigo" className="text-xs">Poids frigo (kg)</Label>
            <Input
              id="poids_frigo"
              type="number"
              step="0.1"
              size="sm"
              value={formData.poids_frigo === 0 ? '' : formData.poids_frigo.toString()}
              onChange={(e) => onNumberInputChange('poids_frigo', e.target.value)}
              placeholder="120"
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
