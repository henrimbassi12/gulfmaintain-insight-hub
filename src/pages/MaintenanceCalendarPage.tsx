
import React, { useState } from 'react';
import { MaintenanceCalendar } from '@/components/MaintenanceCalendar';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, RefreshCw, Activity, Plus, List } from 'lucide-react';
import { CreateInterventionModal } from '@/components/dashboard/CreateInterventionModal';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { usePlannedMaintenances } from '@/hooks/usePlannedMaintenances';

export default function MaintenanceCalendarPage() {
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { maintenances, isLoading, refetch } = usePlannedMaintenances();

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      refetch(),
      {
        loading: 'Actualisation du planning...',
        success: 'Planning actualisé avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  // Transformation des données pour l'affichage
  const transformedMaintenances = maintenances.map(maintenance => ({
    id: maintenance.id,
    type: maintenance.type_maintenance,
    technicien: maintenance.technician_assigne,
    status: 'Planifiée',
    priority: maintenance.priorite,
    equipment: `${maintenance.type_frigo} - ${maintenance.serial_number}`,
    location: `${maintenance.ville} - ${maintenance.quartier}`,
    scheduledDate: maintenance.date_programmee
  }));

  const stats = {
    total: transformedMaintenances.length,
    completed: transformedMaintenances.filter(m => m.status === 'Terminée').length,
    inProgress: transformedMaintenances.filter(m => m.status === 'En cours').length,
    delays: transformedMaintenances.filter(m => m.priority === 'high').length
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Maintenance & Planning"
        subtitle="Gestion des tâches et planification"
        icon={Calendar}
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
            onClick={() => setIsInterventionModalOpen(true)}
            icon={Plus}
          >
            Nouvelle Tâche
          </ModernButton>
        </div>
      </AirbnbHeader>

      {/* Statistiques du planning */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Vue d'ensemble
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              Temps réel
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</p>
              <p className="text-sm text-gray-600">Tâches programmées</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</p>
              <p className="text-sm text-gray-600">Tâches terminées</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
              <p className="text-2xl font-bold text-orange-600 mb-1">{stats.inProgress}</p>
              <p className="text-sm text-gray-600">En cours</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-2xl font-bold text-red-600 mb-1">{stats.delays}</p>
              <p className="text-sm text-gray-600">Priorité haute</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets Maintenance / Planning */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-3 sm:p-6">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Tâches planifiées
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Vue Planning
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Tâches planifiées ({transformedMaintenances.length})
                </h3>
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : transformedMaintenances.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucune tâche planifiée pour le moment</p>
                    </div>
                  ) : (
                    transformedMaintenances.map((task) => (
                      <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{task.equipment}</h4>
                            <p className="text-sm text-gray-600">{task.type} • {task.technicien}</p>
                            <p className="text-xs text-gray-500">{task.location}</p>
                            <p className="text-xs text-gray-500">
                              Programmé le: {new Date(task.scheduledDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                              {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Normale' : 'Basse'}
                            </Badge>
                            <Badge variant="outline">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="planning" className="space-y-4">
              <div className="w-full overflow-hidden">
                <MaintenanceCalendar />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateInterventionModal
        isOpen={isInterventionModalOpen}
        onClose={() => setIsInterventionModalOpen(false)}
        onSuccess={() => {
          toast.success('Tâche ajoutée au planning');
          refetch(); // Actualiser les données après ajout
        }}
      />
    </AirbnbContainer>
  );
}
