import React, { useState } from 'react';
import { SupervisionFilters } from '@/components/supervision/SupervisionFilters';
import { AIPredictionPanel } from '@/components/supervision/AIPredictionPanel';
import { RecurrenceAnalysis } from '@/components/supervision/RecurrenceAnalysis';
import { TechnicianRecommendations } from '@/components/supervision/TechnicianRecommendations';
import { PredictionsList } from '@/components/supervision/PredictionsList';
import { AIReliabilityScore } from '@/components/supervision/AIReliabilityScore';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, Activity, AlertTriangle } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

interface FailurePrediction {
  id: string;
  equipment_id: string;
  equipment_name: string;
  failure_risk: number;
  type: "AF" | "NF";
  location: string;
  predicted_date: string;
  recommended_action: string;
  created_at: string;
  updated_at: string;
}

export default function Supervision() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des prédictions...',
        success: 'Prédictions actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleGenerateReport = () => {
    toast.success("Génération du rapport de supervision démarrée...");
  };

  // Mock data with proper typing
  const mockPredictions: FailurePrediction[] = [
    {
      id: '1',
      equipment_id: 'FR-2024-089',
      equipment_name: 'Réfrigérateur Commercial A1',
      failure_risk: 0.85,
      type: 'AF',
      location: 'Agence Casablanca Nord',
      predicted_date: '2024-02-15',
      recommended_action: 'Maintenance préventive immédiate',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      equipment_id: 'FR-2024-012',
      equipment_name: 'Climatiseur Bureau B2',
      failure_risk: 0.72,
      type: 'NF',
      location: 'Agence Rabat Centre',
      predicted_date: '2024-02-22',
      recommended_action: 'Inspection programmée',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      equipment_id: 'FR-2024-134',
      equipment_name: 'Système HVAC C3',
      failure_risk: 0.68,
      type: 'AF',
      location: 'Agence Marrakech Sud',
      predicted_date: '2024-03-01',
      recommended_action: 'Surveillance renforcée',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];

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
          disabled={refreshing}
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

      {/* Statistiques de supervision */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
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
              <p className="text-2xl font-bold text-red-600 mb-1">3</p>
              <p className="text-sm text-gray-600">Risques élevés détectés</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-orange-600 mb-1">7</p>
              <p className="text-sm text-gray-600">Alertes moyennes</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-green-600 mb-1">92%</p>
              <p className="text-sm text-gray-600">Précision IA</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-blue-600 mb-1">15</p>
              <p className="text-sm text-gray-600">Pannes évitées ce mois</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grille principale */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <SupervisionFilters />
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <PredictionsList predictions={mockPredictions} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
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
      </div>

      {/* Section analyse et recommandations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
    </AirbnbContainer>
  );
}
