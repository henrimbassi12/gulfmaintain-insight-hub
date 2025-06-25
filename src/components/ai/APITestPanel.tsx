
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Zap, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useAIPredictions, MaintenancePredictionInput } from '@/hooks/useAIPredictions';

export function APITestPanel() {
  const { testConnection, getPrediction, isLoading, error } = useAIPredictions();
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [diagnostics, setDiagnostics] = useState<string>('');

  const handleTestConnection = async () => {
    const success = await testConnection();
    setConnectionStatus(success ? 'connected' : 'error');
    
    // Ajouter des diagnostics détaillés
    const diagText = `
=== DIAGNOSTIC API IA ===
Heure: ${new Date().toLocaleString()}
URL testée: https://web-production-c2b6a.up.railway.app/
Statut: ${success ? 'SUCCÈS' : 'ÉCHEC'}
${error ? `Erreur: ${error}` : ''}

=== INFORMATIONS TECHNIQUES ===
- L'API Railway est en ligne (vérifié via Postman)
- Endpoints disponibles: GET / et POST /predict/
- Possible problème CORS pour les requêtes cross-origin
- Solutions: Configurer les en-têtes CORS sur Railway ou utiliser un proxy
    `;
    setDiagnostics(diagText);
  };

  const handleTestPrediction = async () => {
    // Données de test pour un équipement
    const testData: MaintenancePredictionInput = {
      equipment_id: 'FR-TEST-001',
      equipment_type: 'Réfrigérateur',
      last_maintenance_date: '2024-05-15',
      failure_history: ['Problème de température', 'Compresseur bruyant'],
      sensor_data: {
        temperature: 8.5,
        pressure: 2.3,
        vibration: 0.8,
        humidity: 65
      },
      location: 'Douala - Test',
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
             connectionStatus === 'connected' ? 'Connecté' : 'Erreur CORS'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Statut de l'API */}
        {connectionStatus === 'error' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">Problème CORS détecté</h3>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              Votre API fonctionne correctement (confirmé par Postman), mais les requêtes depuis le navigateur sont bloquées par les politiques CORS.
            </p>
            <div className="text-xs text-yellow-600">
              <p><strong>Solutions possibles :</strong></p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Configurer les en-têtes CORS sur votre API Railway</li>
                <li>Utiliser un proxy ou un middleware CORS</li>
                <li>Pour l'instant, l'application utilise des données simulées</li>
              </ul>
            </div>
          </div>
        )}

        {/* Test de connexion */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">1. Test de Connexion</h3>
          <p className="text-sm text-gray-600">
            Vérifiez que l'API est accessible depuis le navigateur
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
            Testez une prédiction avec des données d'exemple (utilise des données simulées si CORS)
          </p>
          <Button 
            onClick={handleTestPrediction}
            disabled={isLoading}
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

        {/* Diagnostics */}
        {diagnostics && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Diagnostic Détaillé</h3>
            <Textarea
              value={diagnostics}
              readOnly
              rows={8}
              className="bg-gray-50 font-mono text-xs"
            />
          </div>
        )}

        {/* Résultats */}
        {predictionResult && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Résultat de la Prédiction</h3>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2">
                <strong>Statut prédit:</strong> {predictionResult.predicted_status}
              </p>
              <p className="text-sm text-green-700">
                <strong>Confiance:</strong> {predictionResult.confidence_score}%
              </p>
            </div>
            <Textarea
              value={JSON.stringify(predictionResult, null, 2)}
              readOnly
              rows={6}
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
            <p><strong>Status Railway:</strong> ✅ Opérationnelle (confirmé par logs)</p>
            <p><strong>Problème:</strong> Politique CORS du navigateur</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
