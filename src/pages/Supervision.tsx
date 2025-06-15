
import React, { useState } from 'react';
import SupervisionFilters from '@/components/supervision/SupervisionFilters';
import { AIPredictionPanel } from '@/components/supervision/AIPredictionPanel';
import RecurrenceAnalysis from '@/components/supervision/RecurrenceAnalysis';
import { TechnicianRecommendations } from '@/components/supervision/TechnicianRecommendations';
import { PredictionsList } from '@/components/supervision/PredictionsList';
import AIReliabilityScore from '@/components/supervision/AIReliabilityScore';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, Activity, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { useSupervision } from '@/hooks/useSupervision';

export default function Supervision() {
  const { predictions, recommendations, isLoading, error, refetch } = useSupervision();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    region: 'all',
    riskLevel: 'all',
    equipmentType: 'all',
    timeframe: '30'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Données actualisées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateReport = () => {
    toast.success("Génération du rapport de supervision démarrée...");
  };

  // Statistiques calculées à partir des données réelles
  const totalPredictions = predictions.length;
  const highRiskPredictions = predictions.filter(p => p.failure_risk > 70).length;
  const mediumRiskPredictions = predictions.filter(p => p.failure_risk >= 30 && p.failure_risk <= 70).length;
  const lowRiskPredictions = predictions.filter(p => p.failure_risk < 30).length;

  const mockAIMetrics = {
    predictionAccuracy: 92,
    confidenceScore: 87,
    totalPredictions: totalPredictions,
    correctPredictions: Math.floor(totalPredictions * 0.92),
    modelVersion: 'v2.1.3',
    lastUpdated: new Date().toLocaleString('fr-FR')
  };

  const mockRecurrenceData = [
    {
      equipment: 'Réfrigérateur Commercial A1',
      recurrenceRate: 45,
      category: 'Critique',
      totalFailures: 8,
      avgTimeBetweenFailures: 22
    },
    {
      equipment: 'Climatiseur Bureau B2',
      recurrenceRate: 25,
      category: 'Modéré',
      totalFailures: 4,
      avgTimeBetweenFailures: 45
    },
    {
      equipment: 'Système HVAC C3',
      recurrenceRate: 35,
      category: 'Modéré',
      totalFailures: 6,
      avgTimeBetweenFailures: 30
    }
  ];

  if (error) {
    return (
      <AirbnbContainer>
        <AirbnbHeader
          title="Supervision & IA"
          subtitle="Analyse prédictive et supervision intelligente"
          icon={Brain}
        />
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </AirbnbContainer>
    );
  }

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Supervision & IA"
        subtitle="Analyse prédictive et supervision intelligente"
        icon={Brain}
      >
        <ModernButton 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing || isLoading}
          icon={RefreshCw}
          className={refreshing ? 'animate-spin' : ''}
        >
          Actualiser
        </ModernButton>
        
        <ModernButton 
          onClick={handleGenerateReport}
          icon={AlertTriangle}
        >
          Rapport IA
        </ModernButton>
      </AirbnbHeader>

      {/* Indicateurs de statut */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Prédictions</p>
                  <p className="text-2xl font-bold text-blue-700">{totalPredictions}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Risque Élevé</p>
                  <p className="text-2xl font-bold text-red-700">{highRiskPredictions}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Risque Moyen</p>
                  <p className="text-2xl font-bold text-orange-700">{mediumRiskPredictions}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Techniciens Disponibles</p>
                  <p className="text-2xl font-bold text-green-700">{recommendations.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Toutes les sections empilées verticalement */}
      <div className="space-y-6">
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <SupervisionFilters filters={filters} onFilterChange={handleFilterChange} />
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Prédictions de Pannes
              <Badge variant="secondary" className="ml-2">
                {totalPredictions} prédictions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Chargement des prédictions...</p>
              </div>
            ) : (
              <PredictionsList predictions={predictions} filters={filters} />
            )}
          </CardContent>
        </Card>
        
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
        
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <RecurrenceAnalysis data={mockRecurrenceData} />
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Recommandations Techniciens
              <Badge variant="secondary" className="ml-2">
                {recommendations.length} recommandations
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Chargement des recommandations...</p>
              </div>
            ) : (
              <TechnicianRecommendations recommendations={recommendations} filters={filters} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Indicateur de connexion */}
      <div className="fixed bottom-4 right-4">
        <ConnectionStatus />
      </div>
    </AirbnbContainer>
  );
}
