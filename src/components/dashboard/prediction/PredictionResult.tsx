
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Wrench } from "lucide-react";
import { formatPredictionMessage, getModelPerformanceDetails } from '@/services/predictionMessageService';

interface PredictionResultProps {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
  probabilities?: Record<string, number>;
}

export function PredictionResult({ 
  predicted_status, 
  confidence_score, 
  risk_level, 
  recommendations,
  probabilities 
}: PredictionResultProps) {
  const enrichedMessage = formatPredictionMessage(predicted_status, confidence_score);
  const performanceDetails = getModelPerformanceDetails(predicted_status);

  const getStatusIcon = () => {
    switch (predicted_status) {
      case 'Entretien_renforce': return <Wrench className="w-5 h-5 text-orange-600" />;
      case 'Investigation_defaillance': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'Maintenance_preventive': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Surveillance_renforcee': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      default: return <Brain className="w-5 h-5 text-purple-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Élevé': return 'destructive';
      case 'Moyen': return 'secondary';
      case 'Faible': return 'outline';
      default: return 'default';
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Résultat de la Prédiction IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Message enrichi principal - Format exact demandé */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          {/* Titre avec émoji */}
          <div className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            🧠 {enrichedMessage.title}
          </div>
          
          {/* Description enrichie */}
          <div className="space-y-4 text-sm leading-relaxed">
            <div className="text-gray-700">
              {enrichedMessage.description}
            </div>
            
            {/* Confiance avec émoji */}
            <div className="text-blue-700 font-medium bg-blue-50 p-3 rounded-lg">
              📊 {enrichedMessage.confidence}
            </div>
            
            {/* Interprétation avec émoji */}
            <div className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg">
              🔍 {enrichedMessage.interpretation}
            </div>
            
            {/* Recommandation spécifique avec émoji */}
            {enrichedMessage.recommendation && (
              <div className="text-orange-800 bg-orange-50 p-3 rounded-lg border border-orange-200">
                {enrichedMessage.recommendation}
              </div>
            )}
          </div>
        </div>

        {/* Détails des performances du modèle avec émoji */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            📊 Performances du modèle IA
          </h4>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {performanceDetails}
          </div>
        </div>

        {/* Badges de métriques avec émojis */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-white border-green-200 text-green-700">
            🎯 Confiance: {confidence_score}%
          </Badge>
          <Badge variant={getRiskColor(risk_level)} className="flex items-center gap-1">
            ⚠️ Risque: {risk_level}
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            🧠 IA: 95.31% précision
          </Badge>
        </div>

        {/* Distribution des probabilités avec émoji */}
        {probabilities && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              🎯 Distribution des probabilités
            </h4>
            <div className="space-y-2">
              {Object.entries(probabilities).map(([status, prob]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {status.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-800 font-medium min-w-[40px]">
                      {Math.round(prob * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations techniques avec émoji */}
        {recommendations.length > 0 && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              💡 Recommandations techniques
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
