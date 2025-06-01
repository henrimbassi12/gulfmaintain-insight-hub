
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Clock,
  User,
  Wrench,
  Plus,
  MapPin,
  Brain
} from 'lucide-react';
import MaintenanceFilters from '@/components/maintenance/MaintenanceFilters';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';

export default function Maintenance() {
  const [view, setView] = useState('calendar');
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    technician: 'all',
    status: 'all',
    agency: 'all',
    equipment: 'all',
    search: ''
  });

  const maintenances = [
    {
      id: 'INT-2024-156',
      title: 'Maintenance préventive - FR-2024-089',
      equipment: 'FR-2024-089',
      technician: 'Ahmed Benali',
      type: 'Préventive',
      priority: 'medium',
      status: 'completed',
      date: '2024-01-28',
      time: '09:00',
      duration: '2h 30min',
      location: 'Agence Casablanca Nord'
    },
    {
      id: 'INT-2024-157',
      title: 'Réparation urgente - FR-2024-012',
      equipment: 'FR-2024-012',
      technician: 'Fatima Zahra',
      type: 'Correctif',
      priority: 'high',
      status: 'in-progress',
      date: '2024-01-29',
      time: '14:00',
      duration: '1h 15min',
      location: 'Agence Rabat Centre'
    },
    {
      id: 'INT-2024-158',
      title: 'Inspection routine - FR-2024-134',
      equipment: 'FR-2024-134',
      technician: 'Mohamed Alami',
      type: 'Inspection',
      priority: 'low',
      status: 'planned',
      date: '2024-01-30',
      time: '10:30',
      duration: '45min',
      location: 'Agence Marrakech Sud'
    },
    {
      id: 'INT-2024-159',
      title: 'Remplacement compresseur - FR-2024-045',
      equipment: 'FR-2024-045',
      technician: 'Youssef Idrissi',
      type: 'Correctif',
      priority: 'high',
      status: 'planned',
      date: '2024-01-30',
      time: '08:00',
      duration: '4h 00min',
      location: 'Agence Tanger Port'
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      technician: 'all',
      status: 'all',
      agency: 'all',
      equipment: 'all',
      search: ''
    });
  };

  const handleMaintenanceClick = (maintenance: any) => {
    setSelectedMaintenance(maintenance);
    setIsDetailsOpen(true);
  };

  const handleEditMaintenance = () => {
    setIsDetailsOpen(false);
    setIsFormOpen(true);
  };

  const handleUpdateStatus = (status: string) => {
    console.log('Updating status to:', status);
    // Implement status update logic
  };

  const handleSaveMaintenance = (data: any) => {
    console.log('Saving maintenance:', data);
    // Implement save logic
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'planned': return 'Planifié';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🟢';
      case 'planned': return '📅';
      case 'cancelled': return '❌';
      default: return '📝';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance</h1>
          <p className="text-gray-600">Planification et suivi des interventions</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setSelectedMaintenance(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle intervention
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {maintenances.filter(m => m.status === 'planned').length}
            </div>
            <div className="text-sm text-gray-600">Planifiées</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {maintenances.filter(m => m.status === 'in-progress').length}
              <span className="text-sm">🟢</span>
            </div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {maintenances.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Terminées</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">
              {maintenances.filter(m => m.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-600">Urgentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <MaintenanceFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content */}
      <Tabs value={view} onValueChange={setView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="calendar">Vue Calendrier</TabsTrigger>
          <TabsTrigger value="list">Vue Liste</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Janvier 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Calendar header */}
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const dayMaintenances = maintenances.filter(m => 
                    new Date(m.date).getDate() === day
                  );
                  
                  return (
                    <div key={day} className="min-h-[100px] p-1 border border-gray-200 rounded hover:bg-gray-50">
                      <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayMaintenances.map(maintenance => {
                          const aiRisk = maintenance.equipment === 'FR-2024-012' || maintenance.equipment === 'FR-2024-045';
                          return (
                            <div 
                              key={maintenance.id} 
                              className={`text-xs p-1 rounded cursor-pointer ${getStatusColor(maintenance.status)} hover:opacity-80`}
                              onClick={() => handleMaintenanceClick(maintenance)}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(maintenance.status)}
                                {aiRisk && <Brain className="w-3 h-3" />}
                                {maintenance.time}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {maintenances.map((maintenance) => {
              const aiRisk = maintenance.equipment === 'FR-2024-012' || maintenance.equipment === 'FR-2024-045';
              return (
                <Card 
                  key={maintenance.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMaintenanceClick(maintenance)}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          {maintenance.title}
                          {aiRisk && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <Brain className="w-3 h-3 mr-1" />
                              IA
                            </Badge>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {maintenance.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {maintenance.time} ({maintenance.duration})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {maintenance.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(maintenance.priority)}>
                          {maintenance.priority === 'high' ? 'Critique' :
                           maintenance.priority === 'medium' ? 'Moyenne' : 'Faible'}
                        </Badge>
                        <Badge className={getStatusColor(maintenance.status)}>
                          {getStatusIcon(maintenance.status)} {getStatusText(maintenance.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">ID Intervention:</span>
                        <div className="font-mono text-sm text-blue-600">{maintenance.id}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Équipement:</span>
                        <div className="font-medium">{maintenance.equipment}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Technicien:</span>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {maintenance.technician}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{maintenance.type}</span>
                      </div>
                      <div className="flex gap-2">
                        {maintenance.status === 'planned' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            🟢 Démarrer
                          </Button>
                        )}
                        {maintenance.status === 'in-progress' && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            🟢 En cours...
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <MaintenanceForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        maintenance={selectedMaintenance}
        onSave={handleSaveMaintenance}
      />

      <MaintenanceDetails 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        maintenance={selectedMaintenance}
        onEdit={handleEditMaintenance}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
