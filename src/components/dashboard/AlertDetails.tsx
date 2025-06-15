
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, MapPin, Clock, User, Wrench, Phone, Mail } from "lucide-react";

interface AlertDetailsProps {
  alertId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertDetails({ alertId, isOpen, onClose }: AlertDetailsProps) {
  const { toast } = useToast();

  // Données simulées pour l'alerte
  const alertData = {
    id: alertId,
    equipment: "FR-2024-089",
    location: "Douala - Zone Industrielle",
    priority: "critical",
    description: "Panne électrique majeure",
    time: "Il y a 15 min",
    technician: "Non assigné",
    details: {
      reportedBy: "Système automatique",
      symptoms: ["Coupure électrique totale", "Alarmes de sécurité activées", "Température anormalement élevée"],
      estimatedRepairTime: "2-4 heures",
      requiredParts: ["Fusible principal", "Relais de contrôle"],
      safetyPrecautions: ["Couper l'alimentation principale", "Porter équipement de sécurité"],
      contactInfo: {
        onSiteContact: "TCHINDA CONSTANT",
        phone: "+237 6 12 34 56 78",
        email: "tchinda.constant@entreprise.cm"
      }
    }
  };

  const handleAssignTechnician = () => {
    toast({
      title: "Assignation réussie",
      description: "Ahmed Benali a été assigné à cette alerte",
    });
    onClose();
  };

  const handleEscalate = () => {
    toast({
      title: "Escalade",
      description: "Alerte escaladée au superviseur",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Détails de l'alerte {alertData.id}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur l'incident
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Équipement</label>
                <p className="font-mono text-sm">{alertData.equipment}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Localisation</label>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {alertData.location}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Priorité</label>
                <Badge variant="destructive" className="ml-2">
                  Critique
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Signalé par</label>
                <p className="text-sm">{alertData.details.reportedBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Heure</label>
                <p className="text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {alertData.time}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Technicien assigné</label>
                <p className="text-sm flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {alertData.technician}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{alertData.description}</p>
          </div>

          {/* Symptômes */}
          <div>
            <label className="text-sm font-medium text-gray-500">Symptômes observés</label>
            <ul className="text-sm mt-1 space-y-1">
              {alertData.details.symptoms.map((symptom, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

          {/* Informations techniques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Temps de réparation estimé</label>
              <p className="text-sm mt-1">{alertData.details.estimatedRepairTime}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pièces requises</label>
              <ul className="text-sm mt-1">
                {alertData.details.requiredParts.map((part, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <Wrench className="w-3 h-3" />
                    {part}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Précautions de sécurité */}
          <div>
            <label className="text-sm font-medium text-gray-500">Précautions de sécurité</label>
            <ul className="text-sm mt-1 space-y-1">
              {alertData.details.safetyPrecautions.map((precaution, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  {precaution}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact sur site */}
          <div className="bg-blue-50 p-4 rounded">
            <label className="text-sm font-medium text-gray-700">Contact sur site</label>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium">{alertData.details.contactInfo.onSiteContact}</p>
              <p className="text-sm flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {alertData.details.contactInfo.phone}
              </p>
              <p className="text-sm flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {alertData.details.contactInfo.email}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleAssignTechnician} className="flex-1">
              Assigner technicien
            </Button>
            <Button variant="outline" onClick={handleEscalate}>
              Escalader
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
