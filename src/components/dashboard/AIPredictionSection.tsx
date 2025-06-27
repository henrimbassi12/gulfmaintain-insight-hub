
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Calculator, TrendingUp, AlertTriangle, ChevronDown, ChevronRight, RotateCcw, Play } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from 'sonner';

interface PredictionData {
  taux_remplissage: number;
  temperature: number;
  lineaire: string;
  tension: number;
  intensite_avant: number;
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
  purge_circuit: string;
  soufflage_parties: string;
  date: string;
}

interface PredictionResult {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
}

export function AIPredictionSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<PredictionData>({
    taux_remplissage: 0,
    temperature: 0,
    lineaire: '1',
    tension: 0,
    intensite_avant: 0,
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
    purge_circuit: 'O',
    soufflage_parties: 'O',
    date: new Date().toISOString().split('T')[0]
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof PredictionData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (field: keyof PredictionData, value: string) => {
    const numericValue = value === '' ? 0 : Number(value);
    setFormData(prev => ({ ...prev, [field]: numericValue }));
  };

  const handlePredict = async () => {
    setIsLoading(true);

    // Simulation d'appel API
    setTimeout(() => {
      const mockResult: PredictionResult = {
        predicted_status: 'Succès total',
        confidence_score: Math.round(85 + Math.random() * 10),
        risk_level: Math.random() > 0.7 ? 'Élevé' : Math.random() > 0.4 ? 'Moyen' : 'Faible',
        recommendations: [
          'Maintenance renforcée recommandée',
          'Surveillance de la température conseillée',
          'Vérification du système de refroidissement'
        ]
      };

      setPredictionResult(mockResult);
      setIsLoading(false);
      toast.success('Prédiction IA générée avec succès');
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      taux_remplissage: 0,
      temperature: 0,
      lineaire: '1',
      tension: 0,
      intensite_avant: 0,
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
      purge_circuit: 'O',
      soufflage_parties: 'O',
      date: new Date().toISOString().split('T')[0]
    });
    setPredictionResult(null);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Prédiction IA Post-Entretien</h3>
                  <p className="text-sm text-gray-500 font-normal">Analyse prédictive du statut après maintenance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {predictionResult && (
                  <Badge variant="outline" className="text-xs">
                    Dernière prédiction: {predictionResult.confidence_score}%
                  </Badge>
                )}
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-6">
            {/* Formulaire de saisie */}
            <div className="space-y-4">
              {/* Données techniques essentielles */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Données Techniques</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <Label htmlFor="taux_remplissage" className="text-xs">Taux remplissage (%)</Label>
                    <Input
                      id="taux_remplissage"
                      type="number"
                      size="sm"
                      value={formData.taux_remplissage}
                      onChange={(e) => handleNumberInputChange('taux_remplissage', e.target.value)}
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
                      value={formData.temperature}
                      onChange={(e) => handleNumberInputChange('temperature', e.target.value)}
                      placeholder="6.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lineaire" className="text-xs">Linéaire</Label>
                    <Select value={formData.lineaire} onValueChange={(value) => handleInputChange('lineaire', value)}>
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
                      value={formData.tension}
                      onChange={(e) => handleNumberInputChange('tension', e.target.value)}
                      placeholder="220"
                    />
                  </div>
                  <div>
                    <Label htmlFor="intensite_avant" className="text-xs">Intensité (A)</Label>
                    <Input
                      id="intensite_avant"
                      type="number"
                      step="0.1"
                      size="sm"
                      value={formData.intensite_avant}
                      onChange={(e) => handleNumberInputChange('intensite_avant', e.target.value)}
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
                    <Select value={formData.technicien_gfi} onValueChange={(value) => handleInputChange('technicien_gfi', value)}>
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
                      onChange={(e) => handleInputChange('division', e.target.value)}
                      placeholder="Centre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secteur" className="text-xs">Secteur</Label>
                    <Input
                      id="secteur"
                      size="sm"
                      value={formData.secteur}
                      onChange={(e) => handleInputChange('secteur', e.target.value)}
                      placeholder="Commercial"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partenaire" className="text-xs">Partenaire</Label>
                    <Input
                      id="partenaire"
                      size="sm"
                      value={formData.partenaire}
                      onChange={(e) => handleInputChange('partenaire', e.target.value)}
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
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      placeholder="Douala"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quartier" className="text-xs">Quartier</Label>
                    <Input
                      id="quartier"
                      size="sm"
                      value={formData.quartier}
                      onChange={(e) => handleInputChange('quartier', e.target.value)}
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
                    <Select value={formData.type_frigo} onValueChange={(value) => handleInputChange('type_frigo', value)}>
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
                    <Select value={formData.af_nf} onValueChange={(value) => handleInputChange('af_nf', value)}>
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
                      onChange={(e) => handleInputChange('branding', e.target.value)}
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
                    <Select value={formData.securite} onValueChange={(value) => handleInputChange('securite', value)}>
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
                    <Select value={formData.eclairage} onValueChange={(value) => handleInputChange('eclairage', value)}>
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
                    <Select value={formData.purge_circuit} onValueChange={(value) => handleInputChange('purge_circuit', value)}>
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
                    <Select value={formData.soufflage_parties} onValueChange={(value) => handleInputChange('soufflage_parties', value)}>
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
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={handlePredict} 
                  disabled={isLoading}
                  className="flex-1 md:flex-none"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isLoading ? 'Prédiction en cours...' : 'Lancer prédiction'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                  className="flex-1 md:flex-none"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Modifier les données
                </Button>
              </div>

              {/* Résultat de la prédiction */}
              {predictionResult && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900">Résultat de la Prédiction</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Statut Prédit</p>
                      <p className="text-lg font-bold text-blue-600">{predictionResult.predicted_status}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Confiance</p>
                      <p className="text-lg font-bold text-purple-600">{predictionResult.confidence_score}%</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">Risque</p>
                      <p className={`text-lg font-bold ${
                        predictionResult.risk_level === 'Élevé' ? 'text-red-600' :
                        predictionResult.risk_level === 'Moyen' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {predictionResult.risk_level}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Recommandations</h5>
                    <div className="space-y-1">
                      {predictionResult.recommendations.map((rec, index) => (
                        <p key={index} className="text-xs text-gray-700 bg-white rounded px-2 py-1">• {rec}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
