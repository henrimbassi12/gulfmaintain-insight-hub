
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Equipment } from '@/hooks/useEquipments';
import { toast } from 'sonner';
import { CalendarIcon, Clock, User, MapPin } from 'lucide-react';

interface EquipmentMaintenanceModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentMaintenanceModal({ equipment, isOpen, onClose }: EquipmentMaintenanceModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  if (!equipment) return null;

  // Convertir la date d'ajout de l'équipement en objet Date et pointer le calendrier dessus
  const equipmentAddedDate = new Date(equipment.date);
  const defaultMonth = equipmentAddedDate;

  React.useEffect(() => {
    if (isOpen && equipment) {
      setSelectedDate(equipmentAddedDate);
    }
  }, [isOpen, equipment]);

  const handleScheduleMaintenance = () => {
    if (!selectedDate) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    toast.success(`Maintenance programmée pour le ${selectedDate.toLocaleDateString('fr-FR')}`);
    onClose();
  };

  const getAfNfBadgeColor = (afNf: string) => {
    return afNf === 'AF' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Programmer une maintenance
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Informations de l'équipement */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{equipment.type_frigo}</h4>
              <Badge className={getAfNfBadgeColor(equipment.af_nf)}>
                {equipment.af_nf}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{equipment.ville} - {equipment.quartier}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Serial: {equipment.serial_number}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>Ajouté le: {equipmentAddedDate.toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Calendrier pointé sur la date d'ajout */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Sélectionner une date de maintenance
            </label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              defaultMonth={defaultMonth}
              disabled={(date) => date < new Date()}
              className="rounded-md border pointer-events-auto"
            />
          </div>

          {/* Créneaux horaires suggérés */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Créneaux suggérés
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['09:00', '11:00', '14:00', '16:00'].map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  {time}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleScheduleMaintenance} className="flex-1">
              Programmer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
