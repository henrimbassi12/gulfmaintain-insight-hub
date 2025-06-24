
import React, { useState } from 'react';
import { Wrench, RefreshCw, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MaintenanceFilters from '@/components/maintenance/MaintenanceFilters';
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

export default function Maintenance() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  // Données de maintenance d'exemple
  const maintenances = [
    {
      id: 'MAINT-001',
      equipment: 'TAG145 - Frigo Vestfrost',
      type: 'Préventive',
      status: 'En cours',
      technician: 'D. Ngangue',
      scheduledDate: '2024-06-24',
      priority: 'Haute',
      location: 'Douala'
    },
    {
      id: 'MAINT-002',
      equipment: 'TAG211 - Frigo Haier',
      type: 'Corrective',
      status: 'Planifiée',
      technician: 'M. Diko',
      scheduledDate: '2024-06-25',
      priority: 'Normale',
      location: 'Yaoundé'
    },
    {
      id: 'MAINT-003',
      equipment: 'TAG078 - Frigo Samsung',
      type: 'Préventive',
      status: 'En attente',
      technician: 'J. Tamo',
      scheduledDate: '2024-06-26',
      priority: 'Basse',
      location: 'Bafoussam'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Planifiée': return 'bg-yellow-100 text-yellow-800';
      case 'En attente': return 'bg-gray-100 text-gray-800';
      case 'Terminée': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Normale': return 'bg-blue-100 text-blue-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Maintenance"
        subtitle="Gestion et suivi des maintenances préventives et curatives"
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
        </div>
      </AirbnbHeader>

      <div className="space-y-6">
        <MaintenanceFilters />
        
        {/* Liste des maintenances */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              Maintenances en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {maintenances.map((maintenance) => (
                <div
                  key={maintenance.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedMaintenance(maintenance)}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{maintenance.equipment}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ID:</span> {maintenance.id}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {maintenance.type}
                        </div>
                        <div>
                          <span className="font-medium">Technicien:</span> {maintenance.technician}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(maintenance.scheduledDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(maintenance.status)}>
                        {maintenance.status}
                      </Badge>
                      <Badge className={getPriorityColor(maintenance.priority)}>
                        {maintenance.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <MaintenanceFormModal
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
        />
      )}
    </AirbnbContainer>
  );
}
