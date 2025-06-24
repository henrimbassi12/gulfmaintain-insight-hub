
import React, { useState } from 'react';
import { Wrench, RefreshCw, Plus, Brain, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaintenanceFormModal } from '@/components/maintenance/MaintenanceFormModal';
import MaintenanceDetails from '@/components/maintenance/MaintenanceDetails';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';
import { useAIPredictions } from '@/hooks/useAIPredictions';

export default function Maintenance() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { getPrediction, isLoading: aiLoading } = useAIPredictions();

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

  const handleAIPrediction = async (equipment: any) => {
    const predictionInput = {
      equipment_id: equipment.id,
      equipment_type: 'Réfrigérateur',
      last_maintenance_date: '2024-05-15',
      failure_history: ['Maintenance préventive standard'],
      location: equipment.location,
      usage_intensity: 'high' as const,
      sensor_data: {
        temperature: 6.5,
        pressure: 2.1,
        vibration: 0.5,
        humidity: 70
      }
    };

    const prediction = await getPrediction(predictionInput);
    if (prediction) {
      toast.success(`Prédiction IA générée pour ${equipment.equipment}`, {
        description: `Statut prédit: ${prediction.predicted_status}`
      });
    }
  };

  // Données de maintenance d'exemple avec prédictions IA
  const maintenances = [
    {
      id: 'MAINT-001',
      equipment: 'TAG145 - Frigo Vestfrost',
      type: 'Préventive',
      status: 'En cours',
      technician: 'D. Ngangue',
      scheduledDate: '2024-06-24',
      priority: 'Haute',
      location: 'Douala',
      aiPrediction: {
        risk: 'Élevé',
        confidence: 87,
        recommendation: 'Maintenance renforcée recommandée'
      }
    },
    {
      id: 'MAINT-002',
      equipment: 'TAG211 - Frigo Haier',
      type: 'Corrective',
      status: 'Planifiée',
      technician: 'M. Diko',
      scheduledDate: '2024-06-25',
      priority: 'Normale',
      location: 'Yaoundé',
      aiPrediction: {
        risk: 'Moyen',
        confidence: 72,
        recommendation: 'Surveillance renforcée'
      }
    },
    {
      id: 'MAINT-003',
      equipment: 'TAG078 - Frigo Samsung',
      type: 'Préventive',
      status: 'En attente',
      technician: 'J. Tamo',
      scheduledDate: '2024-06-26',
      priority: 'Basse',
      location: 'Bafoussam',
      aiPrediction: {
        risk: 'Faible',
        confidence: 94,
        recommendation: 'Maintenance préventive standard'
      }
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Élevé': return 'bg-red-100 text-red-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
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
        {/* Prédictions IA Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              🤖 Analyse IA des Maintenances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-800">Risque Élevé</span>
                </div>
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-sm text-gray-600">Maintenance renforcée recommandée</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-yellow-800">Risque Moyen</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">1</p>
                <p className="text-sm text-gray-600">Surveillance renforcée</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-800">Risque Faible</span>
                </div>
                <p className="text-2xl font-bold text-green-600">1</p>
                <p className="text-sm text-gray-600">Maintenance standard</p>
              </div>
            </div>
          </CardContent>
        </Card>

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

                      {/* Prédiction IA */}
                      <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Prédiction IA</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {maintenance.aiPrediction.confidence}% confiance
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className={getRiskColor(maintenance.aiPrediction.risk)}>
                            Risque {maintenance.aiPrediction.risk}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAIPrediction(maintenance);
                            }}
                            disabled={aiLoading}
                            className="text-xs"
                          >
                            <Brain className="w-3 h-3 mr-1" />
                            Nouvelle prédiction
                          </Button>
                        </div>
                        <p className="text-xs text-purple-700 mt-2">
                          {maintenance.aiPrediction.recommendation}
                        </p>
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
