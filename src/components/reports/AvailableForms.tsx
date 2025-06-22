
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Wrench, Move, Settings, Truck } from "lucide-react";

export interface ReportForm {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface AvailableFormsProps {
  reportForms: ReportForm[];
  onCreateForm: (formId: string) => void;
}

const MAINTENANCE_FORMS = [
  {
    id: 'tracking',
    title: 'Fiche de Suivi et de Maintenance du Réfrigérateur Guinness',
    description: 'Suivi détaillé et historique de la maintenance par réfrigérateur.',
    icon: FileText
  },
  { 
    id: 'maintenance', 
    title: 'Fiche d\'Entretien des Frigos', 
    description: 'Formulaire pour l\'entretien périodique des réfrigérateurs.', 
    icon: Wrench
  },
  { 
    id: 'movement', 
    title: 'Fiche de Suivi de Mouvement des Frigos', 
    description: 'Enregistrement des déplacements et transferts de frigos.', 
    icon: Move
  },
  { 
    id: 'repair', 
    title: 'Fiche de Suivi des Réparations des Frigos', 
    description: 'Documentation des pannes et des réparations effectuées.', 
    icon: Settings
  },
  { 
    id: 'depot', 
    title: 'Fiche de Passe au Dépôt', 
    description: 'Suivi des passages des techniciens au dépôt.', 
    icon: Truck
  }
];

export function AvailableForms({ reportForms, onCreateForm }: AvailableFormsProps) {
  return (
    <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <CardTitle className="text-lg">Fiches de maintenance disponibles</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MAINTENANCE_FORMS.map((form) => {
            const IconComponent = form.icon;
            return (
              <Card
                key={form.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                      {form.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {form.description}
                    </p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onCreateForm(form.id)}
                >
                  Créer cette fiche
                </Button>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
