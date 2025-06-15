import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Calendar, Wrench, TrendingUp, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FailurePrediction } from '@/hooks/useSupervision';
import { toast } from 'sonner';

interface PredictionsListProps {
  predictions: FailurePrediction[];
  filters: {
    region: string;
    riskLevel: string;
    equipmentType: string;
    timeframe: string;
  };
  onProgramIntervention: (prediction: FailurePrediction) => void;
  onShowDetails: (prediction: FailurePrediction) => void;
}

export const PredictionsList: React.FC<PredictionsListProps> = ({ predictions, filters, onProgramIntervention, onShowDetails }) => {
  const filteredPredictions = predictions.filter(prediction => {
    if (filters.region !== 'all' && prediction.location.toLowerCase().replace(/ /g, '-') !== filters.region) return false;

    if (filters.riskLevel !== 'all') {
      const risk = prediction.failure_risk;
      if (filters.riskLevel === 'high' && risk <= 70) return false;
      if (filters.riskLevel === 'medium' && (risk < 30 || risk > 70)) return false;
      if (filters.riskLevel === 'low' && risk >= 30) return false;
    }

    if (filters.equipmentType !== 'all') {
      const equipmentName = prediction.equipment_name.toLowerCase();
      switch(filters.equipmentType) {
        case 'refrigeration':
          if (!equipmentName.includes('réfrigérateur')) return false;
          break;
        case 'climatisation':
          if (!equipmentName.includes('climatiseur')) return false;
          break;
        case 'hvac':
          if (!equipmentName.includes('hvac')) return false;
          break;
        // Pas de données pour 'electrique' ou 'mecanique' dans les prédictions pour l'instant
      }
    }
    
    return true;
  });

  const getRiskColor = (risk: number) => {
    if (risk > 70) return "destructive";
    if (risk >= 30) return "secondary"; 
    return "outline";
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 70) return "Élevé";
    if (risk >= 30) return "Moyen";
    return "Faible";
  };

  const getTypeLabel = (type: string) => {
    return type === 'AF' ? 'Arrêt Forcé' : 'Non Fonctionnel';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
            Prédictions de pannes IA
          </CardTitle>
          <CardDescription className="text-sm">
            Basées sur l'analyse des données historiques et des capteurs IoT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4">
            {filteredPredictions.map((prediction) => (
              <div key={prediction.id} className="p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 mb-2">
                      <h3 className="font-semibold text-base md:text-lg">{prediction.equipment_name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getRiskColor(prediction.failure_risk)} className="text-xs">
                          {getRiskLabel(prediction.failure_risk)} - {prediction.failure_risk}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">{getTypeLabel(prediction.type)}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate">{prediction.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Prédiction: {format(new Date(prediction.predicted_date), 'dd/MM/yyyy', { locale: fr })}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mb-3">
                      <Wrench className="w-3 h-3 md:w-4 md:h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs md:text-sm font-medium text-gray-700">Action recommandée:</p>
                        <p className="text-xs md:text-sm text-gray-600 break-words">{prediction.recommended_action}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 md:ml-4">
                    <Button size="sm" variant="outline" className="flex-1 md:flex-none text-xs" onClick={() => onProgramIntervention(prediction)}>
                      Programmer intervention
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1 md:flex-none text-xs" onClick={() => onShowDetails(prediction)}>
                      <Eye />
                      Voir détails
                    </Button>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Niveau de risque</span>
                    <span>{prediction.failure_risk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        prediction.failure_risk > 70 ? 'bg-red-500' :
                        prediction.failure_risk >= 30 ? 'bg-orange-500' : 
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
              <TrendingUp className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm md:text-base">Aucune prédiction ne correspond aux filtres sélectionnés.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
