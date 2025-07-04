
import React, { useState } from 'react';
import { MaintenanceCalendar } from '@/components/MaintenanceCalendar';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, RefreshCw, Activity, Plus, List, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { CreateInterventionModal } from '@/components/dashboard/CreateInterventionModal';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { usePlannedMaintenances } from '@/hooks/usePlannedMaintenances';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';
import { MaintenanceEditModal } from '@/components/maintenance/MaintenanceEditModal';

export default function MaintenanceCalendarPage() {
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { maintenances, isLoading, refetch, updateMaintenance, updateMaintenanceStatus } = usePlannedMaintenances();

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
  const transformedMaintenances = maintenances.map(maintenance => {
    // Déterminer le statut basé sur la description
    let status = 'Planifiée';
    if (maintenance.description?.includes('En cours')) {
      status = 'En cours';
    } else if (maintenance.description?.includes('Terminé')) {
      status = 'Terminée';
    }
    
    return {
      id: maintenance.id,
      type: maintenance.type_maintenance,
      technicien: maintenance.technician_assigne,
      status: status,
      priority: maintenance.priorite,
      equipment: `${maintenance.type_frigo} - ${maintenance.serial_number}`,
      location: `${maintenance.ville} - ${maintenance.quartier}`,
      scheduledDate: maintenance.date_programmee,
      client: maintenance.nom_client,
      description: maintenance.description || 'Maintenance planifiée',
      // Ajouter les champs originaux pour les modales
      ...maintenance
    };
  });

  // Statistiques avec libellés pour la page Calendrier - mise à jour en temps réel
  const stats = {
    total: transformedMaintenances.length,
    completed: transformedMaintenances.filter(m => m.status === 'Terminée').length,
    inProgress: transformedMaintenances.filter(m => m.status === 'En cours').length,
    delays: transformedMaintenances.filter(m => m.priority === 'high').length
  };

  // Fonctions de gestion des maintenances
  const handleViewMaintenance = (maintenance: any) => {
    const transformedMaintenance = {
      ...maintenance,
      equipment: `${maintenance.type_frigo} - ${maintenance.serial_number}`,
      type: maintenance.type_maintenance,
      technician: maintenance.technician_assigne,
      scheduledDate: maintenance.date_programmee,
      timeSlot: maintenance.duree_estimee,
      priority: maintenance.priorite,
      location: `${maintenance.ville} - ${maintenance.quartier}`,
      client: maintenance.nom_client,
      description: maintenance.description || 'Maintenance planifiée',
      status: maintenance.description?.includes('En cours') ? 'in-progress' : 
              maintenance.description?.includes('Terminé') ? 'completed' : 'planned'
    };
    setSelectedMaintenance(transformedMaintenance);
  };

  const handleEditMaintenance = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setIsEditModalOpen(true);
  };

  const handleCompleteMaintenance = async (maintenanceId: string) => {
    try {
      await updateMaintenanceStatus(maintenanceId, 'completed');
      toast.success('✅ Tâche marquée comme terminée');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleSendReminder = (maintenance: any) => {
    toast.info(`📩 Rappel envoyé pour: ${maintenance.equipment}`, {
      description: `Technicien: ${maintenance.technicien}`
    });
  };

  const handleMarkAsNotDone = async (maintenanceId: string) => {
    try {
      await updateMaintenanceStatus(maintenanceId, 'not-done');
      toast.warning('⚠️ Tâche marquée comme non effectuée');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleUpdateMaintenance = async (id: string, updates: any) => {
    try {
      console.log('🔄 Mise à jour maintenance avec:', updates);
      const updatedMaintenance = await updateMaintenance(id, updates);
      console.log('✅ Maintenance mise à jour:', updatedMaintenance);
      
      // Mettre à jour la maintenance sélectionnée avec TOUS les champs
      if (selectedMaintenance && selectedMaintenance.id === id) {
        const transformedUpdated = {
          // Garder tous les champs originaux de la base de données
          ...selectedMaintenance,
          ...updatedMaintenance,
          // Ajouter les champs transformés pour la compatibilité d'affichage
          equipment: `${updatedMaintenance.type_frigo} - ${updatedMaintenance.serial_number}`,
          type: updatedMaintenance.type_maintenance,
          status: updatedMaintenance.description?.includes('En cours') ? 'in-progress' : 
                  updatedMaintenance.description?.includes('Terminé') ? 'completed' : 'planned',
          technician: updatedMaintenance.technician_assigne,
          scheduledDate: updatedMaintenance.date_programmee,
          timeSlot: updatedMaintenance.duree_estimee,
          priority: updatedMaintenance.priorite,
          location: `${updatedMaintenance.ville} - ${updatedMaintenance.quartier}`,
          client: updatedMaintenance.nom_client,
          description: updatedMaintenance.description || 'Maintenance planifiée'
        };
        setSelectedMaintenance(transformedUpdated);
        console.log('🔄 Maintenance sélectionnée mise à jour:', transformedUpdated);
      }
      
      setIsEditModalOpen(false);
      refetch(); // Actualiser la liste
      toast.success('Maintenance mise à jour avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la maintenance');
    }
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Calendrier des maintenances"
        subtitle="Planification et gestion des maintenances"
        icon={Calendar}
      >
        <div className="flex flex-col gap-2 w-full">
          <ModernButton 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
            icon={RefreshCw}
            className=""
            iconClassName={refreshing ? 'animate-spin' : ''}
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

      {/* Statistiques du planning avec libellés harmonisés */}
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
              <p className="text-sm text-gray-600">Actuellement en cours</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-2xl font-bold text-red-600 mb-1">{stats.delays}</p>
              <p className="text-sm text-gray-600">Priorité haute</p>
              <p className="text-xs text-red-500 mt-1">Urgences à exécuter rapidement</p>
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Tâches planifiées ({transformedMaintenances.length})
                  </h3>
                  <p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    À venir cette semaine
                  </p>
                </div>
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
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800 cursor-pointer hover:text-blue-600" 
                                onClick={() => handleViewMaintenance(task)}>
                              {task.equipment}
                            </h4>
                            <p className="text-sm text-gray-600">{task.type} • {task.technicien}</p>
                            <p className="text-xs text-gray-500">{task.location}</p>
                            <p className="text-xs text-gray-500">
                              Programmé le: {new Date(task.scheduledDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex gap-2">
                              <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                                {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Normale' : 'Basse'}
                              </Badge>
                              <Badge variant={task.status === 'Terminée' ? 'default' : task.status === 'En cours' ? 'secondary' : 'outline'} 
                                     className={task.status === 'Terminée' ? 'bg-green-100 text-green-800' : ''}>
                                {task.status === 'Terminée' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {task.status}
                              </Badge>
                            </div>
                            
                            {/* Actions basées sur le statut */}
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewMaintenance(task)}
                                className="text-xs"
                              >
                                Voir
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditMaintenance(task)}
                                className="text-xs"
                              >
                                Modifier
                              </Button>
                              
                              {task.status === 'Planifiée' && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleCompleteMaintenance(task.id)}
                                    className="text-xs bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Terminer
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSendReminder(task)}
                                    className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                                  >
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Rappel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMarkAsNotDone(task.id)}
                                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <Clock className="w-3 h-3 mr-1" />
                                    Non fait
                                  </Button>
                                </>
                              )}
                              
                              {task.status === 'En cours' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteMaintenance(task.id)}
                                  className="text-xs bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Terminer
                                </Button>
                              )}
                            </div>
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

      {/* Modale de détails de maintenance */}
      {selectedMaintenance && !isEditModalOpen && (
        <MaintenanceDetails
          maintenance={selectedMaintenance}
          isOpen={!!selectedMaintenance}
          onClose={() => setSelectedMaintenance(null)}
          onEdit={() => {
            setIsEditModalOpen(true);
          }}
          onUpdateStatus={async (status) => {
            try {
              await updateMaintenanceStatus(selectedMaintenance.id, status);
              // Mettre à jour le statut local
              setSelectedMaintenance({
                ...selectedMaintenance,
                status: status === 'completed' ? 'completed' : 
                        status === 'in-progress' ? 'in-progress' : 'planned'
              });
              refetch();
            } catch (error) {
              console.error('Erreur lors de la mise à jour du statut:', error);
            }
          }}
        />
      )}

      {/* Modale d'édition de maintenance */}
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
