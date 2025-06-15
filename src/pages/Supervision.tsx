
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
// Données d'exemple pour la démo
import { failurePredictionSamples, technicianRecommendationSamples } from '@/data/supervision-samples';

export default function Supervision() {
  const [selectedPrediction, setSelectedPrediction] = useState<FailurePrediction | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianRecommendation | null>(null);

  // Filtrer pour ne montrer que les prédictions à haut risque et limiter le nombre d'exemples
  const predictions = failurePredictionSamples.filter(p => p.failure_risk > 70).slice(0, 3);
  const technicians = technicianRecommendationSamples.slice(0, 2);

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Supervision & IA"
        subtitle="Détail des modèles prédictifs"
        icon={Brain}
      />

      <div className="space-y-8 py-6">
        <IntelligentFailurePredictionPanel 
          predictions={predictions} 
          onSelectPrediction={setSelectedPrediction} 
        />
        <MaintenanceEfficiencyPredictionPanel />
        <TechnicianAssignmentOptimizationPanel 
          technicians={technicians}
          onSelectTechnician={setSelectedTechnician}
        />
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
