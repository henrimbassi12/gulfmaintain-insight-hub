
import React, { useState } from 'react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { Brain } from 'lucide-react';
import { MaintenanceEfficiencyPredictionPanel } from '@/components/supervision/MaintenanceEfficiencyPredictionPanel';
import { TechnicianAssignmentOptimizationPanel } from '@/components/supervision/TechnicianAssignmentOptimizationPanel';
import { IntelligentFailurePredictionPanel } from '@/components/supervision/IntelligentFailurePredictionPanel';
import { PredictionDetails } from '@/components/supervision/PredictionDetails';
import { TechnicianProfileSheet } from '@/components/supervision/TechnicianProfileSheet';
import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';
import { useSupervision } from '@/hooks/useSupervision';
import { Skeleton } from '@/components/ui/skeleton';

export default function Supervision() {
  const [selectedPrediction, setSelectedPrediction] = useState<FailurePrediction | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianRecommendation | null>(null);

  const { predictions: allPredictions, recommendations: allRecommendations, isLoading } = useSupervision();

  // Filtrer pour ne montrer que les prédictions à haut risque et limiter le nombre d'exemples
  const highRiskPredictions = allPredictions.filter(p => p.failure_risk > 70).slice(0, 3);
  const recommendedTechnicians = allRecommendations.slice(0, 2);

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Supervision & IA"
        subtitle="Détail des modèles prédictifs"
        icon={Brain}
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
