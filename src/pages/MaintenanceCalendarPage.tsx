
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

export default function MaintenanceCalendarPage() {
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation du planning...',
        success: 'Planning actualisé avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
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
              Cette semaine
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-blue-600 mb-1">12</p>
              <p className="text-sm text-gray-600">Tâches programmées</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-green-600 mb-1">8</p>
              <p className="text-sm text-gray-600">Tâches terminées</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-orange-600 mb-1">3</p>
              <p className="text-sm text-gray-600">En cours</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-red-600 mb-1">1</p>
              <p className="text-sm text-gray-600">Retards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets Maintenance / Planning */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-3 sm:p-6">
          <Tabs defaultValue="planning" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                Tâches en cours
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Vue Planning
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Interventions en cours</h3>
                <div className="space-y-2">
                  {[
                    { id: 'TAG145', type: 'Préventive', technicien: 'D. Ngangue', status: 'En cours', priority: 'Haute' },
                    { id: 'TAG211', type: 'Corrective', technicien: 'M. Diko', status: 'Planifiée', priority: 'Normale' },
                    { id: 'TAG078', type: 'Préventive', technicien: 'J. Tamo', status: 'En attente', priority: 'Basse' }
                  ].map((task, i) => (
                    <div key={i} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{task.id}</h4>
                          <p className="text-sm text-gray-600">{task.type} • {task.technicien}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={task.priority === 'Haute' ? 'destructive' : task.priority === 'Normale' ? 'default' : 'secondary'}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
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
        }}
      />
    </AirbnbContainer>
  );
}
