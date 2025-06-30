
import React, { useState, useEffect } from 'react';
import { Brain, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIPredictions } from '@/hooks/useAIPredictions';
import { useNavigate } from 'react-router-dom';

export function AIPredictionBlock() {
  const [lastPrediction, setLastPrediction] = useState<any>(null);
  const { testConnection, isLoading } = useAIPredictions();
  const navigate = useNavigate();

  const predictions = [
    { icon: '📌', label: 'Panne probable', value: lastPrediction ? 'Analysé par IA' : 'En attente', color: 'text-red-600 dark:text-red-400' },
    { icon: '🧊', label: 'Équipements à risque', value: 'TAG123, TAG087, TAG201', color: 'text-orange-600 dark:text-orange-400' },
    { icon: '🧰', label: 'Technicien recommandé', value: 'D. Ngangue', color: 'text-blue-600 dark:text-blue-400' },
    { icon: '📉', label: 'Estimation panne', value: lastPrediction ? `${lastPrediction.confidence_score}%` : '75%', color: 'text-red-600 dark:text-red-400' },
  ];

  const handleTestAPI = async () => {
    const success = await testConnection();
    if (success) {
      navigate('/supervision');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Supervision IA</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Analyse prédictive en temps réel</p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleTestAPI}
          disabled={isLoading}
          className="flex items-center gap-2 border-gray-200 dark:border-gray-600"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          Test IA
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{item.label}</p>
              <p className={`font-medium text-sm ${item.color}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-medium">Recommandation :</span> Programmer une maintenance préventive pour les équipements à risque dans les 48h.
        </p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          onClick={() => navigate('/supervision')}
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Voir détails IA
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate('/maintenance')}
          className="flex items-center gap-2 border-gray-200 dark:border-gray-600"
        >
          <RefreshCw className="w-4 h-4" />
          Maintenances
        </Button>
      </div>
    </div>
  );
}
