
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, RefreshCw, Activity, TrendingUp, Brain } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { AIPredictionPanel } from '@/components/supervision/AIPredictionPanel';
import SupervisionFilters from '@/components/supervision/SupervisionFilters';
import { PredictionsList } from '@/components/supervision/PredictionsList';
import RecurrenceAnalysis from '@/components/supervision/RecurrenceAnalysis';
import { TechnicianRecommendations } from '@/components/supervision/TechnicianRecommendations';
import AIReliabilityScore from '@/components/supervision/AIReliabilityScore';
import { toast } from 'sonner';

export default function Supervision() {
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    region: 'all',
    riskLevel: 'all',
    equipmentType: 'all',
    timeframe: '30'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des données IA...',
        success: 'Données IA actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleGenerateReport = () => {
    toast.success("Génération du rapport IA en cours...");
  };

  // Mock data for components
  const mockPredictions = [
    {
      id: 1,
      equipment_name: "Climatiseur Bureau A1",
      failure_risk: 85,
      type: "AF",
      location: "Tunis - Siège",
      predicted_date: "2024-06-20",
      recommended_action: "Remplacer le filtre et vérifier le système de refroidissement"
    },
    {
      id: 2,
      equipment_name: "Générateur Secours B2",
      failure_risk: 92,
      type: "NF",
      location: "Sfax - Agence",
      predicted_date: "2024-06-18",
      recommended_action: "Maintenance préventive urgente - vérifier les connexions électriques"
    }
  ];

  const mockTechnicians = [
    {
      id: 1,
      technician: "Ahmed Ben Ali",
      equipment_name: "Climatiseur Bureau A1",
      location: "Tunis - Siège",
      match_score: 95,
      availability: "Disponible aujourd'hui",
      experience: "5 ans en climatisation",
      success_rate: 98,
      expertise: ["Climatisation", "Électrique", "Diagnostic"]
    },
    {
      id: 2,
      technician: "Fatma Gharbi",
      equipment_name: "Générateur Secours B2",
      location: "Sfax - Agence",
      match_score: 88,
      availability: "Disponible demain",
      experience: "8 ans en systèmes électriques",
      success_rate: 94,
      expertise: ["Électrique", "Générateurs", "Maintenance préventive"]
    }
  ];

  const mockRecurrenceData = [
    {
      equipment: "Photocopieur Canon IR3300",
      recurrenceRate: 45,
      category: "Critique",
      totalFailures: 12,
      avgTimeBetweenFailures: 15
    },
    {
      equipment: "Imprimante HP LaserJet Pro",
      recurrenceRate: 25,
      category: "Moyen",
      totalFailures: 6,
      avgTimeBetweenFailures: 30
    }
  ];

  const mockAIMetrics = {
    predictionAccuracy: 94,
    confidenceScore: 87,
    totalPredictions: 127,
    correctPredictions: 119,
    modelVersion: "v2.3.1",
    lastUpdated: "2024-06-13 14:30"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4 md:p-6 pt-20 md:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Supervision IA</h1>
                  <p className="text-sm text-gray-500">Analyse prédictive et recommandations intelligentes</p>
                </div>
                <ConnectionStatus />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none hover:bg-blue-50 border-gray-200"
              >
                <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Sync</span>
              </Button>
              
              <Button 
                onClick={handleGenerateReport}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                size="sm"
              >
                <Brain className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Rapport IA</span>
                <span className="sm:hidden">IA</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Statistiques IA */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Analyse prédictive en temps réel
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
                IA Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-blue-600 mb-1">127</p>
                <p className="text-sm text-gray-600">Prédictions générées</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-green-600 mb-1">94%</p>
                <p className="text-sm text-gray-600">Précision IA</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-orange-600 mb-1">23</p>
                <p className="text-sm text-gray-600">Alertes préventives</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-2xl font-bold text-purple-600 mb-1">€15.2k</p>
                <p className="text-sm text-gray-600">Économies prédites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtres */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <SupervisionFilters filters={filters} onFilterChange={handleFilterChange} />
          </CardContent>
        </Card>

        {/* Contenu principal de supervision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <AIPredictionPanel />
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <AIReliabilityScore metrics={mockAIMetrics} />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <PredictionsList predictions={mockPredictions} filters={filters} />
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <RecurrenceAnalysis data={mockRecurrenceData} />
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <TechnicianRecommendations recommendations={mockTechnicians} filters={filters} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
