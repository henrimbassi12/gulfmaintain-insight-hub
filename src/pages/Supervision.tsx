
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  Zap,
  Settings,
  Eye,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MobileHeader } from '@/components/MobileHeader';
import { supervisionSamples } from '@/data/supervision-samples';
import { TechnicianProfileSheet } from '@/components/supervision/TechnicianProfileSheet';
import { PredictionDetails } from '@/components/supervision/PredictionDetails';
// import { PredictionForm } from '@/components/supervision/PredictionForm';

export default function Supervision() {
  const { userProfile } = useAuth();
  const [selectedTechnician, setSelectedTechnician] = useState<any>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  const isAdmin = userProfile?.role === 'admin';
  const isManager = userProfile?.role === 'manager';

  if (!isAdmin && !isManager) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès Restreint</h2>
            <p className="text-gray-600">
              Cette section est réservée aux administrateurs et responsables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Supervision & IA</h1>
                <p className="text-gray-500 text-sm">Vue d'ensemble des performances en temps-réel</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                IA Active
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 flex items-center gap-1">
                <Activity className="w-4 h-4" />
                Temps Réel
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPIs en temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Taux de Réussite</p>
                  <p className="text-3xl font-bold text-green-900">94.2%</p>
                  <p className="text-xs text-green-600 mt-1">↗ +2.1% ce mois</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Urgences en Cours</p>
                  <p className="text-3xl font-bold text-red-900">7</p>
                  <p className="text-xs text-red-600 mt-1">↗ +3 aujourd'hui</p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Technicien du Mois</p>
                  <p className="text-2xl font-bold text-blue-900">J. Ekwalla</p>
                  <p className="text-xs text-blue-600 mt-1">98% de réussite</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Durée Moyenne</p>
                  <p className="text-3xl font-bold text-purple-900">42 min</p>
                  <p className="text-xs text-purple-600 mt-1">↘ -5 min cette semaine</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des techniciens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Performance des Techniciens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Technicien</th>
                    <th className="text-left p-4">Interventions</th>
                    <th className="text-left p-4">Taux de Réussite</th>
                    <th className="text-left p-4">Durée Moyenne</th>
                    <th className="text-left p-4">Statut</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supervisionSamples.technicians.map((tech) => (
                    <tr key={tech.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {tech.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <p className="text-sm text-gray-500">{tech.zone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{tech.interventions}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            tech.successRate >= 95 ? 'text-green-600' : 
                            tech.successRate >= 90 ? 'text-blue-600' : 'text-yellow-600'
                          }`}>
                            {tech.successRate}%
                          </span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                tech.successRate >= 95 ? 'bg-green-500' : 
                                tech.successRate >= 90 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${tech.successRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{tech.avgDuration}</td>
                      <td className="p-4">
                        <Badge variant={tech.status === 'En mission' ? 'default' : 'secondary'}>
                          {tech.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTechnician(tech)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Prédictions IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Prédictions IA - Maintenance Préventive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supervisionSamples.predictions.map((prediction) => (
                <div key={prediction.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                     onClick={() => setSelectedPrediction(prediction)}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={
                      prediction.risk === 'Faible' ? 'secondary' : 
                      prediction.risk === 'Moyen' ? 'default' : 'destructive'
                    }>
                      {prediction.risk}
                    </Badge>
                    <span className="text-sm text-gray-500">{prediction.confidence}%</span>
                  </div>
                  <p className="font-medium">{prediction.equipment}</p>
                  <p className="text-sm text-gray-600">{prediction.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{prediction.nextMaintenance}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de prédiction IA - Commenté */}
        {/* 
        <div className="mt-8">
          <PredictionForm />
        </div>
        */}
      </div>

      {/* Modals */}
      {selectedTechnician && (
        <TechnicianProfileSheet
          technician={selectedTechnician}
          isOpen={!!selectedTechnician}
          onClose={() => setSelectedTechnician(null)}
        />
      )}

      {selectedPrediction && (
        <PredictionDetails
          prediction={selectedPrediction}
          isOpen={!!selectedPrediction}
          onClose={() => setSelectedPrediction(null)}
        />
      )}
    </div>
  );
}
