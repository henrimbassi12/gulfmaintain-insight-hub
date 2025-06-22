
import React, { useState } from 'react';
import { FileText, RefreshCw, BarChart3 } from 'lucide-react';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { ReportFilterModal } from '@/components/reports/ReportFilterModal';
import { useReportGeneration } from "@/hooks/useReportGeneration";

interface ReportsHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
  onGenerateReport: () => void;
}

export function ReportsHeader({ refreshing, onRefresh, onGenerateReport }: ReportsHeaderProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { generateReport, isGenerating } = useReportGeneration();

  const handleGenerateReport = () => {
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
          onClick={handleGenerateReport}
          icon={BarChart3}
          disabled={isGenerating}
        >
          Générer rapport
        </ModernButton>
      </AirbnbHeader>

      <ReportFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </>
  );
}
