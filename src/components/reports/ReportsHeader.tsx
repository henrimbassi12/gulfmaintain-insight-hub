
import React, { useState } from 'react';
import { FileText, RefreshCw, BarChart3 } from 'lucide-react';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { ReportGeneratorModal } from '@/components/dashboard/ReportGeneratorModal';
import { useReportGeneration } from "@/hooks/useReportGeneration";

interface ReportsHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
  onGenerateReport: () => void;
}

export function ReportsHeader({ refreshing, onRefresh, onGenerateReport }: ReportsHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generateReport, isGenerating } = useReportGeneration();

  const handleGenerateReport = () => {
    setIsModalOpen(true);
  };

  const handleQuickGenerate = () => {
    generateReport('maintenance');
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
          onClick={handleQuickGenerate}
          icon={BarChart3}
          disabled={isGenerating}
        >
          {isGenerating ? 'Génération...' : 'Générer rapport'}
        </ModernButton>

        <ModernButton
          onClick={handleGenerateReport}
          icon={FileText}
          variant="outline"
        >
          Générateur avancé
        </ModernButton>
      </AirbnbHeader>

      <ReportGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
