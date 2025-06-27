
import React, { useState } from 'react';
import { Wrench, RefreshCw, Plus, Filter, Clock, User, MapPin, FileText, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Prévu': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Terminé': return 'bg-green-100 text-green-800 border-green-200';
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500 text-white';
      case 'Haute': return 'bg-orange-500 text-white';
      case 'Normale': return 'bg-blue-500 text-white';
      case 'Basse': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

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
        {/* Filtres */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Filter className="w-5 h-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Statut</label>
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Prévu">Prévu</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Technicien</label>
                <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les techniciens</SelectItem>
                    <SelectItem value="VOUKENG">VOUKENG</SelectItem>
                    <SelectItem value="MBAPBOU Grégoire">MBAPBOU Grégoire</SelectItem>
                    <SelectItem value="TCHINDA Constant">TCHINDA Constant</SelectItem>
                    <SelectItem value="Cédric">Cédric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterBy('all');
                    setTechnicianFilter('all');
                  }}
                  className="w-full"
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des maintenances */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                Maintenances ({filteredMaintenances.length})
              </div>
              <Badge variant="outline" className="text-xs">
                {filteredMaintenances.filter(m => m.status === 'En cours').length} en cours
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredMaintenances.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune maintenance trouvée avec ces filtres</p>
                </div>
              ) : (
                filteredMaintenances.map((maintenance) => (
                  <div
                    key={maintenance.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedMaintenance(maintenance)}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {maintenance.equipment}
                            </h3>
                            <p className="text-sm text-gray-600">{maintenance.client}</p>
                          </div>
                          <Badge className={getPriorityColor(maintenance.priority)}>
                            {maintenance.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">ID:</span> {maintenance.id}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="font-medium">Horaire:</span> {maintenance.timeSlot}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">Technicien:</span> {maintenance.technician}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="font-medium">Lieu:</span> {maintenance.location}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {maintenance.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(maintenance.scheduledDate).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <Badge className={getStatusColor(maintenance.status)}>
                            {maintenance.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {maintenance.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
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
