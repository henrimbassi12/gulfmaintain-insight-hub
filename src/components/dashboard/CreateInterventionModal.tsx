
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Wrench, User } from "lucide-react";

interface CreateInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateInterventionModal({ isOpen, onClose }: CreateInterventionModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    equipmentId: '',
    type: '',
    priority: '',
    location: '',
    description: '',
    scheduledDate: '',
    assignedTechnician: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer un ID d'intervention
    const interventionId = `INT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    toast({
      title: "✅ Intervention créée",
      description: `Intervention ${interventionId} créée avec succès`,
    });
    
    // Reset form
    setFormData({
      equipmentId: '',
      type: '',
      priority: '',
      location: '',
      description: '',
      scheduledDate: '',
      assignedTechnician: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-500" />
            Créer une nouvelle intervention
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle intervention de maintenance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentId">ID Équipement</Label>
              <Input
                id="equipmentId"
                placeholder="FR-2024-xxx"
                value={formData.equipmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, equipmentId: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type d'intervention</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Maintenance préventive</SelectItem>
                  <SelectItem value="corrective">Maintenance corrective</SelectItem>
                  <SelectItem value="emergency">Intervention d'urgence</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau de priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="Douala - Zone Industrielle"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème ou la maintenance à effectuer..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date programmée</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTechnician">Technicien assigné</Label>
              <Select value={formData.assignedTechnician} onValueChange={(value) => setFormData(prev => ({ ...prev, assignedTechnician: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un technicien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cedric">CÉDRIC (Disponible)</SelectItem>
                  <SelectItem value="mbapbou-gregoire">MBAPBOU GRÉGOIRE (Disponible)</SelectItem>
                  <SelectItem value="voukeng">VOUKENG (Occupé)</SelectItem>
                  <SelectItem value="tchinda-constant">TCHINDA CONSTANT (Disponible)</SelectItem>
                  <SelectItem value="ndjoko-iv">NDJOKO IV (Disponible)</SelectItem>
                  <SelectItem value="ndoumbe-etia">NDOUMBE ETIA (Disponible)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer l'intervention
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
