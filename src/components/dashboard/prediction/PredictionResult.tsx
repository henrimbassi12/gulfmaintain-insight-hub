
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { PredictionResult as PredictionResultType } from './types';

interface PredictionResultProps {
  result: PredictionResultType;
}

export function PredictionResult({ result }: PredictionResultProps) {
  // Fonction pour formater les noms de statut
  const formatStatusName = (status: string) => {
    return status
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Trier les probabilités par score décroissant
  const sortedProbabilities = result.probabilities ? 
    Object.entries(result.probabilities)
      .sort(([,a], [,b]) => b - a)
      .map(([status, probability]) => ({
        status: formatStatusName(status),
        probability: Math.round(probability * 100)
      })) : [];

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-gray-900">Résultat de la Prédiction IA</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Statut Prédit</p>
          <p className="text-lg font-bold text-blue-600">{formatStatusName(result.predicted_status)}</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Score de Confiance</p>
          <p className="text-lg font-bold text-purple-600">{result.confidence_score}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Niveau de Risque</p>
          <p className={`text-lg font-bold ${
            result.risk_level === 'Élevé' ? 'text-red-600' :
            result.risk_level === 'Moyen' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {result.risk_level}
          </p>
        </div>
      </div>

      {/* Section des scores de probabilité */}
      {sortedProbabilities.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h5 className="text-sm font-semibold text-gray-900">Scores de Probabilité</h5>
          </div>
          <div className="space-y-2">
            {sortedProbabilities.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  <span className={`text-sm font-bold ${
                    index === 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {item.probability}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === 0 ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${item.probability}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h5 className="text-sm font-semibold text-gray-900 mb-2">Recommandations</h5>
        <div className="space-y-1">
          {result.recommendations.map((rec, index) => (
            <p key={index} className="text-xs text-gray-700 bg-white rounded px-2 py-1">• {rec}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
