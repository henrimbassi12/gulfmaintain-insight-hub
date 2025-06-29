
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Calculator, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

interface PredictionData {
  taux_remplissage: string;
  temperature: string;
  lineaire: string;
  tension: string;
  intensite_avant_entretien: string;
  technicien_gfi: string;
  division: string;
  secteur: string;
  partenaire: string;
  ville: string;
  quartier: string;
  type_frigo: string;
  af_nf: string;
  branding: string;
  securite: string;
  eclairage: string;
  purge_circuit_eaux: boolean;
  soufflage_parties_actives: boolean;
  date: string;
}

interface PredictionResult {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
}

export function AIPredictionForm() {
  const [formData, setFormData] = useState<PredictionData>({
    taux_remplissage: '',
    temperature: '',
    lineaire: '1',
    tension: '',
    intensite_avant_entretien: '',
    technicien_gfi: '',
    division: '',
    secteur: '',
    partenaire: '',
    ville: '',
    quartier: '',
    type_frigo: '',
    af_nf: 'AF',
    branding: '',
    securite: 'Disjoncteur',
    eclairage: 'O',
    purge_circuit_eaux: false,
    soufflage_parties_actives: false,
    date: new Date().toISOString().split('T')[0]
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof PredictionData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulation d'appel API de prédiction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: PredictionResult = {
        predicted_status: Math.random() > 0.5 ? 'Succès total' : 'Nécessite intervention',
        confidence_score: Math.round(80 + Math.random() * 15),
        risk_level: Math.random() > 0.7 ? 'Élevé' : Math.random() > 0.4 ? 'Moyen' : 'Faible',
        recommendations: [
          'Maintenance renforcée conseillée',
          'Surveillance de la température requise',
          'Vérification du système de refroidissement'
        ]
      };

      setPredictionResult(mockResult);
      toast.success('Prédiction IA générée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération de la prédiction');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      taux_remplissage: '',
      temperature: '',
      lineaire: '1',
      tension: '',
      intensite_avant_entretien: '',
      technicien_gfi: '',
      division: '',
      secteur: '',
      partenaire: '',
      ville: '',
      quartier: '',
      type_frigo: '',
      af_nf: 'AF',
      branding: '',
      securite: 'Disjoncteur',
      eclairage: 'O',
      purge_circuit_eaux: false,
      soufflage_parties_actives: false,
      date: new Date().toISOString().split('T')[0]
    });
    setPredictionResult(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-purple-800">Prédiction IA - Statut Post-Entretien</h2>
              <p className="text-sm text-purple-600 font-normal">Analyse prédictive du statut après maintenance</p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                IA Active
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Données Techniques */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Données Techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="taux_remplissage">Taux de remplissage (%)</Label>
                  <Input
                    id="taux_remplissage"
                    type="number"
                    value={formData.taux_remplissage}
                    onChange={(e) => handleInputChange('taux_remplissage', e.target.value)}
                    placeholder="Ex: 85"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Température (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    placeholder="Ex: 6.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lineaire">Linéaire</Label>
                  <Select value={formData.lineaire} onValueChange={(value) => handleInputChange('lineaire', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="0">0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tension">Tension (V)</Label>
                  <Input
                    id="tension"
                    type="number"
                    value={formData.tension}
                    onChange={(e) => handleInputChange('tension', e.target.value)}
                    placeholder="Ex: 220"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="intensite_avant_entretien">Intensité avant entretien (A)</Label>
                  <Input
                    id="intensite_avant_entretien"
                    type="number"
                    step="0.1"
                    value={formData.intensite_avant_entretien}
                    onChange={(e) => handleInputChange('intensite_avant_entretien', e.target.value)}
                    placeholder="Ex: 2.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="technicien_gfi">Technicien GFI</Label>
                  <Select value={formData.technicien_gfi} onValueChange={(value) => handleInputChange('technicien_gfi', value)}>
                    <SelectTrigger>
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
              </div>
            </div>

            {/* Localisation */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    placeholder="Ex: Centre"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="secteur">Secteur</Label>
                  <Input
                    id="secteur"
                    value={formData.secteur}
                    onChange={(e) => handleInputChange('secteur', e.target.value)}
                    placeholder="Ex: Commercial"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="partenaire">Partenaire</Label>
                  <Input
                    id="partenaire"
                    value={formData.partenaire}
                    onChange={(e) => handleInputChange('partenaire', e.target.value)}
                    placeholder="Ex: SABC"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.ville}
                    onChange={(e) => handleInputChange('ville', e.target.value)}
                    placeholder="Ex: Douala"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quartier">Quartier</Label>
                  <Input
                    id="quartier"
                    value={formData.quartier}
                    onChange={(e) => handleInputChange('quartier', e.target.value)}
                    placeholder="Ex: Akwa"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Équipement */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type_frigo">Type Frigo</Label>
                  <Select value={formData.type_frigo} onValueChange={(value) => handleInputChange('type_frigo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INNOVA 420">INNOVA 420</SelectItem>
                      <SelectItem value="INNOVA 1000">INNOVA 1000</SelectItem>
                      <SelectItem value="INNOVA 650">INNOVA 650</SelectItem>
                      <SelectItem value="SANDEN 500">SANDEN 500</SelectItem>
                      <SelectItem value="SUPER-35">SUPER-35</SelectItem>
                      <SelectItem value="FV 400">FV 400</SelectItem>
                      <SelectItem value="Autres">Autres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="af_nf">AF/NF</Label>
                  <Select value={formData.af_nf} onValueChange={(value) => handleInputChange('af_nf', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AF">AF</SelectItem>
                      <SelectItem value="NF">NF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="branding">Branding</Label>
                  <Input
                    id="branding"
                    value={formData.branding}
                    onChange={(e) => handleInputChange('branding', e.target.value)}
                    placeholder="Ex: Coca-Cola"
                  />
                </div>
              </div>
            </div>

            {/* Options Techniques */}
            <div className="bg-white rounded-lg p-4 border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options Techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="securite">Sécurité</Label>
                  <Select value={formData.securite} onValueChange={(value) => handleInputChange('securite', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disjoncteur">Disjoncteur</SelectItem>
                      <SelectItem value="Régulateur">Régulateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="eclairage">Éclairage</Label>
                  <Select value={formData.eclairage} onValueChange={(value) => handleInputChange('eclairage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O">O (Oui)</SelectItem>
                      <SelectItem value="N">N (Non)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="purge_circuit_eaux"
                    checked={formData.purge_circuit_eaux}
                    onCheckedChange={(checked) => handleInputChange('purge_circuit_eaux', !!checked)}
                  />
                  <Label htmlFor="purge_circuit_eaux">Purge du circuit d'évacuation des eaux</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="soufflage_parties_actives"
                    checked={formData.soufflage_parties_actives}
                    onCheckedChange={(checked) => handleInputChange('soufflage_parties_actives', !!checked)}
                  />
                  <Label htmlFor="soufflage_parties_actives">Soufflage des parties actives à l'air</Label>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="bg-white rounded-lg p-4 border">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full md:w-auto"
                  required
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700">
                <Calculator className="w-4 h-4 mr-2" />
                {isLoading ? 'Prédiction en cours...' : 'Lancer la Prédiction IA'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="border-purple-300 text-purple-700 hover:bg-purple-50">
                Réinitialiser
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Résultat de la prédiction */}
      {predictionResult && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Résultat de la Prédiction IA</h3>
                <p className="text-sm text-gray-600 font-normal">Analyse basée sur les données saisies</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-100 text-blue-800">Statut Prédit</Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600">{predictionResult.predicted_status}</p>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-purple-100 text-purple-800">Score de Confiance</Badge>
                </div>
                <p className="text-2xl font-bold text-purple-600">{predictionResult.confidence_score}%</p>
              </div>

              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={
                    predictionResult.risk_level === 'Élevé' ? 'bg-red-100 text-red-800' :
                    predictionResult.risk_level === 'Moyen' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }>
                    Niveau de Risque
                  </Badge>
                </div>
                <p className={`text-2xl font-bold ${
                  predictionResult.risk_level === 'Élevé' ? 'text-red-600' :
                  predictionResult.risk_level === 'Moyen' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {predictionResult.risk_level}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Recommandations</h4>
              <div className="space-y-2">
                {predictionResult.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border">
                    <p className="text-sm text-gray-700">• {rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
