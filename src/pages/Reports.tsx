
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

  // Données d'exemple pour les rapports
  const sampleReports = [
    {
      id: 'RPT-001',
      title: 'Rapport de maintenance préventive',
      type: 'maintenance',
      date: '2024-06-24',
      status: 'completed'
    },
    {
      id: 'RPT-002',
      title: 'Rapport d\'intervention corrective',
      type: 'intervention',
      date: '2024-06-23',
      status: 'pending'
    }
  ];

  const sampleReportForms = [
    {
      id: 'form-1',
      name: 'Maintenance préventive',
      description: 'Formulaire pour les maintenances programmées',
      fields: ['equipment', 'technician', 'date', 'duration']
    },
    {
      id: 'form-2',
      name: 'Intervention corrective',
      description: 'Formulaire pour les réparations',
      fields: ['equipment', 'issue', 'solution', 'parts']
    }
  ];

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
        <ReportsStats reports={sampleReports} />
        <AvailableForms 
          reportForms={sampleReportForms} 
          onCreateForm={() => console.log('Create form')}
        />
        <RecentReports reports={sampleReports} />
      </div>

      <ReportFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </AirbnbContainer>
  );
}
