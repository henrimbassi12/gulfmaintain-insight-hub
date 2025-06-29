
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronDown, ChevronRight, RotateCcw, Play } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PredictionFormFields } from './prediction/PredictionFormFields';
import { PredictionResult } from './prediction/PredictionResult';
import { usePredictionApi } from './prediction/usePredictionApi';
import { PredictionData, PredictionResult as PredictionResultType } from './prediction/types';

export function AIPredictionSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<PredictionData>({
    taux_remplissage_pct: '0',
    temperature_c: '0',
    lineaire_val: '0',
    tension_v: '0',
    intensite_avant_entretien_a: '0',
    technicien_gfi: '',
    division: '',
    secteur: '',
    partenaire: '',
    ville: '',
    quartier: '',
    type_frigo: '',
    af_nf: 'AF',
    branding: '',
    securite: 'Oui',
    eclairage: 'Oui',
    purge_circuit_eaux: 'Oui',
    soufflage_parties_actives: 'Oui',
    date: new Date().toISOString().split('T')[0]
  });

  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const { handlePredict, isLoading } = usePredictionApi();

  const handleInputChange = (field: keyof PredictionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (field: keyof PredictionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onPredict = async () => {
    const result = await handlePredict(formData);
    if (result) {
      setPredictionResult(result);
    }
  };

  const resetForm = () => {
    setFormData({
      taux_remplissage_pct: '0',
      temperature_c: '0',
      lineaire_val: '0',
      tension_v: '0',
      intensite_avant_entretien_a: '0',
      technicien_gfi: '',
      division: '',
      secteur: '',
      partenaire: '',
      ville: '',
      quartier: '',
      type_frigo: '',
      af_nf: 'AF',
      branding: '',
      securite: 'Oui',
      eclairage: 'Oui',
      purge_circuit_eaux: 'Oui',
      soufflage_parties_actives: 'Oui',
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
            <PredictionFormFields
              formData={formData}
              onInputChange={handleInputChange}
              onNumberInputChange={handleNumberInputChange}
            />

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                onClick={onPredict} 
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
              <PredictionResult result={predictionResult} />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
