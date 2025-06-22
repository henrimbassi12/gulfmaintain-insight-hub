
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { ReportsHeader } from '@/components/reports/ReportsHeader';
import { ReportsStats } from '@/components/reports/ReportsStats';
import { AvailableForms } from '@/components/reports/AvailableForms';
import { RecentReports } from '@/components/reports/RecentReports';
import { MaintenanceTrackingForm } from '@/components/forms/MaintenanceTrackingForm';
import { RefrigeratorMaintenanceForm } from '@/components/forms/RefrigeratorMaintenanceForm';
import { MovementForm } from '@/components/forms/MovementForm';
import { RepairForm } from '@/components/forms/RepairForm';
import { DepotScheduleForm } from '@/components/forms/DepotScheduleForm';

// We can move these interfaces to a types file later if needed
interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  size: string;
}

export default function Reports() {
  const [refreshing, setRefreshing] = useState(false);
  const [isTrackingFormOpen, setTrackingFormOpen] = useState(false);
  const [isMaintenanceFormOpen, setMaintenanceFormOpen] = useState(false);
  const [isMovementFormOpen, setMovementFormOpen] = useState(false);
  const [isRepairFormOpen, setRepairFormOpen] = useState(false);
  const [isDepotFormOpen, setDepotFormOpen] = useState(false);

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

  const handleGenerateReport = () => {
    // Cette fonction sera gérée par le modal de filtrage dans ReportsHeader
  };

  const handleCreateForm = (formId: string) => {
    switch (formId) {
      case 'tracking':
        setTrackingFormOpen(true);
        break;
      case 'maintenance':
        setMaintenanceFormOpen(true);
        break;
      case 'movement':
        setMovementFormOpen(true);
        break;
      case 'repair':
        setRepairFormOpen(true);
        break;
      case 'depot':
        setDepotFormOpen(true);
        break;
    }
  };

  const reports: Report[] = [
    {
      id: 1,
      title: 'Rapport mensuel - Janvier 2024',
      type: 'Maintenance',
      date: '31/01/2024',
      status: 'Terminé',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Analyse des pannes - Q4 2023',
      type: 'Analyse',
      date: '15/01/2024',
      status: 'Terminé',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Performance techniciens - Décembre',
      type: 'RH',
      date: '05/01/2024',
      status: 'En cours',
      size: '-'
    }
  ];

  const handleSaveForm = (data: any) => {
    console.log('Form data saved:', data);
    toast.success('Fiche enregistrée avec succès !');
  };

  return (
    <AirbnbContainer>
      <ReportsHeader
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onGenerateReport={handleGenerateReport}
      />
      
      <ReportsStats reports={reports} />
      
      <AvailableForms 
        reportForms={[]} 
        onCreateForm={handleCreateForm}
      />
      
      <RecentReports reports={reports} />
      
      <MaintenanceTrackingForm
        isOpen={isTrackingFormOpen}
        onClose={() => setTrackingFormOpen(false)}
        onSave={handleSaveForm}
      />

      <RefrigeratorMaintenanceForm
        isOpen={isMaintenanceFormOpen}
        onClose={() => setMaintenanceFormOpen(false)}
        onSave={handleSaveForm}
      />

      <MovementForm
        isOpen={isMovementFormOpen}
        onClose={() => setMovementFormOpen(false)}
        onSave={handleSaveForm}
      />

      <RepairForm
        isOpen={isRepairFormOpen}
        onClose={() => setRepairFormOpen(false)}
        onSave={handleSaveForm}
      />

      <DepotScheduleForm
        isOpen={isDepotFormOpen}
        onClose={() => setDepotFormOpen(false)}
        onSave={handleSaveForm}
      />
    </AirbnbContainer>
  );
}
