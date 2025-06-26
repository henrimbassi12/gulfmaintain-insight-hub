
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle, AlertCircle, XCircle, Wrench } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { MobileHeader } from '@/components/MobileHeader';

export default function Supervision() {
  // Données simulées pour les prédictions post-entretien
  const postMaintenancePredictions = [
    {
      id: 1,
      equipmentId: 'INNOVA-1000-001',
      technician: 'VOUKENG',
      intervention: 'Maintenance préventive',
      predictionScore: 95,
      status: 'success',
      details: 'Probabilité de bon fonctionnement durant 90 jours',
      timestamp: '2024-01-15 14:30',
      location: 'Douala Centre'
    },
    {
      id: 2,
      equipmentId: 'SANDEN-500-023',
      technician: 'NDJOKO IV',
      intervention: 'Réparation compresseur',
      predictionScore: 78,
      status: 'partial',
      details: 'Surveillance recommandée - risque modéré',
      timestamp: '2024-01-14 10:15',
      location: 'Yaoundé'
    },
    {
      id: 3,
      equipmentId: 'INNOVA-650-045',
      technician: 'CÉDRIC',
      intervention: 'Remplacement thermostat',
      predictionScore: 92,
      status: 'success',
      details: 'Excellent pronostic - équipement stabilisé',
      timestamp: '2024-01-13 16:45',
      location: 'Bafoussam'
    },
    {
      id: 4,
      equipmentId: 'FV-400-078',
      technician: 'TCHINDA CONSTANT',
      intervention: 'Intervention complexe',
      predictionScore: 65,
      status: 'warning',
      details: 'Intervention spécialisée requise - suivi nécessaire',
      timestamp: '2024-01-12 09:20',
      location: 'Kribi'
    },
    {
      id: 5,
      equipmentId: 'SUPER-35-012',
      technician: 'MBAPBOU GRÉGOIRE',
      intervention: 'Maintenance corrective',
      predictionScore: 88,
      status: 'success',
      details: 'Réparation réussie - performance optimale',
      timestamp: '2024-01-11 13:10',
      location: 'Garoua'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'warning':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'partial':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'warning':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <MobileHeader />
      
      {/* Header desktop */}
      <div className="hidden md:block">
        <AirbnbHeader
          title="Supervision & IA"
          subtitle="Détail des modèles prédictifs"
          icon={Bot}
        />
      </div>

      <div className="px-4 py-4 md:px-6 md:py-8 space-y-6">
        {/* Header mobile */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supervision & IA</h1>
              <p className="text-sm text-gray-500">Détail des modèles prédictifs</p>
            </div>
          </div>
        </div>

        {/* Prédiction IA - Statut Post-Entretien */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Prédiction IA - Statut Post-Entretien</h2>
                <p className="text-sm text-gray-600 font-normal">Modèle spécialisé évaluant l'impact des interventions de maintenance basé sur des analyses avant/après.</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Segmentation automatique des résultats */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Segmentation automatique des résultats :</h3>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 via-orange-500 to-red-500 h-3 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Succès total</p>
                      <p className="text-sm text-green-700">70%</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600">2.4-2.6A post-maintenance</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-semibold text-orange-900">Succès partiel</p>
                      <p className="text-sm text-orange-700">20%</p>
                    </div>
                  </div>
                  <p className="text-xs text-orange-600">Nécessite surveillance</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Résistance</p>
                      <p className="text-sm text-red-700">10%</p>
                    </div>
                  </div>
                  <p className="text-xs text-red-600">Intervention spécialisée requise</p>
                </div>
              </div>
            </div>

            {/* Liste des prédictions récentes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prédictions récentes :</h3>
              <div className="space-y-4">
                {postMaintenancePredictions.map((prediction) => (
                  <div key={prediction.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(prediction.status)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{prediction.equipmentId}</h4>
                          <p className="text-sm text-gray-600">{prediction.technician} • {prediction.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(prediction.predictionScore)}`}>
                          {prediction.predictionScore}%
                        </p>
                        <Badge className={`text-xs ${getStatusColor(prediction.status)}`}>
                          Score IA
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Intervention : {prediction.intervention}</p>
                      <p className="text-sm text-gray-600">{prediction.details}</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{prediction.timestamp}</span>
                      <Badge variant="outline" className="text-xs">
                        Post-maintenance
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
