
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAIPredictions, MaintenancePrediction } from '@/hooks/useAIPredictions';
import { toast } from 'sonner';

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  lastMaintenance: string;
  status: string;
}

export function AutomaticPredictions() {
  const [predictions, setPredictions] = useState<MaintenancePrediction[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { getBatchPredictions, isLoading } = useAIPredictions();

  // Équipements d'exemple pour les prédictions automatiques
  const sampleEquipments: Equipment[] = [
    {
      id: 'FR-2024-001',
      name: 'Réfrigérateur Vestfrost VKG571',
      type: 'Réfrigérateur',
      location: 'Douala - Akwa',
      lastMaintenance: '2024-05-15',
      status: 'Actif'
    },
    {
      id: 'FR-2024-002',
      name: 'Réfrigérateur Haier HRF-521',
      type: 'Réfrigérateur',
      location: 'Yaoundé - Centre',
      lastMaintenance: '2024-04-20',
      status: 'Actif'
    },
    {
      id: 'FR-2024-003',
      name: 'Réfrigérateur Samsung RT38',
      type: 'Réfrigérateur',
      location: 'Bafoussam - Commercial',
      lastMaintenance: '2024-06-01',
      status: 'Actif'
    }
  ];

  const generateAutomaticPredictions = async () => {
    setIsGenerating(true);
    
    const predictionInputs = sampleEquipments.map(equipment => ({
      equipment_id: equipment.id,
      equipment_type: equipment.type,
      last_maintenance_date: equipment.lastMaintenance,
      failure_history: ['Maintenance préventive', 'Nettoyage compresseur'],
      location: equipment.location,
      usage_intensity: 'high' as const,
      sensor_data: {
        temperature: Math.random() * 5 + 5, // 5-10°C
        pressure: Math.random() * 0.5 + 2, // 2-2.5 bar
        vibration: Math.random() * 0.3 + 0.4, // 0.4-0.7 Hz
        humidity: Math.random() * 20 + 60 // 60-80%
      }
    }));

    const results = await getBatchPredictions(predictionInputs);
    setPredictions(results);
    setIsGenerating(false);

    if (results.length > 0) {
      toast.success(`${results.length} prédictions générées automatiquement`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entretien_renforce': return 'destructive';
      case 'Investigation_defaillance': return 'secondary';
      case 'Maintenance_preventive': return 'default';
      case 'Surveillance_renforcee': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entretien_renforce': return <AlertTriangle className="w-4 h-4" />;
      case 'Investigation_defaillance': return <Zap className="w-4 h-4" />;
      case 'Maintenance_preventive': return <CheckCircle className="w-4 h-4" />;
      case 'Surveillance_renforcee': return <RefreshCw className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            🤖 Prédictions Automatiques
          </div>
          <Button
            onClick={generateAutomaticPredictions}
            disabled={isGenerating || isLoading}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Générer prédictions
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {predictions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Aucune prédiction générée</p>
            <p className="text-sm">Cliquez sur "Générer prédictions" pour analyser vos équipements</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {predictions.length} prédictions générées
              </h3>
              <Badge variant="outline" className="text-xs">
                Analyse basée sur l'IA
              </Badge>
            </div>

            {predictions.map((prediction, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(prediction.predicted_status)}
                    <h4 className="font-medium text-gray-900">
                      {prediction.equipment_id}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(prediction.predicted_status)}>
                      {prediction.predicted_status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(prediction.priority_level)}>
                      {prediction.priority_level}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confiance:</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${prediction.confidence_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{prediction.confidence_score}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Durée estimée:</p>
                    <p className="text-sm font-medium">{prediction.estimated_duration_hours}h</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Actions recommandées:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.recommended_actions.slice(0, 3).map((action, actionIndex) => (
                      <Badge key={actionIndex} variant="outline" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                    {prediction.recommended_actions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{prediction.recommended_actions.length - 3} autres
                      </Badge>
                    )}
                  </div>
                </div>

                {prediction.risk_factors.length > 0 && (
                  <div className="p-2 bg-orange-50 rounded border border-orange-200">
                    <p className="text-xs font-medium text-orange-800 mb-1">
                      ⚠️ Facteurs de risque:
                    </p>
                    <p className="text-xs text-orange-700">
                      {prediction.risk_factors.slice(0, 2).join(', ')}
                      {prediction.risk_factors.length > 2 && '...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
