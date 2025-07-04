import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import { PlannedMaintenance } from '@/hooks/usePlannedMaintenances';

interface MaintenanceEditModalProps {
  maintenance: PlannedMaintenance | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<PlannedMaintenance>) => Promise<void>;
}

export function MaintenanceEditModal({ 
  maintenance, 
  isOpen, 
  onClose, 
  onUpdate 
}: MaintenanceEditModalProps) {
  const [formData, setFormData] = useState<Partial<PlannedMaintenance>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (maintenance && isOpen) {
      setFormData({ ...maintenance });
    }
  }, [maintenance, isOpen]);

  if (!maintenance) return null;

  const handleInputChange = (field: keyof PlannedMaintenance, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.technician_assigne || !formData.type_maintenance) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(maintenance.id, formData);
      toast.success('Maintenance mise à jour avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de la maintenance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Modifier la maintenance - {maintenance.type_frigo}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type_maintenance">Type de maintenance *</Label>
              <Select 
                value={formData.type_maintenance || ''} 
                onValueChange={(value) => handleInputChange('type_maintenance', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maintenance préventive">Maintenance préventive</SelectItem>
                  <SelectItem value="Maintenance corrective">Maintenance corrective</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priorite">Priorité</Label>
              <Select 
                value={formData.priorite || ''} 
                onValueChange={(value) => handleInputChange('priorite', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician_assigne">Technicien assigné *</Label>
              <Input
                id="technician_assigne"
                value={formData.technician_assigne || ''}
                onChange={(e) => handleInputChange('technician_assigne', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_programmee">Date programmée</Label>
              <Input
                id="date_programmee"
                type="date"
                value={formData.date_programmee || ''}
                onChange={(e) => handleInputChange('date_programmee', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duree_estimee">Durée estimée</Label>
              <Input
                id="duree_estimee"
                value={formData.duree_estimee || ''}
                onChange={(e) => handleInputChange('duree_estimee', e.target.value)}
                placeholder="ex: 2h"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tel_barman">Téléphone</Label>
              <Input
                id="tel_barman"
                value={formData.tel_barman || ''}
                onChange={(e) => handleInputChange('tel_barman', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Localisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={formData.ville || ''}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quartier">Quartier</Label>
                <Input
                  id="quartier"
                  value={formData.quartier || ''}
                  onChange={(e) => handleInputChange('quartier', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom_client">Nom du client</Label>
                <Input
                  id="nom_client"
                  value={formData.nom_client || ''}
                  onChange={(e) => handleInputChange('nom_client', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom_pdv">Nom du point de vente</Label>
                <Input
                  id="nom_pdv"
                  value={formData.nom_pdv || ''}
                  onChange={(e) => handleInputChange('nom_pdv', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}