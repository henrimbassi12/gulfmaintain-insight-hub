
import React, { useState } from 'react';
import { RefreshCw, Plus, Download } from 'lucide-react';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';
import { MaintenanceList } from '@/components/maintenance/MaintenanceList';
import { MaintenancePageFilters } from '@/components/maintenance/MaintenancePageFilters';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { Wrench } from 'lucide-react';

export default function Maintenance() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [technicianFilter, setTechnicianFilter] = useState('all');

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des maintenances...',
        success: 'Maintenances actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleExportPDF = () => {
    toast.success('Export PDF en cours...');
  };

  const handleResetFilters = () => {
    setFilterBy('all');
    setTechnicianFilter('all');
  };

  // Données de maintenance avec les vrais techniciens
  const maintenances = [
    {
      id: 'MAINT-001',
      equipment: 'TAG145 - Frigo Vestfrost INNOVA 1000',
      type: 'Préventive',
      status: 'En cours',
      technician: 'VOUKENG',
      scheduledDate: '2024-06-27',
      timeSlot: '13h30 - 15h00',
      priority: 'Haute',
      location: 'Douala Centre',
      client: 'Bar Le Central',
      description: 'Maintenance préventive mensuelle'
    },
    {
      id: 'MAINT-002',
      equipment: 'TAG211 - Frigo Haier SANDEN 500',
      type: 'Corrective',
      status: 'Prévu',
      technician: 'MBAPBOU Grégoire',
      scheduledDate: '2024-06-28',
      timeSlot: '09h00 - 11h00',
      priority: 'Urgent',
      location: 'Yaoundé Melen',
      client: 'Restaurant Chez Marie',
      description: 'Réparation compresseur défaillant'
    },
    {
      id: 'MAINT-003',
      equipment: 'TAG078 - Frigo Samsung INNOVA 650',
      type: 'Préventive',
      status: 'Terminé',
      technician: 'TCHINDA Constant',
      scheduledDate: '2024-06-26',
      timeSlot: '14h00 - 16h00',
      priority: 'Normale',
      location: 'Bafoussam Centre',
      client: 'Bar du Marché',
      description: 'Maintenance préventive standard'
    },
    {
      id: 'MAINT-004',
      equipment: 'TAG152 - Frigo LG SUPER-35',
      type: 'Corrective',
      status: 'Prévu',
      technician: 'Cédric',
      scheduledDate: '2024-06-29',
      timeSlot: '10h30 - 12h30',
      priority: 'Normale',
      location: 'Kribi Plage',
      client: 'Snack Bar Ocean',
      description: 'Problème de thermostat'
    }
  ];

  const filteredMaintenances = maintenances.filter(maintenance => {
    if (filterBy !== 'all' && maintenance.status !== filterBy) return false;
    if (technicianFilter !== 'all' && maintenance.technician !== technicianFilter) return false;
    return true;
  });

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Maintenance"
        subtitle="Gestion et suivi des interventions préventives et curatives"
        icon={Wrench}
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
            onClick={() => setIsFormModalOpen(true)}
            icon={Plus}
          >
            Nouvelle Maintenance
          </ModernButton>

          <ModernButton 
            variant="outline"
            onClick={handleExportPDF}
            icon={Download}
          >
            Exporter PDF
          </ModernButton>
        </div>
      </AirbnbHeader>

      <div className="space-y-6">
        <MaintenancePageFilters
          filterBy={filterBy}
          technicianFilter={technicianFilter}
          onFilterByChange={setFilterBy}
          onTechnicianFilterChange={setTechnicianFilter}
          onReset={handleResetFilters}
        />

        <MaintenanceList
          maintenances={filteredMaintenances}
          onMaintenanceClick={setSelectedMaintenance}
        />
      </div>

      <MaintenanceFormModal
        onSuccess={() => {
          toast.success('Maintenance créée avec succès');
          setIsFormModalOpen(false);
        }}
      />

      {selectedMaintenance && (
        <MaintenanceDetails
          maintenance={selectedMaintenance}
          isOpen={!!selectedMaintenance}
          onClose={() => setSelectedMaintenance(null)}
          onEdit={() => console.log('Edit maintenance')}
          onUpdateStatus={() => console.log('Update status')}
        />
      )}
    </AirbnbContainer>
  );
}
