
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Lightbulb, CheckCircle } from "lucide-react";

const AISummary: React.FC = () => {
  const aiMetrics = {
    accuracy: 87.3,
    predictions: 156,
    correctPredictions: 136,
    lastUpdate: "2024-01-15",
    confidence: 91.2
  };

  const recentPredictions = [
    { equipment: "FR-2024-045", risk: 87, action: "Vérifier compresseur", status: "pending" },
    { equipment: "FR-2024-089", risk: 92, action: "Remplacement préventif", status: "completed" },
    { equipment: "FR-2024-112", risk: 78, action: "Contrôle température", status: "in-progress" }
  ];

  const recommendations = [
    "Planifier maintenance préventive pour 3 équipements Samsung",
    "Affecter Ahmed Benali aux interventions critiques (taux de réussite 96%)",
    "Surveiller les équipements de Casablanca Nord (pic d'activité détecté)"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-500" />
          Résumé de l'intelligence artificielle
        </CardTitle>
        <CardDescription>Performance du modèle et recommandations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Métriques IA */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-indigo-500" />
                <span className="text-sm text-indigo-600">Précision</span>
              </div>
              <div className="text-2xl font-bold text-indigo-700">{aiMetrics.accuracy}%</div>
              <div className="text-xs text-indigo-600">{aiMetrics.correctPredictions}/{aiMetrics.predictions} prédictions</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Brain className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600">Confiance</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{aiMetrics.confidence}%</div>
              <div className="text-xs text-blue-600">Score global</div>
            </div>
          </div>

          {/* Prédictions récentes */}
          <div>
            <h3 className="font-medium mb-3">Dernières prédictions</h3>
            <div className="space-y-2">
              {recentPredictions.map((pred, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium text-sm">{pred.equipment}</span>
                    <span className="text-xs text-gray-600 ml-2">{pred.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={pred.risk >= 85 ? "destructive" : "secondary"}>
                      {pred.risk}%
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${
                      pred.status === 'completed' ? 'bg-green-500' :
                      pred.status === 'in-progress' ? 'bg-orange-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommandations */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Recommandations
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISummary;
