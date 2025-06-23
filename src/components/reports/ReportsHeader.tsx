
import React, { useState } from 'react';
import { FileText, RefreshCw, Filter, Eye, Download } from 'lucide-react';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { ReportFilterModal } from '@/components/reports/ReportFilterModal';
import { toast } from 'sonner';

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

  const handleViewReport = () => {
    toast.success('Ouverture de la vue des rapports');
    // Logique pour afficher les rapports
  };

  const handleDownloadReports = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Préparation du téléchargement...',
        success: 'Rapports téléchargés avec succès !',
        error: 'Erreur lors du téléchargement'
      }
    );
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
          variant="outline"
          onClick={handleViewReport}
          icon={Eye}
        >
          Voir
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
