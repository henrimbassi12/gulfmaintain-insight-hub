
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, AlertTriangle, Settings, Clock } from "lucide-react";
import AIReliabilityScore from '@/components/supervision/AIReliabilityScore';
import { PredictionsList } from '@/components/supervision/PredictionsList';
import { TechnicianRecommendations } from '@/components/supervision/TechnicianRecommendations';
import { RecurrenceAnalysis } from '@/components/supervision/RecurrenceAnalysis';
import { SupervisionFilters } from '@/components/supervision/SupervisionFilters';
import { useSupervision } from '@/hooks/useSupervision';

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des données de supervision...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supervision IA</h1>
          <p className="text-gray-600">Prédictions et analyse prédictive des équipements</p>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Prédictions de pannes
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Recommandations techniciens
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analyse récurrence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <PredictionsList predictions={predictions} filters={filters} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <TechnicianRecommendations recommendations={recommendations} filters={filters} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <RecurrenceAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Supervision;
