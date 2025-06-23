
import React, { useState } from 'react';
import { FileText, RefreshCw, Filter } from 'lucide-react';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { ReportFilterModal } from '@/components/reports/ReportFilterModal';

interface ReportsHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
  onGenerateReport: () => void;
}

export function ReportsHeader({ refreshing, onRefresh, onGenerateReport }: ReportsHeaderProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleFilterReports = () => {
    setIsFilterModalOpen(true);
  };

  return (
    <>
      <AirbnbHeader
        title="Rapports"
        subtitle="Génération et consultation des rapports d'activité"
        icon={FileText}
      >
        <ModernButton
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
          icon={RefreshCw}
          className={refreshing ? 'animate-spin' : ''}
        >
          Actualiser
        </ModernButton>

        <ModernButton
          onClick={handleFilterReports}
          icon={Filter}
        >
          Filtrer et télécharger
        </ModernButton>
      </AirbnbHeader>

      <ReportFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </>
  );
}
