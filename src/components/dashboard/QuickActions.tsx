
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  Download,
  AlertTriangle,
  MapPin
} from "lucide-react";
import { CreateInterventionModal } from './CreateInterventionModal';
import { MaintenanceScheduleModal } from './MaintenanceScheduleModal';
import { TechnicianAssignmentModal } from './TechnicianAssignmentModal';
import { ReportGeneratorModal } from './ReportGeneratorModal';
import { CreateAlertModal } from './CreateAlertModal';
import { RouteOptimizationModal } from './RouteOptimizationModal';

const QuickActions: React.FC = () => {
  const { toast } = useToast();
  const [modals, setModals] = useState({
    intervention: false,
    maintenance: false,
    technician: false,
    report: false,
    alert: false,
    routes: false
  });

  const openModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  const handleMonthlyExport = () => {
    toast({
      title: "✅ Export mensuel",
      description: "Préparation du rapport mensuel...",
    });
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Rapport mensuel téléchargé avec succès",
      });
    }, 2000);
  };

  const handleAdvancedSettings = () => {
    toast({
      title: "✅ Paramètres",
      description: "Ouverture des paramètres avancés du système...",
    });
  };

  const quickActions = [
    {
      icon: Plus,
      label: 'Nouvelle intervention',
      description: 'Créer une intervention d\'urgence',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => openModal('intervention')
    },
    {
      icon: Calendar,
      label: 'Planifier maintenance',
      description: 'Programmer une maintenance préventive',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => openModal('maintenance')
    },
    {
      icon: Users,
      label: 'Assigner technicien',
      description: 'Affecter un technicien disponible',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => openModal('technician')
    },
    {
      icon: FileText,
      label: 'Générer rapport',
      description: 'Créer un rapport de performance',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => openModal('report')
    },
    {
      icon: AlertTriangle,
      label: 'Créer alerte',
      description: 'Déclencher une alerte système',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => openModal('alert')
    },
    {
      icon: MapPin,
      label: 'Optimiser tournées',
      description: 'Recalculer les itinéraires',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => openModal('routes')
    }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            Actions rapides
          </CardTitle>
          <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 text-white border-0 ${action.color} hover:scale-105 transition-all duration-200`}
                  onClick={action.action}
                >
                  <IconComponent className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          {/* Actions secondaires */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-3 text-gray-700">Exports et outils</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMonthlyExport}
                className="hover:bg-blue-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export mensuel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAdvancedSettings}
                className="hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modales */}
      <CreateInterventionModal
        isOpen={modals.intervention}
        onClose={() => closeModal('intervention')}
      />
      
      <MaintenanceScheduleModal
        isOpen={modals.maintenance}
        onClose={() => closeModal('maintenance')}
      />
      
      <TechnicianAssignmentModal
        isOpen={modals.technician}
        onClose={() => closeModal('technician')}
      />
      
      <ReportGeneratorModal
        isOpen={modals.report}
        onClose={() => closeModal('report')}
      />
      
      <CreateAlertModal
        isOpen={modals.alert}
        onClose={() => closeModal('alert')}
      />
      
      <RouteOptimizationModal
        isOpen={modals.routes}
        onClose={() => closeModal('routes')}
      />
    </>
  );
};

export default QuickActions;
