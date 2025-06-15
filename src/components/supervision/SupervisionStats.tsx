
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';

interface SupervisionStatsProps {
  predictions: FailurePrediction[];
  recommendations: TechnicianRecommendation[];
}

export const SupervisionStats: React.FC<SupervisionStatsProps> = ({ predictions, recommendations }) => {
  const totalPredictions = predictions.length;
  const highRiskPredictions = predictions.filter(p => p.failure_risk > 70).length;
  const mediumRiskPredictions = predictions.filter(p => p.failure_risk >= 30 && p.failure_risk <= 70).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Prédictions</p>
              <p className="text-2xl font-bold text-blue-700">{totalPredictions}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Risque Élevé</p>
              <p className="text-2xl font-bold text-red-700">{highRiskPredictions}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Risque Moyen</p>
              <p className="text-2xl font-bold text-orange-700">{mediumRiskPredictions}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Techniciens Recommandés</p>
              <p className="text-2xl font-bold text-green-700">{recommendations.length}</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
