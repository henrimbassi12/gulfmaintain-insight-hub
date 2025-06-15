import React, { useState } from 'react';
import SupervisionFilters from '@/components/supervision/SupervisionFilters';
import { TechnicianRecommendations } from '@/components/supervision/TechnicianRecommendations';
import { PredictionsList } from '@/components/supervision/PredictionsList';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, AlertTriangle, Users } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { useSupervision } from '@/hooks/useSupervision';
import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';
import { CreateInterventionModal } from '@/components/dashboard/CreateInterventionModal';
import { PredictionDetails } from '@/components/supervision/PredictionDetails';
import { TechnicianProfileSheet } from '@/components/supervision/TechnicianProfileSheet';
import { SupervisionStats } from '@/components/supervision/SupervisionStats';

export default function Supervision() {
  const { predictions, recommendations, isLoading, error, refetch } = useSupervision();
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    region: 'all',
    riskLevel: 'all',
    equipmentType: 'refrigeration',
    timeframe: '30'
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState({});

  const [isPredictionDetailsOpen, setIsPredictionDetailsOpen] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<FailurePrediction | null>(null);
  const [isTechnicianProfileOpen, setIsTechnicianProfileOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianRecommendation | null>(null);

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
      toast.error("Erreur lors de l'actualisation");
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateReport = () => {
    toast.success("Génération du rapport de supervision démarrée...");
  };

  const handleProgramIntervention = (prediction: FailurePrediction) => {
    setModalInitialData({
      equipmentId: prediction.equipment_id,
      location: prediction.location,
      description: `Action recommandée basée sur la prédiction IA : ${prediction.recommended_action}`
    });
    setIsModalOpen(true);
  };
  
  const handleShowPredictionDetails = (prediction: FailurePrediction) => {
    setSelectedPrediction(prediction);
    setIsPredictionDetailsOpen(true);
  };
  
  const handleShowTechnicianProfile = (technician: TechnicianRecommendation) => {
    setSelectedTechnician(technician);
    setIsTechnicianProfileOpen(true);
  };

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
        <SupervisionStats predictions={predictions} recommendations={recommendations} />
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
                {predictions.length} prédictions
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
              <PredictionsList 
                predictions={predictions} 
                filters={filters}
                onProgramIntervention={handleProgramIntervention}
                onShowDetails={handleShowPredictionDetails}
              />
            )}
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
              <TechnicianRecommendations 
                recommendations={recommendations} 
                filters={filters}
                onShowProfile={handleShowTechnicianProfile} 
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Indicateur de connexion */}
      <div className="fixed bottom-4 right-4">
        <ConnectionStatus />
      </div>

      <CreateInterventionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={modalInitialData}
      />

      <PredictionDetails 
        isOpen={isPredictionDetailsOpen}
        onClose={() => setIsPredictionDetailsOpen(false)}
        prediction={selectedPrediction}
      />
      
      <TechnicianProfileSheet
        isOpen={isTechnicianProfileOpen}
        onClose={() => setIsTechnicianProfileOpen(false)}
        technician={selectedTechnician}
      />
    </AirbnbContainer>
  );
}
