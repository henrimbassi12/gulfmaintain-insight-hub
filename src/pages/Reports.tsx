import React, { useState } from 'react';
import { FileText, RefreshCw, Filter } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { ReportsStats } from '@/components/reports/ReportsStats';
import { AvailableForms } from '@/components/reports/AvailableForms';
import { ReportsList } from '@/components/reports/ReportsList';
import { ReportFilterModal } from '@/components/reports/ReportFilterModal';
import { MaintenanceTrackingForm } from '@/components/forms/MaintenanceTrackingForm';
import { RefrigeratorMaintenanceForm } from '@/components/forms/RefrigeratorMaintenanceForm';
import { MovementForm } from '@/components/forms/MovementForm';
import { RepairForm } from '@/components/forms/RepairForm';
import { DepotScheduleForm } from '@/components/forms/DepotScheduleForm';
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionCheck } from '@/components/auth/PermissionCheck';
import { toast } from 'sonner';
import { Wrench, Settings } from 'lucide-react';

export default function Reports() {
  const { userProfile } = useAuth();
  const { reports, isLoading, refetch, updateReport, deleteReport } = useReports();
  const [refreshing, setRefreshing] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<{type: string, title: string} | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Rapports actualisés avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateForm = (formId: string) => {
    const formTitles: Record<string, string> = {
      'tracking': 'Fiche de Suivi et de Maintenance du Réfrigérateur Guinness',
      'maintenance': 'Fiche d\'Entretien des Frigos',
      'movement': 'Fiche de Suivi de Mouvement des Frigos',
      'repair': 'Fiche de Suivi des Réparations des Frigos',
      'depot': 'Fiche de Passe au Dépôt'
    };

    setSelectedForm({
      type: formId,
      title: formTitles[formId] || 'Fiche de maintenance'
    });
  };

  const handleSaveForm = (data: any) => {
    console.log('Données sauvegardées:', data);
    // Ici on pourrait sauvegarder les données dans la base de données
  };

  // Données d'exemple pour les statistiques
  const sampleReportsStats = [
    {
      id: 1,
      title: 'Rapport de maintenance préventive',
      type: 'maintenance',
      date: '2024-06-24',
      status: 'completed',
      size: '2.5 MB'
    },
    {
      id: 2,
      title: 'Rapport d\'intervention corrective',
      type: 'intervention',
      date: '2024-06-23',
      status: 'pending',
      size: '1.8 MB'
    }
  ];

  const sampleReportForms = [
    {
      id: 'form-1',
      name: 'Maintenance préventive',
      title: 'Maintenance préventive',
      description: 'Formulaire pour les maintenances programmées',
      fields: ['equipment', 'technician', 'date', 'duration'],
      icon: Wrench,
      action: () => handleCreateForm('maintenance')
    },
    {
      id: 'form-2',
      name: 'Intervention corrective',
      title: 'Intervention corrective',
      description: 'Formulaire pour les réparations',
      fields: ['equipment', 'issue', 'solution', 'parts'],
      icon: Settings,
      action: () => handleCreateForm('repair')
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
            iconClassName={refreshing ? 'animate-spin' : ''}
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
        <ReportsStats reports={sampleReportsStats} />
        
        <PermissionCheck allowedRoles={['admin', 'manager', 'technician']}>
          <AvailableForms 
            reportForms={sampleReportForms} 
            onCreateForm={handleCreateForm}
          />
        </PermissionCheck>
        
        <ReportsList 
          reports={reports}
          onUpdateReport={updateReport}
          onDeleteReport={deleteReport}
          isLoading={isLoading}
        />
      </div>

      <ReportFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* Formulaires dynamiques */}
      {selectedForm?.type === 'tracking' && (
        <MaintenanceTrackingForm
          isOpen={!!selectedForm}
          onClose={() => setSelectedForm(null)}
          onSave={handleSaveForm}
        />
      )}

      {selectedForm?.type === 'maintenance' && (
        <RefrigeratorMaintenanceForm
          isOpen={!!selectedForm}
          onClose={() => setSelectedForm(null)}
          onSave={handleSaveForm}
        />
      )}

      {selectedForm?.type === 'movement' && (
        <MovementForm
          isOpen={!!selectedForm}
          onClose={() => setSelectedForm(null)}
          onSave={handleSaveForm}
        />
      )}

      {selectedForm?.type === 'repair' && (
        <RepairForm
          isOpen={!!selectedForm}
          onClose={() => setSelectedForm(null)}
          onSave={handleSaveForm}
        />
      )}

      {selectedForm?.type === 'depot' && (
        <DepotScheduleForm
          isOpen={!!selectedForm}
          onClose={() => setSelectedForm(null)}
          onSave={handleSaveForm}
        />
      )}
    </AirbnbContainer>
  );
}
