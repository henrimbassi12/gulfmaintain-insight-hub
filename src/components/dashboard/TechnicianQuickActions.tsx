
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ListChecks, Wrench, BookOpen, MapPin } from "lucide-react";

const TechnicianQuickActions: React.FC = () => {
  const { toast } = useToast();

  const actions = [
    {
      icon: ListChecks,
      label: 'Mes interventions',
      description: 'Voir les tâches assignées',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => toast({ title: "✅ Tâches", description: "Affichage de vos interventions..." })
    },
    {
      icon: Wrench,
      label: 'Déclarer une panne',
      description: 'Signaler un nouvel incident',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => toast({ title: "✅ Panne déclarée", description: "Le formulaire de déclaration est ouvert..." })
    },
    {
      icon: BookOpen,
      label: 'Base de connaissances',
      description: 'Consulter les manuels',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => toast({ title: "✅ Documentation", description: "Ouverture de la base de connaissances..." })
    },
    {
      icon: MapPin,
      label: 'Mon itinéraire',
      description: 'Optimiser ma tournée du jour',
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => toast({ title: "✅ Itinéraire", description: "Calcul de l'itinéraire optimal..." })
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <Button
            key={index}
            variant="outline"
            className={`h-auto p-4 flex flex-col items-center justify-center gap-2 text-white border-0 ${action.color} hover:scale-105 transition-all duration-200`}
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
  );
};

export default TechnicianQuickActions;
