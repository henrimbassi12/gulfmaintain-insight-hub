
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { ReportsHeader } from '@/components/reports/ReportsHeader';
import { ReportsStats } from '@/components/reports/ReportsStats';
import { AvailableForms, ReportForm } from '@/components/reports/AvailableForms';
import { RecentReports } from '@/components/reports/RecentReports';
import { ReportModals } from '@/components/reports/ReportModals';

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
    toast.success("Génération du rapport démarrée...");
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

  const reportForms: ReportForm[] = [
    { 
      id: 'tracking', 
      title: 'Fiche de Suivi et de Maintenance du Réfrigérateur Guinness', 
      description: 'Suivi détaillé et historique de la maintenance par réfrigérateur.', 
      action: () => setTrackingFormOpen(true) 
    },
    { 
      id: 'maintenance', 
      title: 'Fiche d’Entretien des Frigos', 
      description: 'Formulaire pour l’entretien périodique des réfrigérateurs.', 
      action: () => setMaintenanceFormOpen(true) 
    },
    { 
      id: 'movement', 
      title: 'Fiche de Suivi de Mouvement des Frigos', 
      description: 'Enregistrement des déplacements et transferts de frigos.', 
      action: () => setMovementFormOpen(true) 
    },
    { 
      id: 'repair', 
      title: 'Fiche de Suivi des Réparations des Frigos', 
      description: 'Documentation des pannes et des réparations effectuées.', 
      action: () => setRepairFormOpen(true) 
    },
    { 
      id: 'depot', 
      title: 'Fiche de Passe au Dépôt', 
      description: 'Suivi des passages des techniciens au dépôt.', 
      action: () => setDepotFormOpen(true) 
    }
  ];

  return (
    <AirbnbContainer>
      <ReportsHeader
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onGenerateReport={handleGenerateReport}
      />
      
      <ReportsStats reports={reports} />
      
      <AvailableForms reportForms={reportForms} />
      
      <RecentReports reports={reports} />
      
      <ReportModals
        isTrackingFormOpen={isTrackingFormOpen}
        setTrackingFormOpen={setTrackingFormOpen}
        isMaintenanceFormOpen={isMaintenanceFormOpen}
        setMaintenanceFormOpen={setMaintenanceFormOpen}
        isMovementFormOpen={isMovementFormOpen}
        setMovementFormOpen={setMovementFormOpen}
        isRepairFormOpen={isRepairFormOpen}
        setRepairFormOpen={setRepairFormOpen}
        isDepotFormOpen={isDepotFormOpen}
        setDepotFormOpen={setDepotFormOpen}
        onSaveForm={handleSaveForm}
      />
    </AirbnbContainer>
  );
}
