
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
    title: maintenance?.title || '',
    equipment: maintenance?.equipment || '',
    technician: maintenance?.technician || '',
    type: maintenance?.type || '',
    priority: maintenance?.priority || 'medium',
    date: maintenance?.date ? new Date(maintenance.date) : new Date(),
    startTime: maintenance?.time || '09:00',
    duration: maintenance?.duration || '1h 00min',
    description: '',
    location: maintenance?.location || '',
    attachments: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const aiRiskLevel = maintenance?.equipment === 'FR-2024-012' ? 83 : 
                     maintenance?.equipment === 'FR-2024-045' ? 67 : null;

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
              <label className="text-sm font-medium">Titre</label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Description de l'intervention"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Technicien</label>
              <Select value={formData.technician} onValueChange={(value) => setFormData({...formData, technician: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Assigner technicien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ahmed Benali">Ahmed Benali</SelectItem>
                  <SelectItem value="Fatima Zahra">Fatima Zahra</SelectItem>
                  <SelectItem value="Mohamed Alami">Mohamed Alami</SelectItem>
                  <SelectItem value="Youssef Idrissi">Youssef Idrissi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Type intervention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Préventive">Préventive</SelectItem>
                  <SelectItem value="Correctif">Correctif</SelectItem>
                  <SelectItem value="Inspection">Inspection</SelectItem>
                  <SelectItem value="Urgente">Urgente</SelectItem>
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
              <label className="text-sm font-medium">Heure début</label>
              <Input 
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
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

          <div>
            <label className="text-sm font-medium">Localisation</label>
            <Input 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Agence ou adresse"
            />
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
            <label className="text-sm font-medium">Pièces jointes</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Glissez vos fichiers ici ou cliquez pour parcourir</p>
              <p className="text-xs text-gray-500 mt-1">PDF, images acceptés (max 10MB)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {maintenance ? 'Mettre à jour' : 'Créer intervention'}
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
