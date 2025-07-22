import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface InterventionPlanningModalProps {
  prediction: any;
  isOpen: boolean;
  onClose: () => void;
  onPlan: (interventionData: any) => void;
}

export function InterventionPlanningModal({ prediction, isOpen, onClose, onPlan }: InterventionPlanningModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    technician: '',
    description: '',
    priority: prediction?.priority_level || 'medium',
    estimatedDuration: prediction?.estimated_duration_hours || 2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.technician) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const planningData = {
      ...formData,
      equipment_id: prediction?.equipment_id,
      equipment_name: prediction?.equipment_name,
      prediction_id: prediction?.id
    };

    onPlan(planningData);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Élevée</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Faible</Badge>;
      default:
        return <Badge variant="secondary">Inconnue</Badge>;
    }
  };

  if (!prediction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">Planifier une intervention</div>
              <div className="text-sm text-gray-500 font-normal">
                Basée sur la prédiction IA pour {prediction.equipment_name}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Informations sur la prédiction */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800">Données de la prédiction IA</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Équipement:</span>
              <span className="ml-2 font-medium">{prediction.equipment_name}</span>
            </div>
            <div>
              <span className="text-gray-600">Confiance:</span>
              <span className="ml-2 font-medium">{prediction.confidence_score}%</span>
            </div>
            <div>
              <span className="text-gray-600">Priorité:</span>
              <span className="ml-2">{getPriorityBadge(prediction.priority_level)}</span>
            </div>
            <div>
              <span className="text-gray-600">Risque de panne:</span>
              <span className="ml-2 font-medium text-red-600">{prediction.failure_risk}%</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Actions recommandées:</span>
              <p className="text-sm mt-1 text-gray-700">{prediction.recommended_actions.join(', ')}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Date d'intervention *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="time" className="text-sm font-medium">
                Heure de début *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>

          {/* Technicien */}
          <div>
            <Label htmlFor="technician" className="text-sm font-medium">
              Technicien assigné *
            </Label>
            <Select value={formData.technician} onValueChange={(value) => setFormData({ ...formData, technician: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un technicien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Jean Mballa">Jean Mballa - Spécialiste Réfrigération</SelectItem>
                <SelectItem value="Marie Ngono">Marie Ngono - Technicienne Senior</SelectItem>
                <SelectItem value="Paul Atangana">Paul Atangana - Expert Maintenance</SelectItem>
                <SelectItem value="Grace Fouda">Grace Fouda - Technicienne Électrique</SelectItem>
                <SelectItem value="David Owono">David Owono - Chef d'équipe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priorité et durée */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority" className="text-sm font-medium">
                Priorité
              </Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration" className="text-sm font-medium">
                Durée estimée (heures)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0.5"
                max="8"
                step="0.5"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseFloat(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description de l'intervention
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez les tâches à effectuer..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Clock className="w-4 h-4 mr-2" />
              Planifier l'intervention
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}