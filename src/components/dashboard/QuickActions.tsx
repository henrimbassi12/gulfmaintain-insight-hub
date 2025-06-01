
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, UserCheck, Calendar, FileText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Créer une intervention",
      description: "Nouvelle intervention de maintenance",
      icon: Plus,
      action: () => navigate("/maintenance"),
      color: "bg-blue-500 hover:bg-blue-600",
      primary: true
    },
    {
      title: "Liste complète",
      description: "Voir toutes les interventions",
      icon: List,
      action: () => navigate("/maintenance"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Attribuer technicien",
      description: "Affecter à un technicien",
      icon: UserCheck,
      action: () => navigate("/maintenance"),
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Planifier maintenance",
      description: "Programmer maintenance préventive",
      icon: Calendar,
      action: () => navigate("/maintenance"),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Générer rapport",
      description: "Créer un rapport d'activité",
      icon: FileText,
      action: () => navigate("/reports"),
      color: "bg-indigo-500 hover:bg-indigo-600"
    },
    {
      title: "Supervision IA",
      description: "Voir les prédictions IA",
      icon: Settings,
      action: () => navigate("/supervision"),
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
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                action.primary ? action.color : 'hover:bg-gray-50'
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
