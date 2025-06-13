
import React from 'react';
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

const QuickActions: React.FC = () => {
  const { toast } = useToast();

  const handleNewIntervention = () => {
    toast({
      title: "✅ Action exécutée",
      description: "Redirection vers le formulaire de nouvelle intervention...",
    });
    // Simuler une action réelle
    setTimeout(() => {
      toast({
        title: "Intervention créée",
        description: "Nouvelle intervention INT-2024-159 ajoutée au système",
      });
    }, 1500);
  };

  const handleScheduleMaintenance = () => {
    toast({
      title: "✅ Action exécutée", 
      description: "Ouverture du calendrier de planification...",
    });
    setTimeout(() => {
      toast({
        title: "Maintenance planifiée",
        description: "Maintenance préventive programmée pour demain",
      });
    }, 1500);
  };

  const handleAssignTechnician = () => {
    toast({
      title: "✅ Action exécutée",
      description: "Ouverture de l'assignation des techniciens...",
    });
    setTimeout(() => {
      toast({
        title: "Technicien assigné",
        description: "Mohamed Alami assigné à l'intervention urgente",
      });
    }, 1500);
  };

  const handleGenerateReport = () => {
    toast({
      title: "✅ Export démarré",
      description: "Génération du rapport de performance...",
    });
    setTimeout(() => {
      toast({
        title: "Rapport généré",
        description: "Rapport mensuel téléchargé avec succès",
      });
    }, 2500);
  };

  const handleCreateAlert = () => {
    toast({
      title: "✅ Alerte créée",
      description: "Nouvelle alerte ajoutée au système de surveillance",
    });
    setTimeout(() => {
      toast({
        title: "Notification envoyée",
        description: "Équipe technique notifiée de l'alerte critique",
      });
    }, 1000);
  };

  const handleOptimizeRoutes = () => {
    toast({
      title: "✅ Optimisation lancée",
      description: "Calcul des itinéraires optimaux...",
    });
    setTimeout(() => {
      toast({
        title: "Itinéraires optimisés",
        description: "Économie de 23% sur les déplacements identifiée",
      });
    }, 3000);
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
      action: handleNewIntervention
    },
    {
      icon: Calendar,
      label: 'Planifier maintenance',
      description: 'Programmer une maintenance préventive',
      color: 'bg-green-600 hover:bg-green-700',
      action: handleScheduleMaintenance
    },
    {
      icon: Users,
      label: 'Assigner technicien',
      description: 'Affecter un technicien disponible',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: handleAssignTechnician
    },
    {
      icon: FileText,
      label: 'Générer rapport',
      description: 'Créer un rapport de performance',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: handleGenerateReport
    },
    {
      icon: AlertTriangle,
      label: 'Créer alerte',
      description: 'Déclencher une alerte système',
      color: 'bg-red-600 hover:bg-red-700',
      action: handleCreateAlert
    },
    {
      icon: MapPin,
      label: 'Optimiser tournées',
      description: 'Recalculer les itinéraires',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: handleOptimizeRoutes
    }
  ];

  return (
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
  );
};

export default QuickActions;
