
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Clock, User, Wrench } from "lucide-react";
import { toast } from 'sonner';

interface Intervention {
  id: string;
  equipment: string;
  technician: string;
  type: string;
  status: 'completed' | 'in-progress' | 'planned';
  duration: string;
  sector: string;
}

interface InterventionActionsProps {
  intervention: Intervention;
}

export function InterventionActions({ intervention }: InterventionActionsProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
    toast.success(`Détails de l'intervention ${intervention.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'in-progress':
        return 'En cours';
      case 'planned':
        return 'Planifiée';
      default:
        return status;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleViewDetails}
      >
        <Eye className="w-4 h-4 mr-2" />
        Voir
      </Button>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Détails de l'intervention #{intervention.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Statut</label>
                <Badge className={getStatusColor(intervention.status)}>
                  {getStatusText(intervention.status)}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Durée</label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{intervention.duration}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Équipement</label>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-gray-500" />
                  <span>{intervention.equipment}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Technicien</label>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{intervention.technician}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type d'intervention</label>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">{intervention.type}</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Secteur</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{intervention.sector}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Fermer
                </Button>
                <Button onClick={() => {
                  toast.success('Modification de l\'intervention...');
                  setShowDetails(false);
                }}>
                  Modifier
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
