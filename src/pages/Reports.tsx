import React, { useState } from 'react';
import { FileText, RefreshCw, Filter } from 'lucide-react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReportsStats } from '@/components/reports/ReportsStats';
import { AvailableForms } from '@/components/reports/AvailableForms';
import { RecentReports } from '@/components/reports/RecentReports';
import { ReportsList } from '@/components/reports/ReportsList';
import { ReportFilterModal } from '@/components/reports/ReportFilterModal';
import { useReportGeneration } from '@/hooks/useReportGeneration';
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
  const { reports, isLoading, refetch, updateReport, deleteReport, createReport } = useReports();
  const { getAvailableReports } = useReportGeneration();
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

  const handleSaveForm = async (data: any) => {
    try {
      // Créer un rapport de maintenance à partir des données du formulaire
      const reportData = {
        report_id: `MAINT-${Date.now()}`,
        equipment: data.equipment || data.nom_equipment || 'Équipement non spécifié',
        equipment_brand: data.marque || data.brand || null,
        equipment_model: data.modele || data.model || null,
        equipment_serial_number: data.serial_number || data.numero_serie || null,
        technician: userProfile?.full_name || 'Technicien non spécifié',
        assigned_technician: data.technician_assigne || data.assigned_technician || null,
        type: data.type_maintenance || data.type || 'Préventive' as const,
        priority: data.priorite || data.priority || 'medium' as const,
        status: data.statut || data.status || 'Planifié' as const,
        date: data.date_intervention || data.date || new Date().toISOString().split('T')[0],
        duration: data.duree || data.duration || '2h',
        description: data.description_travaux || data.description || 'Maintenance effectuée',
        notes: data.notes || data.observations || null,
        location: data.lieu || data.location || 'Location non spécifiée',
        region: data.region || 'Littoral',
        cost: data.cout || data.cost || 0,
        completion_percentage: data.pourcentage_completion || 0,
        next_maintenance_date: data.prochaine_maintenance || null,
        parts_used: data.pieces_utilisees || data.parts_used || []
      };

      await createReport(reportData);
      setSelectedForm(null);
      toast.success('Rapport créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du rapport:', error);
      toast.error('Erreur lors de la création du rapport');
    }
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

      <ScrollArea className="flex-1">
        <div className="space-y-8">
        <ReportsStats reports={sampleReportsStats} />
        
        <PermissionCheck allowedRoles={['admin', 'manager', 'technician']}>
          <AvailableForms 
            reportForms={sampleReportForms} 
            onCreateForm={handleCreateForm}
          />
        </PermissionCheck>

        <RecentReports reports={getAvailableReports()} />
        
        <ReportsList 
          reports={reports}
          onUpdateReport={updateReport}
          onDeleteReport={deleteReport}
          isLoading={isLoading}
        />
        </div>
      </ScrollArea>

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
