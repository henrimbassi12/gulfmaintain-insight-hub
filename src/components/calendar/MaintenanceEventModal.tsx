
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, MapPin, Wrench, Edit, Save, X } from "lucide-react";
import { toast } from 'sonner';
import { MaintenanceEvent } from '@/hooks/useMaintenanceCalendar';

interface MaintenanceEventModalProps {
  event: MaintenanceEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (eventId: string, updates: Partial<MaintenanceEvent>) => void;
  mode: 'view' | 'edit';
}

export function MaintenanceEventModal({ 
  event, 
  isOpen, 
  onClose, 
  onUpdate, 
  mode: initialMode 
}: MaintenanceEventModalProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const [editData, setEditData] = useState<Partial<MaintenanceEvent>>({});

  if (!event) return null;

  const handleEdit = () => {
    setEditData({
      title: event.title,
      technician: event.technician,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      priority: event.priority,
      status: event.status
    });
    setMode('edit');
  };

  const handleSave = async () => {
    try {
      await onUpdate(event.id, editData);
      setMode('view');
      toast.success('Maintenance mise à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCancel = () => {
    setEditData({});
    setMode('view');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            {mode === 'edit' ? 'Modifier la maintenance' : 'Détails de la maintenance'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {mode === 'view' ? (
            <>
              {/* Mode Visualisation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Titre</Label>
                    <p className="mt-1">{event.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Équipement</Label>
                    <p className="mt-1">{event.equipment}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Technicien</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{event.technician}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{event.date.toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Horaires</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Localisation</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Priorité</Label>
                  <Badge className={`${getPriorityColor(event.priority)} mt-1`}>
                    {event.priority === 'high' ? 'Critique' :
                     event.priority === 'medium' ? 'Moyenne' : 'Faible'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <Badge className={`${getStatusColor(event.status)} mt-1`}>
                    {event.status === 'completed' ? 'Terminé' :
                     event.status === 'in-progress' ? 'En cours' : 'Planifié'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Type</Label>
                  <Badge variant="outline" className="mt-1">
                    {event.type === 'preventive' ? 'Préventif' :
                     event.type === 'corrective' ? 'Correctif' : 'Inspection'}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Fermer
                </Button>
                <Button onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Mode Édition */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="technician">Technicien</Label>
                    <Input
                      id="technician"
                      value={editData.technician || ''}
                      onChange={(e) => setEditData({...editData, technician: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      value={editData.location || ''}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="startTime">Heure de début</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={editData.startTime || ''}
                      onChange={(e) => setEditData({...editData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Heure de fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={editData.endTime || ''}
                      onChange={(e) => setEditData({...editData, endTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">Priorité</Label>
                    <Select 
                      value={editData.priority || ''} 
                      onValueChange={(value) => setEditData({...editData, priority: value as 'high' | 'medium' | 'low'})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Statut</Label>
                <Select 
                  value={editData.status || ''} 
                  onValueChange={(value) => setEditData({...editData, status: value as 'planned' | 'in-progress' | 'completed'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planifié</SelectItem>
                    <SelectItem value="in-progress">En cours</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
