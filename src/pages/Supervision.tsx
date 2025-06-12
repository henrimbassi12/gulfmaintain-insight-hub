
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, AlertTriangle, Settings, Clock } from "lucide-react";
import AIReliabilityScore from '@/components/supervision/AIReliabilityScore';
import { PredictionsList } from '@/components/supervision/PredictionsList';
import { TechnicianRecommendations } from '@/components/supervision/TechnicianRecommendations';
import RecurrenceAnalysis from '@/components/supervision/RecurrenceAnalysis';
import SupervisionFilters from '@/components/supervision/SupervisionFilters';
import { useSupervision } from '@/hooks/useSupervision';
import { AIPredictionPanel } from '@/components/supervision/AIPredictionPanel';

const Supervision = () => {
  const [filters, setFilters] = useState({
    region: 'all',
    riskLevel: 'all',
    equipmentType: 'all',
    timeframe: '30'
  });

  const { predictions, recommendations, isLoading } = useSupervision();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Mock metrics for AI Reliability Score
  const aiMetrics = {
    predictionAccuracy: 87,
    confidenceScore: 92,
    totalPredictions: 150,
    correctPredictions: 131,
    modelVersion: "v2.1.3",
    lastUpdated: "2024-01-20 14:30"
  };

  // Mock data for RecurrenceAnalysis
  const recurrenceData = [
    {
      equipment: "Climatiseur Bureau A1",
      recurrenceRate: 45,
      category: "Critique",
      totalFailures: 8,
      avgTimeBetweenFailures: 25
    },
    {
      equipment: "Groupe électrogène Principal",
      recurrenceRate: 30,
      category: "Modéré",
      totalFailures: 5,
      avgTimeBetweenFailures: 45
    },
    {
      equipment: "Ascenseur Tour B",
      recurrenceRate: 15,
      category: "Faible",
      totalFailures: 3,
      avgTimeBetweenFailures: 90
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto p-3 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des données de supervision...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6 animate-fade-in pt-16 md:pt-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <Brain className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Supervision IA</h1>
          <p className="text-sm md:text-base text-gray-600">Prédictions et analyse prédictive des équipements</p>
        </div>
      </div>

      {/* Filtres */}
      <SupervisionFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
      />

      {/* Score de fiabilité global */}
      <AIReliabilityScore metrics={aiMetrics} />

      {/* Contenu principal sous forme d'onglets */}
      <Tabs defaultValue="predictions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="predictions" className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
            <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Prédictions de pannes</span>
            <span className="sm:hidden">Prédictions</span>
          </TabsTrigger>
          <TabsTrigger value="ai-prediction" className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
            <Brain className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Prédiction IA</span>
            <span className="sm:hidden">IA</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
            <Settings className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Recommandations techniciens</span>
            <span className="sm:hidden">Techniciens</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1 md:gap-2 p-2 md:p-3 text-xs md:text-sm">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Analyse récurrence</span>
            <span className="sm:hidden">Analyse</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <PredictionsList predictions={predictions} filters={filters} />
        </TabsContent>

        <TabsContent value="ai-prediction" className="space-y-4">
          <AIPredictionPanel />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <TechnicianRecommendations recommendations={recommendations} filters={filters} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <RecurrenceAnalysis data={recurrenceData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Supervision;
