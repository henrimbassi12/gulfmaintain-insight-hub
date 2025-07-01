
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
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {enrichedMessage.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description du modèle */}
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-700 mb-2">{enrichedMessage.description}</p>
          <p className="text-sm text-blue-700 font-medium">{enrichedMessage.confidence}</p>
        </div>

        {/* Interprétation */}
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-800 font-medium">{enrichedMessage.interpretation}</p>
        </div>

        {/* Recommandation */}
        {enrichedMessage.recommendation && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">{enrichedMessage.recommendation}</p>
          </div>
        )}

        {/* Métriques et badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-white">
            Confiance: {confidence_score}%
          </Badge>
          <Badge variant={getRiskColor(risk_level)}>
            Risque: {risk_level}
          </Badge>
          <Badge variant="secondary">
            IA: 95.31% précision
          </Badge>
        </div>

        {/* Détails des performances du modèle */}
        <div className="bg-gray-50 p-3 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-900 mb-2">📊 Performances du modèle IA</h4>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap">{performanceDetails}</pre>
        </div>

        {/* Probabilités détaillées */}
        {probabilities && (
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-900 mb-2">🎯 Distribution des probabilités</h4>
            <div className="space-y-1">
              {Object.entries(probabilities).map(([status, prob]) => (
                <div key={status} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">{status.replace(/_/g, ' ')}</span>
                  <span className="text-gray-800 font-medium">{Math.round(prob * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations techniques */}
        {recommendations.length > 0 && (
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Recommandations techniques</h4>
            <div className="space-y-1">
              {recommendations.map((rec, index) => (
                <p key={index} className="text-xs text-gray-700">• {rec}</p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
