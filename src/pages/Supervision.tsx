
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, RefreshCw, Activity, TrendingUp, Brain } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { AIPredictionPanel } from '@/components/supervision/AIPredictionPanel';
import SupervisionFilters from '@/components/supervision/SupervisionFilters';
import { PredictionsList } from '@/components/supervision/PredictionsList';
import { RecurrenceAnalysis } from '@/components/supervision/RecurrenceAnalysis';
import { TechnicianRecommendations } from '@/components/supervision/TechnicianRecommendations';
import { AIReliabilityScore } from '@/components/supervision/AIReliabilityScore';
import { toast } from 'sonner';

export default function Supervision() {
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4 md:p-6">
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
            <SupervisionFilters />
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
              <AIReliabilityScore />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <PredictionsList />
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <RecurrenceAnalysis />
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <TechnicianRecommendations />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
