
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Zap, TrendingUp } from "lucide-react";
import { PredictionFormFields } from './prediction/PredictionFormFields';
import { PredictionResult } from './prediction/PredictionResult';
import { PredictionData } from './prediction/types';
import { usePredictionApi } from './prediction/usePredictionApi';

export function AIPredictionSection() {
  const [formData, setFormData] = useState<PredictionData>({
    taux_remplissage_pct: '',
    temperature_c: '',
    lineaire_val: '',
    tension_v: '',
    intensite_avant_entretien_a: '',
    technicien_gfi: '',
    division: '',
    secteur: '',
    partenaire: '',
    ville: '',
    quartier: '',
    type_frigo: '',
    af_nf: '',
    branding: '',
    securite: '',
    eclairage: '',
    purge_circuit_eaux: '',
    soufflage_parties_actives: '',
    date: '',
    interventionDate: '',
    seasonality: '',
    equipmentType: '',
    equipmentAge: '',
    lastMaintenanceDate: '',
    usageIntensity: '',
    latitude: '',
    longitude: '',
    availableTechnicians: '',
    technicianExperience: '',
    workload: '',
    responseTime: '',
    temperature: '',
    humidity: '',
    vibration: '',
    operatingHours: '',
    failureHistory: ''
  });

  const { predict, isLoading, result, error } = usePredictionApi();

  const handleInputChange = (field: keyof PredictionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    await predict(formData);
  };

  const handleReset = () => {
    setFormData({
      taux_remplissage_pct: '',
      temperature_c: '',
      lineaire_val: '',
      tension_v: '',
      intensite_avant_entretien_a: '',
      technicien_gfi: '',
      division: '',
      secteur: '',
      partenaire: '',
      ville: '',
      quartier: '',
      type_frigo: '',
      af_nf: '',
      branding: '',
      securite: '',
      eclairage: '',
      purge_circuit_eaux: '',
      soufflage_parties_actives: '',
      date: '',
      interventionDate: '',
      seasonality: '',
      equipmentType: '',
      equipmentAge: '',
      lastMaintenanceDate: '',
      usageIntensity: '',
      latitude: '',
      longitude: '',
      availableTechnicians: '',
      technicianExperience: '',
      workload: '',
      responseTime: '',
      temperature: '',
      humidity: '',
      vibration: '',
      operatingHours: '',
      failureHistory: ''
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-purple-800">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          Prédiction IA - Analyse Prédictive
          <div className="flex gap-2 ml-auto">
            <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              <Zap className="w-3 h-3" />
              IA Active
            </div>
            <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              Haute Précision
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PredictionFormFields
          formData={formData}
          onInputChange={handleInputChange}
        />
        
        <div className="flex gap-3">
          <Button 
            onClick={handlePredict}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
          >
            {isLoading ? 'Analyse en cours...' : 'Lancer la Prédiction IA'}
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Réinitialiser
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">Erreur: {error}</p>
          </div>
        )}

        {result && (
          <PredictionResult
            predicted_status={result.predicted_status}
            confidence_score={result.confidence_score}
            risk_level={result.risk_level}
            recommendations={result.recommendations}
            probabilities={result.probabilities}
          />
        )}
      </CardContent>
    </Card>
  );
}
