
import React, { useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';
import { MaintenanceEditModal } from '@/components/maintenance/MaintenanceEditModal';
import { MaintenanceList } from '@/components/maintenance/MaintenanceList';
import { MaintenancePageFilters } from '@/components/maintenance/MaintenancePageFilters';
import { MaintenanceStatsCard } from '@/components/maintenance/MaintenanceStatsCard';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Wrench } from 'lucide-react';
import { usePlannedMaintenances } from '@/hooks/usePlannedMaintenances';

export default function Maintenance() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [technicianFilter, setTechnicianFilter] = useState('all');

  const { maintenances, isLoading, refetch, updateMaintenance, updateMaintenanceStatus } = usePlannedMaintenances();

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      refetch(),
      {
        loading: 'Actualisation des maintenances...',
        success: 'Maintenances actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleResetFilters = () => {
    setFilterBy('all');
    setTechnicianFilter('all');
    toast.success('Filtres réinitialisés');
  };

  // Filtrage des maintenances basé sur les données réelles
  const filteredMaintenances = maintenances.filter(maintenance => {
    if (filterBy !== 'all' && maintenance.priorite.toLowerCase() !== filterBy) return false;
    if (technicianFilter !== 'all' && maintenance.technician_assigne !== technicianFilter) return false;
    return true;
  });

  // Transformation des données pour compatibilité avec MaintenanceList
  const transformedMaintenances = filteredMaintenances.map(maintenance => {
    // Déterminer le statut basé sur la description ou un champ statut 
    let status = 'planned';
    if (maintenance.description?.includes('En cours')) {
      status = 'in-progress';
    } else if (maintenance.description?.includes('Terminé')) {
      status = 'completed';
    }
    
    return {
      id: maintenance.id,
      equipment: `${maintenance.type_frigo} - ${maintenance.serial_number}`,
      type: maintenance.type_maintenance,
      status: status,
      technician: maintenance.technician_assigne,
      scheduledDate: maintenance.date_programmee,
      timeSlot: maintenance.duree_estimee,
      priority: maintenance.priorite,
      location: `${maintenance.ville} - ${maintenance.quartier}`,
      client: maintenance.nom_client,
      description: maintenance.description || 'Maintenance planifiée'
    };
  });

  // Configuration des libellés pour la page Suivi des tâches
  const statsConfig = {
    titles: {
      total: 'Total des maintenances',
      planned: 'Tâches planifiées', 
      inProgress: 'Interventions en cours',
      completed: 'Tâches terminées'
    },
    subtitles: {
      total: 'Total',
      planned: 'À venir cette semaine',
      inProgress: 'En cours',
      completed: 'Terminées'
    }
  };

  const handleUpdateStatus = async (maintenanceId: string, newStatus: string) => {
    try {
      await updateMaintenanceStatus(maintenanceId, newStatus);
      
      // Mettre à jour le statut de la maintenance sélectionnée
      if (selectedMaintenance && selectedMaintenance.id === maintenanceId) {
        setSelectedMaintenance({
          ...selectedMaintenance,
          status: newStatus
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleEditMaintenance = (maintenanceId: string) => {
    const maintenance = maintenances.find(m => m.id === maintenanceId);
    if (maintenance) {
      setSelectedMaintenance(maintenance);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateMaintenance = async (id: string, updates: any) => {
    try {
      await updateMaintenance(id, updates);
      setIsEditModalOpen(false);
      setSelectedMaintenance(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  if (isLoading) {
    return (
      <AirbnbContainer>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600">Chargement des maintenances...</span>
          </div>
        </div>
      </AirbnbContainer>
    );
  }

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Suivi des tâches de maintenance"
        subtitle={`Gestion et suivi de ${maintenances.length} maintenance${maintenances.length > 1 ? 's' : ''} planifiée${maintenances.length > 1 ? 's' : ''}${filteredMaintenances.length !== maintenances.length ? ` (${filteredMaintenances.length} affichée${filteredMaintenances.length > 1 ? 's' : ''})` : ''}`}
        icon={Wrench}
      >
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className={`${refreshing ? 'animate-spin' : ''} hover:bg-blue-50 border-gray-200`}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
        
        <Button 
          onClick={() => setIsFormModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle maintenance
        </Button>
      </AirbnbHeader>

      <div className="space-y-6">
        {/* Statistiques des maintenances avec libellés harmonisés */}
        <MaintenanceStatsCard 
          maintenances={transformedMaintenances} 
          config={statsConfig}
        />

        {/* Section Maintenances avec style harmonisé */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-lg">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Tâches de maintenance</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <MaintenancePageFilters
              filterBy={filterBy}
              technicianFilter={technicianFilter}
              onFilterByChange={setFilterBy}
              onTechnicianFilterChange={setTechnicianFilter}
              onReset={handleResetFilters}
            />

            <MaintenanceList
              maintenances={transformedMaintenances}
              onMaintenanceClick={setSelectedMaintenance}
            />
          </div>
        </div>

        <div className="flex justify-center pt-6">
          <Button 
            onClick={() => setIsFormModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle maintenance
          </Button>
        </div>
      </div>

      <MaintenanceFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => {
          toast.success('Maintenance créée avec succès');
          setIsFormModalOpen(false);
          refetch();
        }}
      />

      {selectedMaintenance && (
        <MaintenanceDetails
          maintenance={selectedMaintenance}
          isOpen={!!selectedMaintenance}
          onClose={() => setSelectedMaintenance(null)}
          onEdit={() => handleEditMaintenance(selectedMaintenance.id)}
          onUpdateStatus={(status) => handleUpdateStatus(selectedMaintenance.id, status)}
        />
      )}

      <MaintenanceEditModal
        maintenance={selectedMaintenance}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMaintenance(null);
        }}
        onUpdate={handleUpdateMaintenance}
      />
    </AirbnbContainer>
  );
}
