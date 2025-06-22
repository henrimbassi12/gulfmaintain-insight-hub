
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Wrench, Move, Settings, Truck } from "lucide-react";

interface MaintenanceForm {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MaintenanceFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForm: (formId: string) => void;
}

const MAINTENANCE_FORMS: MaintenanceForm[] = [
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

export function MaintenanceFormsModal({ isOpen, onClose, onSelectForm }: MaintenanceFormsModalProps) {
  const handleFormSelect = (formId: string) => {
    onSelectForm(formId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Sélectionner une fiche de maintenance
          </DialogTitle>
          <DialogDescription>
            Choisissez le type de fiche que vous souhaitez générer
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {MAINTENANCE_FORMS.map((form) => {
            const IconComponent = form.icon;
            return (
              <Card
                key={form.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300 hover:bg-blue-50"
                onClick={() => handleFormSelect(form.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium leading-tight">
                        {form.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-gray-600">
                    {form.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
