
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Wrench, Move, Settings, Truck, Download } from "lucide-react";
import { toast } from 'sonner';

interface MaintenanceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: string;
  formTitle: string;
}

export function MaintenanceFormModal({ isOpen, onClose, formType, formTitle }: MaintenanceFormModalProps) {
  const [formData, setFormData] = useState({
    equipment: '',
    technician: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    duration: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Fiche "${formTitle}" créée avec succès !`);
    onClose();
    
    // Simulation du téléchargement du PDF
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${formTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      toast.info('Téléchargement du PDF en cours...');
    }, 500);
  };

  const getFormIcon = () => {
    switch (formType) {
      case 'maintenance': return Wrench;
      case 'movement': return Move;
      case 'repair': return Settings;
      case 'depot': return Truck;
      default: return FileText;
    }
  };

  const IconComponent = getFormIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="w-5 h-5 text-blue-600" />
            {formTitle}
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations pour générer la fiche de maintenance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipment">Équipement</Label>
              <Select value={formData.equipment} onValueChange={(value) => setFormData({...formData, equipment: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un équipement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INNOVA 420">INNOVA 420</SelectItem>
                  <SelectItem value="INNOVA 650">INNOVA 650</SelectItem>
                  <SelectItem value="INNOVA 1000">INNOVA 1000</SelectItem>
                  <SelectItem value="SANDEN 300">SANDEN 300</SelectItem>
                  <SelectItem value="SANDEN 500">SANDEN 500</SelectItem>
                  <SelectItem value="SUPER-35">SUPER-35</SelectItem>
                  <SelectItem value="FV 400">FV 400</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="technician">Technicien</Label>
              <Select value={formData.technician} onValueChange={(value) => setFormData({...formData, technician: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un technicien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VOUKENG">VOUKENG</SelectItem>
                  <SelectItem value="MBAPBOU Grégoire">MBAPBOU Grégoire</SelectItem>
                  <SelectItem value="TCHINDA Constant">TCHINDA Constant</SelectItem>
                  <SelectItem value="Cédric">Cédric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Durée estimée</Label>
              <Input
                id="duration"
                placeholder="Ex: 2 heures"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="Ex: AKWA, BONABERI..."
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description des travaux</Label>
            <Textarea
              id="description"
              placeholder="Décrivez les opérations à effectuer..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Générer la fiche PDF
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
