import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, X, Edit } from 'lucide-react';
import { MaintenanceReport } from '@/types/maintenance';
import { toast } from 'sonner';

interface ReportEditModalProps {
  report: MaintenanceReport | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<MaintenanceReport>) => Promise<any>;
}

export function ReportEditModal({ report, isOpen, onClose, onSave }: ReportEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    equipment: '', 
    equipment_brand: '',
    equipment_model: '',
    equipment_serial_number: '',
    technician: '',
    assigned_technician: '',
    type: '',
    priority: '',
    status: '',
    date: '',
    duration: '',
    description: '',
    notes: '',
    location: '',
    region: '',
    cost: 0,
    completion_percentage: 0,
    next_maintenance_date: '',
    parts_used: [] as string[]
  });

  const [newPart, setNewPart] = useState('');

  useEffect(() => {
    if (report) {
      setFormData({
        equipment: report.equipment || '',
        equipment_brand: report.equipment_brand || '',
        equipment_model: report.equipment_model || '',
        equipment_serial_number: report.equipment_serial_number || '',
        technician: report.technician || '',
        assigned_technician: report.assigned_technician || '',
        type: report.type || '',
        priority: report.priority || '',
        status: report.status || '',
        date: report.date || '',
        duration: report.duration || '',
        description: report.description || '',
        notes: report.notes || '',
        location: report.location || '',
        region: report.region || '',
        cost: report.cost || 0,
        completion_percentage: report.completion_percentage || 0,
        next_maintenance_date: report.next_maintenance_date || '',
        parts_used: report.parts_used || []
      });
    }
  }, [report]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddPart = () => {
    if (newPart.trim() && !formData.parts_used.includes(newPart.trim())) {
      setFormData(prev => ({
        ...prev,
        parts_used: [...prev.parts_used, newPart.trim()]
      }));
      setNewPart('');
    }
  };

  const handleRemovePart = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parts_used: prev.parts_used.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!report) return;

    setLoading(true);
    try {
      const updates: Partial<MaintenanceReport> = {
        ...formData,
        type: formData.type as "Préventive" | "Corrective" | "Urgente",
        status: formData.status as "Terminé" | "En cours" | "Planifié",
        priority: formData.priority as "low" | "medium" | "high"
      };
      await onSave(report.id, updates);
      toast.success('Rapport modifié avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors de la modification du rapport');
    } finally {
      setLoading(false);
    }
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <Edit className="w-6 h-6 text-white" />
            </div>
            Modifier le rapport - {report.report_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations de l'équipement */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informations de l'équipement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipment">Nom de l'équipement *</Label>
                <Input
                  id="equipment"
                  value={formData.equipment}
                  onChange={(e) => handleInputChange('equipment', e.target.value)}
                  placeholder="Nom de l'équipement"
                />
              </div>
              
              <div>
                <Label htmlFor="equipment_brand">Marque</Label>
                <Input
                  id="equipment_brand"
                  value={formData.equipment_brand}
                  onChange={(e) => handleInputChange('equipment_brand', e.target.value)}
                  placeholder="Marque de l'équipement"
                />
              </div>
              
              <div>
                <Label htmlFor="equipment_model">Modèle</Label>
                <Input
                  id="equipment_model"
                  value={formData.equipment_model}
                  onChange={(e) => handleInputChange('equipment_model', e.target.value)}
                  placeholder="Modèle de l'équipement"
                />
              </div>
              
              <div>
                <Label htmlFor="equipment_serial_number">Numéro de série</Label>
                <Input
                  id="equipment_serial_number"
                  value={formData.equipment_serial_number}
                  onChange={(e) => handleInputChange('equipment_serial_number', e.target.value)}
                  placeholder="Numéro de série"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Personnel et statut */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Personnel et statut</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="technician">Technicien *</Label>
                <Input
                  id="technician"
                  value={formData.technician}
                  onChange={(e) => handleInputChange('technician', e.target.value)}
                  placeholder="Nom du technicien"
                />
              </div>
              
              <div>
                <Label htmlFor="assigned_technician">Assigné à</Label>
                <Input
                  id="assigned_technician"
                  value={formData.assigned_technician}
                  onChange={(e) => handleInputChange('assigned_technician', e.target.value)}
                  placeholder="Technicien assigné"
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type de maintenance *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Préventive">Préventive</SelectItem>
                    <SelectItem value="Corrective">Corrective</SelectItem>
                    <SelectItem value="Urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priorité *</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Statut *</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planifié">Planifié</SelectItem>
                    <SelectItem value="En cours">En cours</SelectItem>
                    <SelectItem value="Terminé">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="completion_percentage">Pourcentage de completion</Label>
                <Input
                  id="completion_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.completion_percentage}
                  onChange={(e) => handleInputChange('completion_percentage', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Localisation et temps */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Localisation et planification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Lieu *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Lieu de l'intervention"
                />
              </div>
              
              <div>
                <Label htmlFor="region">Région *</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Littoral">Littoral</SelectItem>
                    <SelectItem value="Ouest">Ouest</SelectItem>
                    <SelectItem value="Nord">Nord</SelectItem>
                    <SelectItem value="Sud-Ouest">Sud-Ouest</SelectItem>
                    <SelectItem value="Nord-Ouest">Nord-Ouest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Durée *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  placeholder="Ex: 2h30"
                />
              </div>
              
              <div>
                <Label htmlFor="next_maintenance_date">Prochaine maintenance</Label>
                <Input
                  id="next_maintenance_date"
                  type="date"
                  value={formData.next_maintenance_date}
                  onChange={(e) => handleInputChange('next_maintenance_date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="cost">Coût (FCFA)</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Description et notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Description et notes</h3>
            <div>
              <Label htmlFor="description">Description des travaux *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez les travaux effectués..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes additionnelles</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notes supplémentaires..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Pièces utilisées */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Pièces utilisées</h3>
            <div className="flex gap-2">
              <Input
                value={newPart}
                onChange={(e) => setNewPart(e.target.value)}
                placeholder="Nom de la pièce..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddPart()}
              />
              <Button onClick={handleAddPart} variant="outline">
                Ajouter
              </Button>
            </div>
            
            {formData.parts_used.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {formData.parts_used.map((part, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                    <span className="text-gray-700">{part}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePart(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}