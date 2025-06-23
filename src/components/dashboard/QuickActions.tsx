
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus, Wrench, Calendar, FileText, Users, Zap, AlertTriangle, MapPin } from "lucide-react";
import { CreateInterventionModal } from './CreateInterventionModal';
import { MaintenanceScheduleModal } from './MaintenanceScheduleModal';
import { CreateAlertModal } from './CreateAlertModal';
import { QuickActionsModal } from './QuickActionsModal';

const QuickActions: React.FC = () => {
  const { toast } = useToast();
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);

  const quickActions = [
    {
      id: 'new-intervention',
      title: 'Nouvelle intervention',
      description: 'Créer une intervention',
      icon: Plus,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      action: () => setShowInterventionModal(true)
    },
    {
      id: 'schedule-maintenance',
      title: 'Programmer maintenance',
      description: 'Planifier une maintenance',
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      action: () => setShowMaintenanceModal(true)
    },
    {
      id: 'create-alert',
      title: 'Créer alerte',
      description: 'Nouvelle alerte urgente',
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      action: () => setShowAlertModal(true)
    },
    {
      id: 'assign-technician',
      title: 'Assigner technicien',
      description: 'Affecter un technicien',
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      action: () => {
        toast({
          title: "Assignation technicien",
          description: "Fonctionnalité d'assignation ouverte",
        });
      }
    }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Actions rapides
          </CardTitle>
          <CardDescription>Raccourcis pour les tâches fréquentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${action.bgColor} hover:${action.bgColor}/50 border-gray-200`}
                  onClick={action.action}
                >
                  <IconComponent className={`w-6 h-6 ${action.color}`} />
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowQuickActionsModal(true)}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Toutes les actions
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreateInterventionModal
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        onSuccess={() => {
          toast({
            title: "✅ Intervention créée",
            description: "L'intervention a été ajoutée avec succès",
          });
        }}
      />

      <MaintenanceScheduleModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
      />

      <CreateAlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
      />

      <QuickActionsModal
        isOpen={showQuickActionsModal}
        onClose={() => setShowQuickActionsModal(false)}
      />
    </>
  );
};

export default QuickActions;
