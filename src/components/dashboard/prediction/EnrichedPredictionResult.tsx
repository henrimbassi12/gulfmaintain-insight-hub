
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Wrench } from "lucide-react";
import { formatPredictionMessage, getModelPerformanceDetails } from '@/services/predictionMessageService';

interface EnrichedPredictionResultProps {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
  probabilities?: Record<string, number>;
}

export function EnrichedPredictionResult({ 
  predicted_status, 
  confidence_score, 
  risk_level, 
  recommendations,
  probabilities 
}: EnrichedPredictionResultProps) {
  // Utilisation du service d'enrichissement
  const enrichedMessage = formatPredictionMessage(predicted_status, confidence_score);
  const performanceDetails = getModelPerformanceDetails(predicted_status);

  // Helper function to safely render HTML content
  const sanitizeHtml = (html: string) => {
    // Simple HTML sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  };

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
          🧠 Analyse Prédictive IA - Résultat Enrichi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Message principal enrichi avec tous les détails */}
        <div className="bg-white p-6 rounded-lg border-2 border-purple-200 shadow-lg">
          {/* Titre avec émoji */}
          <div className="text-xl font-bold text-purple-900 mb-6 flex items-center gap-2">
            🧠 {enrichedMessage.title}
          </div>
          
          {/* Sections enrichies avec design amélioré */}
          <div className="space-y-4">
            {/* Description générale */}
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-purple-500">
              <div className="flex items-start gap-2">
                <span className="text-lg">📝</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-800 text-sm leading-relaxed">{enrichedMessage.description}</p>
                </div>
              </div>
            </div>
            
            {/* Niveau de confiance */}
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-l-blue-500">
              <div className="flex items-start gap-2">
                <span className="text-lg">📊</span>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Niveau de confiance</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">{enrichedMessage.confidence}</p>
                </div>
              </div>
            </div>
            
            {/* Interprétation */}
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-l-green-500">
              <div className="flex items-start gap-2">
                <span className="text-lg">🔍</span>
                  <div>
                    <h4 className="font-semibold text-green-900 mb-2">Interprétation</h4>
                    <div 
                      className="text-green-800 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(enrichedMessage.interpretation) }} 
                    />
                  </div>
              </div>
            </div>
            
            {/* Recommandation spécifique */}
            {enrichedMessage.recommendation && (
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-l-orange-500">
                <div className="flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">Recommandation spécifique</h4>
                    <p className="text-orange-800 text-sm leading-relaxed">{enrichedMessage.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performances du modèle IA */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-lg">📊</span>
            Performances du modèle IA
          </h4>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded border-l-4 border-l-gray-400">
            {performanceDetails}
          </div>
        </div>

        {/* Métriques sous forme de badges */}
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="bg-white border-green-200 text-green-700 px-3 py-2">
            🎯 Confiance: {confidence_score}%
          </Badge>
          <Badge variant={getRiskColor(risk_level)} className="flex items-center gap-1 px-3 py-2">
            ⚠️ Risque: {risk_level}
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-3 py-2">
            🤖 IA: 95.31% précision
          </Badge>
        </div>

        {/* Distribution des probabilités */}
        {probabilities && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              Distribution des probabilités
            </h4>
            <div className="space-y-3">
              {Object.entries(probabilities).map(([status, prob]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">
                    {status.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-800 font-semibold min-w-[45px]">
                      {Math.round(prob * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations techniques additionnelles */}
        {recommendations.length > 0 && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span>
              Recommandations techniques additionnelles
            </h4>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-700 p-2 bg-gray-50 rounded">
                  <span className="text-blue-500 mt-1 font-bold">•</span>
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
