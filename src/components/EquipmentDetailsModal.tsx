
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Equipment } from '@/hooks/useEquipments';
import { 
  MapPin, 
  Calendar,
  User,
  Phone,
  Building,
  Hash,
  Tag
} from 'lucide-react';

interface EquipmentDetailsModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentDetailsModal({ equipment, isOpen, onClose }: EquipmentDetailsModalProps) {
  if (!equipment) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getAfNfBadgeColor = (afNf: string) => {
    return afNf === 'AF' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              {equipment.type_frigo}
            </span>
            <Badge className={getAfNfBadgeColor(equipment.af_nf)}>
              {equipment.af_nf}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Informations générales</h3>
            
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Branding:</span>
              <span className="text-sm">{equipment.branding}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Serial:</span>
              <span className="text-sm font-mono">{equipment.serial_number}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Tag:</span>
              <span className="text-sm font-mono">{equipment.tag_number}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Technicien:</span>
              <span className="text-sm">{equipment.technician}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Date d'ajout:</span>
              <span className="text-sm">{formatDate(equipment.date)}</span>
            </div>
          </div>

          {/* Localisation et contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Localisation & Contact</h3>
            
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Point de vente:</span>
              <span className="text-sm">{equipment.nom_pdv}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Ville:</span>
              <span className="text-sm">{equipment.ville}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Quartier:</span>
              <span className="text-sm">{equipment.quartier}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Localisation:</span>
              <span className="text-sm">{equipment.localisation}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Téléphone:</span>
              <span className="text-sm">{equipment.tel_barman}</span>
            </div>
          </div>

          {/* Organisation */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Organisation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Division:</span>
                <p className="text-sm">{equipment.division}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Secteur:</span>
                <p className="text-sm">{equipment.secteur}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Partenaire:</span>
                <p className="text-sm">{equipment.partenaire}</p>
              </div>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-600">Client:</span>
              <p className="text-sm">{equipment.nom_client}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
