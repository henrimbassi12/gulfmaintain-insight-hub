
import React, { useState } from 'react';
import { FileText, RefreshCw, Filter } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { ReportsHeader } from '@/components/reports/ReportsHeader';
import { ReportsStats } from '@/components/reports/ReportsStats';
import { AvailableForms } from '@/components/reports/AvailableForms';
import { RecentReports } from '@/components/reports/RecentReports';
import { ReportFilterModal } from '@/components/reports/ReportFilterModal';
import { toast } from 'sonner';

export default function Reports() {
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des rapports...',
        success: 'Rapports actualisés avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Rapports"
        subtitle="Génération et consultation des rapports d'activité"
        icon={FileText}
      >
        <div className="flex flex-col gap-2 w-full">
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
            onClick={() => setIsFilterModalOpen(true)}
            icon={Filter}
          >
            Filtrer et télécharger
          </ModernButton>
        </div>
      </AirbnbHeader>

      <div className="space-y-8">
        <ReportsStats />
        <AvailableForms />
        <RecentReports />
      </div>

      <ReportFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </AirbnbContainer>
  );
}
