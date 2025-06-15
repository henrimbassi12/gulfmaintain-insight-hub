
import React from 'react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { Brain } from 'lucide-react';
import { MaintenanceEfficiencyPredictionPanel } from '@/components/supervision/MaintenanceEfficiencyPredictionPanel';
import { TechnicianAssignmentOptimizationPanel } from '@/components/supervision/TechnicianAssignmentOptimizationPanel';
import { IntelligentFailurePredictionPanel } from '@/components/supervision/IntelligentFailurePredictionPanel';

export default function Supervision() {

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Supervision & IA"
        subtitle="Détail des modèles prédictifs"
        icon={Brain}
      />

      <div className="space-y-8 py-6">
        <IntelligentFailurePredictionPanel />
        <MaintenanceEfficiencyPredictionPanel />
        <TechnicianAssignmentOptimizationPanel />
      </div>
    </AirbnbContainer>
  );
}
