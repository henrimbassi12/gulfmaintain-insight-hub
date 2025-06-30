
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Upload, MessageSquare, X, Brain } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  maintenance?: any;
  onSave: (data: any) => void;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ 
  isOpen, 
  onClose, 
  maintenance, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    report_id: maintenance?.report_id || `RPT-${Date.now()}`,
    equipment: maintenance?.equipment || '',
    equipment_brand: maintenance?.equipment_brand || '',
    equipment_model: maintenance?.equipment_model || '',
    equipment_serial_number: maintenance?.equipment_serial_number || '',
    technician: maintenance?.technician || '',
    assigned_technician: maintenance?.assigned_technician || '',
    type: maintenance?.type || '',
    priority: maintenance?.priority || 'medium',
    date: maintenance?.date ? new Date(maintenance.date) : new Date(),
    duration: maintenance?.duration || '1h 00min',
    description: maintenance?.description || '',
    location: maintenance?.location || '',
    region: maintenance?.region || 'Douala',
    status: maintenance?.status || 'Planifié',
    cost: maintenance?.cost || 0,
    parts_used: maintenance?.parts_used || [],
    notes: maintenance?.notes || '',
    completion_percentage: maintenance?.completion_percentage || 0,
    next_maintenance_date: maintenance?.next_maintenance_date || null,
    images: maintenance?.images || []
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const maintenanceData = {
        report_id: formData.report_id,
        equipment: formData.equipment,
        equipment_brand: formData.equipment_brand,
        equipment_model: formData.equipment_model,
        equipment_serial_number: formData.equipment_serial_number,
        technician: formData.technician,
        assigned_technician: formData.assigned_technician,
        type: formData.type,
        priority: formData.priority,
        date: format(formData.date, 'yyyy-MM-dd'),
        duration: formData.duration,
        description: formData.description,
        location: formData.location,
        region: formData.region,
        status: formData.status,
        cost: formData.cost,
        parts_used: formData.parts_used,
        notes: formData.notes,
        completion_percentage: formData.completion_percentage,
        next_maintenance_date: formData.next_maintenance_date
      };

      if (maintenance?.id) {
        const { error } = await supabase
          .from('maintenance_reports')
          .update(maintenanceData)
          .eq('id', maintenance.id);
        
        if (error) throw error;
        toast.success('Rapport de maintenance mis à jour avec succès');
      } else {
        const { error } = await supabase
          .from('maintenance_reports')
          .insert(maintenanceData);
        
        if (error) throw error;
        toast.success('Rapport de maintenance créé avec succès');
      }

      onSave(formData);
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const aiRiskLevel = formData.equipment === 'FR-2024-012' ? 83 : 
                     formData.equipment === 'FR-2024-045' ? 67 : null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {maintenance ? 'Modifier intervention' : 'Nouvelle intervention'}
          </SheetTitle>
          <SheetDescription>
            Remplissez les informations de l'intervention de maintenance
          </SheetDescription>
        </SheetHeader>

        {/* AI Risk Alert */}
        {aiRiskLevel && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-orange-700">
              <Brain className="w-4 h-4" />
              <span className="font-medium">Alerte IA</span>
              <Badge variant="secondary" className="ml-auto">
                Risque: {aiRiskLevel}%
              </Badge>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Ce frigo a un risque de panne NF de {aiRiskLevel}% — Vérifiez tension & température.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">ID Rapport</label>
              <Input 
                value={formData.report_id}
                onChange={(e) => setFormData({...formData, report_id: e.target.value})}
                placeholder="RPT-001"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Équipement</label>
              <Select value={formData.equipment} onValueChange={(value) => setFormData({...formData, equipment: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner équipement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FR-2024-089">FR-2024-089</SelectItem>
                  <SelectItem value="FR-2024-012">FR-2024-012</SelectItem>
                  <SelectItem value="FR-2024-134">FR-2024-134</SelectItem>
                  <SelectItem value="FR-2024-045">FR-2024-045</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Détails de l'équipement */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Marque</label>
              <Input 
                value={formData.equipment_brand}
                onChange={(e) => setFormData({...formData, equipment_brand: e.target.value})}
                placeholder="GUINNESS"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Modèle</label>
              <Input 
                value={formData.equipment_model}
                onChange={(e) => setFormData({...formData, equipment_model: e.target.value})}
                placeholder="INNOVA 420"
              />
            </div>
            <div>
              <label className="text-sm font-medium">N° Série</label>
              <Input 
                value={formData.equipment_serial_number}
                onChange={(e) => setFormData({...formData, equipment_serial_number: e.target.value})}
                placeholder="SAM789456123"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Technicien principal</label>
              <Select value={formData.technician} onValueChange={(value) => setFormData({...formData, technician: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Assigner technicien" />
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
              <label className="text-sm font-medium">Technicien assigné</label>
              <Select value={formData.assigned_technician} onValueChange={(value) => setFormData({...formData, assigned_technician: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Technicien secondaire" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VOUKENG">VOUKENG</SelectItem>
                  <SelectItem value="MBAPBOU Grégoire">MBAPBOU Grégoire</SelectItem>
                  <SelectItem value="TCHINDA Constant">TCHINDA Constant</SelectItem>
                  <SelectItem value="Cédric">Cédric</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "dd/MM/yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => setFormData({...formData, date: date || new Date()})}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Type intervention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Préventive">Préventive</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Priorité</label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Localisation</label>
              <Input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Agence ou adresse"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Région</label>
              <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Douala">Douala</SelectItem>
                  <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                  <SelectItem value="Bafoussam">Bafoussam</SelectItem>
                  <SelectItem value="Kribi">Kribi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planifié">Planifié</SelectItem>
                  <SelectItem value="En cours">En cours</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Progression (%)</label>
              <Input 
                type="number"
                min="0"
                max="100"
                value={formData.completion_percentage}
                onChange={(e) => setFormData({...formData, completion_percentage: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Détails de l'intervention, diagnostic, observations..."
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Notes additionnelles</label>
            <Textarea 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Notes internes, recommandations..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Coût (FCFA)</label>
              <Input 
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Durée</label>
              <Input 
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="1h 30min"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Pièces jointes</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Glissez vos fichiers ici ou cliquez pour parcourir</p>
              <p className="text-xs text-gray-500 mt-1">PDF, images acceptés (max 10MB)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Sauvegarde...' : maintenance ? 'Mettre à jour' : 'Créer intervention'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="button" variant="outline" className="px-3">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default MaintenanceForm;
