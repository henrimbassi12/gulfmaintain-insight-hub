import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Target, CheckCircle, AlertTriangle, Activity, Calendar, BarChart3 } from 'lucide-react';
import { usePredictionHistory } from '@/hooks/usePredictionHistory';
import { useReports } from '@/hooks/useReports';

interface PredictionEfficiency {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  averageConfidence: number;
  predictionsByStatus: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    predictions: number;
    accuracy: number;
  }>;
  timeToIntervention: {
    average: number;
    predicted: number;
    variance: number;
  };
}

export function PredictionEfficiencyTracker() {
  const { predictions, isLoading: isPredictionsLoading } = usePredictionHistory();
  const { reports, isLoading: isReportsLoading } = useReports();
  const [efficiency, setEfficiency] = useState<PredictionEfficiency | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('3months');

  useEffect(() => {
    if (predictions.length > 0 && reports.length > 0) {
      calculateEfficiency();
    }
  }, [predictions, reports, selectedPeriod]);

  const calculateEfficiency = () => {
    const now = new Date();
    let periodMonths = 3;
    
    switch (selectedPeriod) {
      case '1month':
        periodMonths = 1;
        break;
      case '6months':
        periodMonths = 6;
        break;
      case '12months':
        periodMonths = 12;
        break;
      default:
        periodMonths = 3;
    }

    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - periodMonths, 1);
    
    // Filtrer les prédictions selon la période
    const filteredPredictions = predictions.filter(pred => 
      new Date(pred.created_at) >= cutoffDate
    );

    // Analyser la correspondance entre prédictions et rapports réels
    let correctPredictions = 0;
    let totalConfidence = 0;
    const predictionsByStatus: Record<string, number> = {};
    const monthlyData: Record<string, { predictions: number; correct: number }> = {};

    filteredPredictions.forEach(prediction => {
      const predDate = new Date(prediction.created_at);
      const monthKey = `${predDate.getFullYear()}-${String(predDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { predictions: 0, correct: 0 };
      }
      monthlyData[monthKey].predictions++;

      // Compter par statut prédit
      const status = prediction.predicted_status || 'unknown';
      predictionsByStatus[status] = (predictionsByStatus[status] || 0) + 1;
      
      totalConfidence += parseFloat(prediction.confidence_score?.toString() || '0') || 0;

      // Vérifier si la prédiction correspond à un rapport réel
      const matchingReport = reports.find(report => 
        report.equipment.includes(prediction.equipment_id) &&
        Math.abs(new Date(report.date).getTime() - new Date(prediction.estimated_intervention_date).getTime()) <= 7 * 24 * 60 * 60 * 1000 // 7 jours de tolérance
      );

      if (matchingReport) {
        correctPredictions++;
        monthlyData[monthKey].correct++;
      }
    });

    // Calculer les tendances mensuelles
    const monthlyTrends = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Derniers 6 mois max
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
        predictions: data.predictions,
        accuracy: data.predictions > 0 ? Math.round((data.correct / data.predictions) * 100) : 0
      }));

    // Calculer la variance temporelle
    const avgPredictedDuration = filteredPredictions.reduce((sum, pred) => 
      sum + (parseInt(pred.estimated_duration_hours?.toString() || '0') || 0), 0) / filteredPredictions.length;
    
    const avgActualDuration = reports.reduce((sum, report) => 
      sum + parseFloat(report.duration.replace(/[^\d.]/g, '') || '0'), 0) / reports.length;

    const efficiencyData: PredictionEfficiency = {
      totalPredictions: filteredPredictions.length,
      correctPredictions,
      accuracy: filteredPredictions.length > 0 ? Math.round((correctPredictions / filteredPredictions.length) * 100) : 0,
      averageConfidence: filteredPredictions.length > 0 ? Math.round(totalConfidence / filteredPredictions.length) : 0,
      predictionsByStatus,
      monthlyTrends,
      timeToIntervention: {
        average: avgActualDuration,
        predicted: avgPredictedDuration,
        variance: Math.abs(avgActualDuration - avgPredictedDuration)
      }
    };

    setEfficiency(efficiencyData);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (accuracy >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAccuracyIcon = (accuracy: number) => {
    if (accuracy >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (accuracy >= 60) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <Activity className="w-4 h-4 text-red-600" />;
  };

  if (isPredictionsLoading || isReportsLoading) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-purple-300 animate-pulse" />
            <h3 className="text-lg font-medium mb-2">Analyse des performances IA...</h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!efficiency) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Données insuffisantes</h3>
            <p>Pas assez de prédictions et de rapports pour l'analyse</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteur de période */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              Efficacité des Prédictions IA
            </CardTitle>
            <div className="flex gap-2">
              {[
                { value: '1month', label: '1 mois' },
                { value: '3months', label: '3 mois' },
                { value: '6months', label: '6 mois' },
                { value: '12months', label: '1 an' }
              ].map(period => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                  className="text-xs"
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Précision globale */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getAccuracyIcon(efficiency.accuracy)}
                <span className="text-sm font-medium text-gray-600">Précision</span>
              </div>
              <Badge className={`text-xs ${getAccuracyColor(efficiency.accuracy)}`}>
                {efficiency.accuracy}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {efficiency.correctPredictions}/{efficiency.totalPredictions}
            </div>
            <p className="text-xs text-gray-500">prédictions correctes</p>
          </CardContent>
        </Card>

        {/* Confiance moyenne */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Confiance</span>
              </div>
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {efficiency.averageConfidence}%
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {efficiency.averageConfidence}%
            </div>
            <p className="text-xs text-gray-500">confiance moyenne</p>
          </CardContent>
        </Card>

        {/* Prédictions totales */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Volume</span>
              </div>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Total
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {efficiency.totalPredictions}
            </div>
            <p className="text-xs text-gray-500">prédictions analysées</p>
          </CardContent>
        </Card>

        {/* Variance temporelle */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Variance</span>
              </div>
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                ±{efficiency.timeToIntervention.variance.toFixed(1)}h
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {efficiency.timeToIntervention.predicted.toFixed(1)}h
            </div>
            <p className="text-xs text-gray-500">durée prédite vs réelle</p>
          </CardContent>
        </Card>
      </div>

      {/* Analyse des statuts prédits */}
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Répartition des Prédictions par Type
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(efficiency.predictionsByStatus).map(([status, count]) => (
              <div key={status} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {status.replace(/_/g, ' ')}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {count}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(count / efficiency.totalPredictions) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((count / efficiency.totalPredictions) * 100)}% des prédictions
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendances mensuelles */}
      {efficiency.monthlyTrends.length > 0 && (
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Évolution de la Précision dans le Temps
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {efficiency.monthlyTrends.map((trend, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{trend.month}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {trend.predictions} prédictions
                        </Badge>
                        <Badge className={`text-xs ${getAccuracyColor(trend.accuracy)}`}>
                          {trend.accuracy}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          trend.accuracy >= 80 ? 'bg-green-500' : 
                          trend.accuracy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${trend.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}