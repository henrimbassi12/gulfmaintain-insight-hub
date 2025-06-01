
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

interface AIMetrics {
  predictionAccuracy: number;
  confidenceScore: number;
  totalPredictions: number;
  correctPredictions: number;
  modelVersion: string;
  lastUpdated: string;
}

interface AIReliabilityScoreProps {
  metrics: AIMetrics;
}

const AIReliabilityScore: React.FC<AIReliabilityScoreProps> = ({ metrics }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (score >= 70) return <AlertCircle className="w-5 h-5 text-orange-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-500" />
          🎯 Score de fiabilité IA
        </CardTitle>
        <CardDescription>
          Performance du modèle de prédiction - Visible gestionnaires uniquement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score principal */}
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getScoreIcon(metrics.predictionAccuracy)}
              <h3 className={`text-3xl font-bold ${getScoreColor(metrics.predictionAccuracy)}`}>
                {metrics.predictionAccuracy}%
              </h3>
            </div>
            <p className="text-sm text-indigo-700 font-medium">Précision des prédictions</p>
            <Progress value={metrics.predictionAccuracy} className="mt-2" />
          </div>

          {/* Score de confiance */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h3 className="text-2xl font-bold text-blue-600">{metrics.confidenceScore}%</h3>
            <p className="text-sm text-blue-700 font-medium">Score de confiance</p>
            <Progress value={metrics.confidenceScore} className="mt-2" />
          </div>
        </div>

        {/* Métriques détaillées */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Prédictions correctes</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {metrics.correctPredictions} / {metrics.totalPredictions}
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">Version du modèle</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{metrics.modelVersion}</p>
          </div>
        </div>

        {/* Interprétation */}
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">Interprétation</h4>
          <div className="text-sm text-indigo-700 space-y-1">
            {metrics.predictionAccuracy >= 85 && (
              <p>✅ Modèle très fiable - Recommandations sûres</p>
            )}
            {metrics.predictionAccuracy >= 70 && metrics.predictionAccuracy < 85 && (
              <p>⚠️ Modèle acceptable - Validation recommandée</p>
            )}
            {metrics.predictionAccuracy < 70 && (
              <p>🔄 Modèle à améliorer - Recalibrage nécessaire</p>
            )}
            <p className="text-xs mt-2">Dernière mise à jour: {metrics.lastUpdated}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIReliabilityScore;
