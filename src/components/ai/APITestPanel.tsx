
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAIPredictions, MaintenancePredictionInput } from '@/hooks/useAIPredictions';
import { toast } from 'sonner';

export function APITestPanel() {
  const { testConnection, getPrediction, isLoading, error } = useAIPredictions();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const handleTestConnection = async () => {
    const success = await testConnection();
    setConnectionStatus(success ? 'connected' : 'error');
  };

  const handleTestPrediction = async () => {
    // Données de test pour un équipement
    const testData: MaintenancePredictionInput = {
      equipment_id: 'FR-2024-001',
      equipment_type: 'Réfrigérateur',
      last_maintenance_date: '2024-05-15',
      failure_history: ['Problème de température', 'Compresseur bruyant'],
      sensor_data: {
        temperature: 8.5,
        pressure: 2.3,
        vibration: 0.8,
        humidity: 65
      },
      location: 'Douala - Akwa',
      usage_intensity: 'high'
    };

    const result = await getPrediction(testData);
    setPredictionResult(result);
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bot className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          Test API de Prédiction IA
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            {connectionStatus === 'idle' ? 'Non testé' : 
             connectionStatus === 'connected' ? 'Connecté' : 'Erreur'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Test de connexion */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">1. Test de Connexion</h3>
          <p className="text-sm text-gray-600">
            Vérifiez que l'API est accessible sur Railway
          </p>
          <Button 
            onClick={handleTestConnection}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Tester la connexion
          </Button>
        </div>

        {/* Test de prédiction */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">2. Test de Prédiction</h3>
          <p className="text-sm text-gray-600">
            Testez une prédiction avec des données d'exemple
          </p>
          <Button 
            onClick={handleTestPrediction}
            disabled={isLoading || connectionStatus !== 'connected'}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            Tester une prédiction
          </Button>
        </div>

        {/* Résultats */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Erreur:</strong> {error}
            </p>
          </div>
        )}

        {predictionResult && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Résultat de la Prédiction</h3>
            <Textarea
              value={JSON.stringify(predictionResult, null, 2)}
              readOnly
              rows={8}
              className="bg-gray-50 font-mono text-xs"
            />
          </div>
        )}

        {/* Informations sur l'API */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">Configuration API</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>URL:</strong> https://web-production-c2b6a.up.railway.app/</p>
            <p><strong>Endpoint:</strong> /predict/ (POST)</p>
            <p><strong>Status:</strong> Opérationnelle</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
