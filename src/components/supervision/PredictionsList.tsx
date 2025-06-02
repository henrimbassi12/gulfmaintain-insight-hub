
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Calendar, Wrench, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FailurePrediction } from '@/hooks/useSupervision';

interface PredictionsListProps {
  predictions: FailurePrediction[];
  filters: {
    region: string;
    riskLevel: string;
    equipmentType: string;
    timeframe: string;
  };
}

export const PredictionsList: React.FC<PredictionsListProps> = ({ predictions, filters }) => {
  // Filter predictions based on filters
  const filteredPredictions = predictions.filter(prediction => {
    if (filters.riskLevel !== 'all') {
      if (filters.riskLevel === 'high' && prediction.failure_risk < 70) return false;
      if (filters.riskLevel === 'medium' && (prediction.failure_risk < 40 || prediction.failure_risk >= 70)) return false;
      if (filters.riskLevel === 'low' && prediction.failure_risk >= 40) return false;
    }
    return true;
  });

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "destructive";
    if (risk >= 60) return "secondary"; 
    return "outline";
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 80) return "Critique";
    if (risk >= 60) return "Élevé";
    if (risk >= 40) return "Moyen";
    return "Faible";
  };

  const getTypeLabel = (type: string) => {
    return type === 'AF' ? 'Arrêt Forcé' : 'Non Fonctionnel';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Prédictions de pannes IA
          </CardTitle>
          <CardDescription>
            Basées sur l'analyse des données historiques et des capteurs IoT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredPredictions.map((prediction) => (
              <div key={prediction.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{prediction.equipment_name}</h3>
                      <Badge variant={getRiskColor(prediction.failure_risk)}>
                        {getRiskLabel(prediction.failure_risk)} - {prediction.failure_risk}%
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(prediction.type)}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {prediction.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Prédiction: {format(new Date(prediction.predicted_date), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-3">
                      <Wrench className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Action recommandée:</p>
                        <p className="text-sm text-gray-600">{prediction.recommended_action}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      Programmer intervention
                    </Button>
                    <Button size="sm" variant="ghost">
                      Voir détails
                    </Button>
                  </div>
                </div>

                {/* Barre de progression du risque */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Niveau de risque</span>
                    <span>{prediction.failure_risk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        prediction.failure_risk >= 80 ? 'bg-red-500' :
                        prediction.failure_risk >= 60 ? 'bg-orange-500' : 
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${prediction.failure_risk}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPredictions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune prédiction ne correspond aux filtres sélectionnés.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
