
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

  // Mock data for components with correct types
  const mockPredictions = [
    {
      id: 1,
      equipment_id: "FR-2024-089",
      equipment_name: "Climatiseur Bureau A1",
      failure_risk: 85,
      type: "AF",
      location: "Tunis - Siège",
      predicted_date: "2024-06-20",
      recommended_action: "Remplacer le filtre et vérifier le système de refroidissement",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      equipment_id: "FR-2024-090",
      equipment_name: "Générateur Secours B2",
      failure_risk: 92,
      type: "NF",
      location: "Sfax - Agence",
      predicted_date: "2024-06-18",
      recommended_action: "Maintenance préventive urgente - vérifier les connexions électriques",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const mockTechnicians = [
    {
      id: 1,
      equipment_id: "FR-2024-089",
      technician: "Ahmed Ben Ali",
      equipment_name: "Climatiseur Bureau A1",
      location: "Tunis - Siège",
      match_score: 95,
      availability: "Disponible aujourd'hui",
      experience: "5 ans en climatisation",
      success_rate: 98,
      expertise: ["Climatisation", "Électrique", "Diagnostic"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      equipment_id: "FR-2024-090",
      technician: "Fatma Gharbi",
      equipment_name: "Générateur Secours B2",
      location: "Sfax - Agence",
      match_score: 88,
      availability: "Disponible demain",
      experience: "8 ans en systèmes électriques",
      success_rate: 94,
      expertise: ["Électrique", "Générateurs", "Maintenance préventive"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header moderne façon Airbnb */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Supervision IA</h1>
                <p className="text-gray-500 text-sm">Analyse prédictive et recommandations intelligentes</p>
              </div>
              <ConnectionStatus />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              
              <Button 
                onClick={handleGenerateReport}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Brain className="w-4 h-4 mr-2" />
                Rapport IA
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Métriques IA modernes */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Analyse prédictive en temps réel</h2>
                <p className="text-gray-600 text-sm">Insights alimentés par l'intelligence artificielle</p>
              </div>
              <Badge className="ml-auto bg-blue-100 text-blue-700 border-blue-200">
                IA Active
              </Badge>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-100">
                <p className="text-3xl font-bold text-blue-600 mb-2">127</p>
                <p className="text-sm text-gray-600 font-medium">Prédictions générées</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-100">
                <p className="text-3xl font-bold text-green-600 mb-2">94%</p>
                <p className="text-sm text-gray-600 font-medium">Précision IA</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-100">
                <p className="text-3xl font-bold text-orange-600 mb-2">23</p>
                <p className="text-sm text-gray-600 font-medium">Alertes préventives</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-100">
                <p className="text-3xl font-bold text-purple-600 mb-2">€15.2k</p>
                <p className="text-sm text-gray-600 font-medium">Économies prédites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres élégants */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SupervisionFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Contenu principal avec layout Airbnb */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <AIPredictionPanel />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <AIReliabilityScore metrics={mockAIMetrics} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <PredictionsList predictions={mockPredictions} filters={filters} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <RecurrenceAnalysis data={mockRecurrenceData} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <TechnicianRecommendations recommendations={mockTechnicians} filters={filters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
