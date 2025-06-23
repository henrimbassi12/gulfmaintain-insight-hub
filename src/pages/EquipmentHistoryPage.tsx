
import React from 'react';
import { EquipmentHistory } from '@/components/EquipmentHistory';
import { Clock, RefreshCw } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

export default function EquipmentHistoryPage() {
  const handleRefresh = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1000)),
      {
        loading: 'Actualisation de l\'historique...',
        success: 'Historique actualisé avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Historique des équipements"
        subtitle="Timeline complète des interventions et maintenances"
        icon={Clock}
      >
        <ModernButton 
          variant="outline" 
          onClick={handleRefresh}
          icon={RefreshCw}
        >
          Actualiser
        </ModernButton>
      </AirbnbHeader>

      <EquipmentHistory />
    </AirbnbContainer>
  );
}
