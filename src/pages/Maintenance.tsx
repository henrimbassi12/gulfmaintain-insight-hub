
import React, { useState } from 'react';
import { RefreshCw, Plus, Download } from 'lucide-react';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';
import { MaintenanceList } from '@/components/maintenance/MaintenanceList';
import { MaintenancePageFilters } from '@/components/maintenance/MaintenancePageFilters';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { Button } from '@/components/ui/button';
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

  const handleResetFilters = () => {
    setFilterBy('all');
    setTechnicianFilter('all');
  };

  const handleExportData = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Génération du fichier d\'export...',
        success: 'Fichier exporté avec succès',
        error: 'Erreur lors de l\'export'
      }
    );
  };

  // Données de maintenance étendues avec toutes les informations
  const maintenances = [
    {
      id: 'MAINT-001',
      equipment: 'TAG145 - Frigo Vestfrost INNOVA 1000',
      type: 'Maintenance préventive',
      status: 'En cours',
      technician: 'VOUKENG',
      scheduledDate: '2024-06-27',
      timeSlot: '13h30 - 15h00',
      priority: 'Haute',
      location: 'Douala Centre',
      client: 'Bar Le Central',
      description: 'Maintenance préventive mensuelle',
      // Informations détaillées
      division: 'Centre',
      secteur: 'Bars & Restaurants',
      partenaire: 'SABC Cameroun',
      ville: 'Douala',
      nom_client: 'MBARGA Jean',
      nom_pdv: 'Bar Le Central',
      tel_barman: '+237 677 123 456',
      serial_number: 'VF2024001',
      tag_number: 'TAG145',
      quartier: 'Bonanjo',
      localisation: 'Rue de la République, face pharmacie centrale',
      type_frigo: 'INNOVA 1000',
      af_nf: 'AF',
      branding: 'Coca-Cola',
      duree_estimee: '2 heures',
      date_programmee: '2024-06-27'
    },
    {
      id: 'MAINT-002',
      equipment: 'TAG211 - Frigo Haier SANDEN 500',
      type: 'Maintenance corrective',
      status: 'Prévu',
      technician: 'MBAPBOU Grégoire',
      scheduledDate: '2024-06-28',
      timeSlot: '09h00 - 11h00',
      priority: 'Urgent',
      location: 'Yaoundé Melen',
      client: 'Restaurant Chez Marie',
      description: 'Réparation compresseur défaillant',
      // Informations détaillées
      division: 'Centre',
      secteur: 'Restaurants',
      partenaire: 'SABC Cameroun',
      ville: 'Yaoundé',
      nom_client: 'ATANGANA Marie',
      nom_pdv: 'Restaurant Chez Marie',
      tel_barman: '+237 654 987 321',
      serial_number: 'HR2024015',
      tag_number: 'TAG211',
      quartier: 'Melen',
      localisation: 'Carrefour Melen, à côté de la station Total',
      type_frigo: 'SANDEN 500',
      af_nf: 'NF',
      branding: 'Pepsi',
      duree_estimee: '3 heures',
      date_programmee: '2024-06-28'
    },
    {
      id: 'MAINT-003',
      equipment: 'TAG078 - Frigo Samsung INNOVA 650',
      type: 'Surveillance Renforcée',
      status: 'Terminé',
      technician: 'TCHINDA Constant',
      scheduledDate: '2024-06-26',
      timeSlot: '14h00 - 16h00',
      priority: 'Normale',
      location: 'Bafoussam Centre',
      client: 'Bar du Marché',
      description: 'Surveillance suite à panne récurrente',
      // Informations détaillées
      division: 'Ouest',
      secteur: 'Bars',
      partenaire: 'SABC Cameroun',
      ville: 'Bafoussam',
      nom_client: 'KAMGA Paul',
      nom_pdv: 'Bar du Marché',
      tel_barman: '+237 698 456 789',
      serial_number: 'SM2024008',
      tag_number: 'TAG078',
      quartier: 'Centre Ville',
      localisation: 'Marché central, entrée principale',
      type_frigo: 'INNOVA 650',
      af_nf: 'AF',
      branding: 'Fanta',
      duree_estimee: '1 heure',
      date_programmee: '2024-06-26'
    },
    {
      id: 'MAINT-004',
      equipment: 'TAG152 - Frigo LG SUPER-35',
      type: 'Investigation Défaillance',
      status: 'Prévu',
      technician: 'Cédric',
      scheduledDate: '2024-06-29',
      timeSlot: '10h30 - 12h30',
      priority: 'Normale',
      location: 'Kribi Plage',
      client: 'Snack Bar Ocean',
      description: 'Investigation sur défaillance thermostat',
      // Informations détaillées
      division: 'Sud',
      secteur: 'Snacks',
      partenaire: 'SABC Cameroun',
      ville: 'Kribi',
      nom_client: 'MVONDO Pierre',
      nom_pdv: 'Snack Bar Ocean',
      tel_barman: '+237 677 789 123',
      serial_number: 'LG2024022',
      tag_number: 'TAG152',
      quartier: 'Plage',
      localisation: 'Boulevard de la plage, face hôtel Ilomba',
      type_frigo: 'SUPER-35',
      af_nf: 'NF',
      branding: 'Sprite',
      duree_estimee: '2 heures',
      date_programmee: '2024-06-29'
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
        subtitle={`Gestion et suivi de ${maintenances.length} intervention${maintenances.length > 1 ? 's' : ''}${filteredMaintenances.length !== maintenances.length ? ` (${filteredMaintenances.length} affichée${filteredMaintenances.length > 1 ? 's' : ''})` : ''}`}
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
          variant="outline" 
          onClick={handleExportData}
          className="hover:bg-green-50 border-gray-200"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter
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

        {/* Bouton supplémentaire en bas de page */}
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
