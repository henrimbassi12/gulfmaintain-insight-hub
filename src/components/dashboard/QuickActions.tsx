
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, UserCheck, Calendar, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAction = (actionName: string, path?: string) => {
    if (path) {
      navigate(path);
    }
    toast({
      title: "Action exécutée",
      description: `${actionName} - Navigation en cours...`,
    });
  };

  const actions = [
    {
      title: "Créer une intervention",
      description: "Nouvelle intervention de maintenance",
      icon: Plus,
      action: () => handleAction("Création d'intervention", "/maintenance"),
      color: "bg-blue-500 hover:bg-blue-600",
      primary: true
    },
    {
      title: "Liste complète",
      description: "Voir toutes les interventions",
      icon: List,
      action: () => handleAction("Liste des interventions", "/maintenance"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Attribuer technicien",
      description: "Affecter à un technicien",
      icon: UserCheck,
      action: () => handleAction("Attribution technicien", "/maintenance"),
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Planifier maintenance",
      description: "Programmer maintenance préventive",
      icon: Calendar,
      action: () => handleAction("Planification maintenance", "/maintenance"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Générer rapport",
      description: "Créer un rapport d'activité",
      icon: FileText,
      action: () => handleAction("Génération de rapport", "/reports"),
      color: "bg-indigo-500 hover:bg-indigo-600"
    },
    {
      title: "Supervision IA",
      description: "Voir les prédictions IA",
      icon: Settings,
      action: () => handleAction("Supervision IA", "/supervision"),
      color: "bg-teal-500 hover:bg-teal-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Accès direct aux fonctions principales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.primary ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 ${
                action.primary ? action.color : 'hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={action.action}
            >
              <action.icon className={`w-5 h-5 ${action.primary ? 'text-white' : 'text-gray-600'}`} />
              <div className="text-center">
                <div className={`font-medium text-sm ${action.primary ? 'text-white' : 'text-gray-900'}`}>
                  {action.title}
                </div>
                <div className={`text-xs ${action.primary ? 'text-blue-100' : 'text-gray-500'}`}>
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
