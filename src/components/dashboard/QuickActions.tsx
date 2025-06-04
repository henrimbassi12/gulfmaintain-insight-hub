
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

  const quickActions = [
    {
      icon: Plus,
      label: 'Nouvelle intervention',
      description: 'Créer une intervention d\'urgence',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => toast({ title: "Navigation", description: "Ouverture du formulaire d'intervention..." })
    },
    {
      icon: Calendar,
      label: 'Planifier maintenance',
      description: 'Programmer une maintenance préventive',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => toast({ title: "Navigation", description: "Ouverture du calendrier de planification..." })
    },
    {
      icon: Users,
      label: 'Assigner technicien',
      description: 'Affecter un technicien disponible',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => toast({ title: "Navigation", description: "Ouverture de l'assignation des techniciens..." })
    },
    {
      icon: FileText,
      label: 'Générer rapport',
      description: 'Créer un rapport de performance',
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => toast({ title: "Export", description: "Génération du rapport en cours..." })
    },
    {
      icon: AlertTriangle,
      label: 'Créer alerte',
      description: 'Déclencher une alerte système',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => toast({ title: "Alerte", description: "Nouvelle alerte créée dans le système." })
    },
    {
      icon: MapPin,
      label: 'Optimiser tournées',
      description: 'Recalculer les itinéraires',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => toast({ title: "Optimisation", description: "Calcul des itinéraires optimaux en cours..." })
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
                className={`h-auto p-4 flex flex-col items-center gap-2 text-white border-0 ${action.color}`}
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
              onClick={() => toast({ title: "Export", description: "Téléchargement du rapport mensuel..." })}
            >
              <Download className="w-4 h-4 mr-2" />
              Export mensuel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast({ title: "Navigation", description: "Ouverture des paramètres avancés..." })}
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
