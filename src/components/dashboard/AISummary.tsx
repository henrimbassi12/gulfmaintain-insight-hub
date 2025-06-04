
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

const AISummary: React.FC = () => {
  const insights = [
    {
      type: 'prediction',
      icon: TrendingUp,
      title: 'Prédiction de panne',
      description: 'Équipement FR-2024-089 risque de panne dans 5 jours',
      confidence: 87,
      priority: 'high',
      action: 'Planifier maintenance préventive'
    },
    {
      type: 'optimization',
      icon: Clock,
      title: 'Optimisation des tournées',
      description: 'Réorganisation des routes peut économiser 2h30/jour',
      confidence: 94,
      priority: 'medium',
      action: 'Appliquer nouveau planning'
    },
    {
      type: 'alert',
      icon: AlertCircle,
      title: 'Récurrence détectée',
      description: 'Même panne sur 3 équipements Samsung cette semaine',
      confidence: 96,
      priority: 'high',
      action: 'Investigation approfondie requise'
    },
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Performance améliorée',
      description: 'Taux de résolution en première intervention: +15%',
      confidence: 100,
      priority: 'low',
      action: 'Maintenir les bonnes pratiques'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'prediction':
        return 'text-blue-500';
      case 'optimization':
        return 'text-purple-500';
      case 'alert':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Résumé IA
          <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-700 border-purple-200">
            Mise à jour en temps réel
          </Badge>
        </CardTitle>
        <CardDescription>Insights et recommandations basés sur l'intelligence artificielle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon;
            return (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${getIconColor(insight.type)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <Badge className={getPriorityColor(insight.priority)} variant="outline">
                        {insight.priority === 'high' ? 'Priorité élevée' : 
                         insight.priority === 'medium' ? 'Priorité moyenne' : 'Info'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Confiance: {insight.confidence}%
                      </span>
                      <span className="text-xs font-medium text-blue-600">
                        {insight.action}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Résumé global */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Résumé de la journée</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">12</div>
              <div className="text-blue-700">Recommandations</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">8</div>
              <div className="text-blue-700">Actions appliquées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">4</div>
              <div className="text-blue-700">En attente</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISummary;
