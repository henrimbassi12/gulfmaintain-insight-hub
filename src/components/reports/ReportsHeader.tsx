
import React from 'react';
import { FileText, RefreshCw, BarChart3 } from 'lucide-react';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';

interface ReportsHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
  onGenerateReport: () => void;
}

export function ReportsHeader({ refreshing, onRefresh, onGenerateReport }: ReportsHeaderProps) {
  return (
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
        onClick={onGenerateReport}
        icon={BarChart3}
      >
        Générer rapport
      </ModernButton>
    </AirbnbHeader>
  );
}
