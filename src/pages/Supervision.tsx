
import React, { useState } from 'react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { Bot } from 'lucide-react';
import { MaintenanceEfficiencyPredictionPanel } from '@/components/supervision/MaintenanceEfficiencyPredictionPanel';
import { TechnicianAssignmentOptimizationPanel } from '@/components/supervision/TechnicianAssignmentOptimizationPanel';
import { IntelligentFailurePredictionPanel } from '@/components/supervision/IntelligentFailurePredictionPanel';
import { PredictionDetails } from '@/components/supervision/PredictionDetails';
import { TechnicianProfileSheet } from '@/components/supervision/TechnicianProfileSheet';
import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';
import { useSupervision } from '@/hooks/useSupervision';
import { Skeleton } from '@/components/ui/skeleton';
import { AIPredictionPanel } from '@/components/supervision/AIPredictionPanel';
import { APITestPanel } from '@/components/ai/APITestPanel';

export default function Supervision() {
  const [selectedPrediction, setSelectedPrediction] = useState<FailurePrediction | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianRecommendation | null>(null);

  const { predictions: allPredictions, recommendations: allRecommendations, isLoading } = useSupervision();

  // On affiche toutes les prédictions et recommandations des données d'exemple.
  const highRiskPredictions = allPredictions.filter(p => p.failure_risk > 70);
  const recommendedTechnicians = allRecommendations;

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Supervision & IA"
        subtitle="Détail des modèles prédictifs"
        icon={Bot}
      />

      <div className="space-y-8 py-6">
        {isLoading ? (
          <>
            <Skeleton className="h-[450px] w-full rounded-lg" />
            <Skeleton className="h-[350px] w-full rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </>
        ) : (
          <>
            {/* Panel de test API - Ajouté en premier pour tester la connexion */}
            <APITestPanel />
            <AIPredictionPanel />
            <IntelligentFailurePredictionPanel 
              predictions={highRiskPredictions} 
              onSelectPrediction={setSelectedPrediction} 
            />
            <MaintenanceEfficiencyPredictionPanel />
            <TechnicianAssignmentOptimizationPanel 
              technicians={recommendedTechnicians}
              onSelectTechnician={setSelectedTechnician}
            />
          </>
        )}
      </div>

      <PredictionDetails
        isOpen={!!selectedPrediction}
        onClose={() => setSelectedPrediction(null)}
        prediction={selectedPrediction}
      />
      
      <TechnicianProfileSheet
        isOpen={!!selectedTechnician}
        onClose={() => setSelectedTechnician(null)}
        technician={selectedTechnician}
      />
    </AirbnbContainer>
  );
}
