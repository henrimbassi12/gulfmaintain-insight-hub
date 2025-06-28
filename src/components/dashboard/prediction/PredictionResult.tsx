
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { PredictionResult as PredictionResultType } from './types';

interface PredictionResultProps {
  result: PredictionResultType;
}

export function PredictionResult({ result }: PredictionResultProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
      <div className="flex items-center gap-3 mb-3">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-gray-900">Résultat de la Prédiction</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Statut Prédit</p>
          <p className="text-lg font-bold text-blue-600">{result.predicted_status}</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Confiance</p>
          <p className="text-lg font-bold text-purple-600">{result.confidence_score}%</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Risque</p>
          <p className={`text-lg font-bold ${
            result.risk_level === 'Élevé' ? 'text-red-600' :
            result.risk_level === 'Moyen' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {result.risk_level}
          </p>
        </div>
      </div>

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
