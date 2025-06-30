
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Equipment } from '@/hooks/useEquipments';
import { 
  MapPin, 
  Calendar,
  User,
  Phone,
  Settings,
  Building
} from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getAfNfBadgeColor = (afNf: string) => {
    return afNf === 'AF' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-blue-600">
              {equipment.type_frigo}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{equipment.branding}</p>
          </div>
          <Badge className={getAfNfBadgeColor(equipment.af_nf)}>
            {equipment.af_nf}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Serial:</span>
            <div className="font-medium text-xs">{equipment.serial_number}</div>
          </div>
          <div>
            <span className="text-gray-500">Tag:</span>
            <div className="font-medium text-xs">{equipment.tag_number}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Building className="w-4 h-4 text-gray-400" />
            <span>{equipment.nom_pdv}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{equipment.ville} - {equipment.quartier}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span>{equipment.technician}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{equipment.tel_barman}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Ajouté le: {formatDate(equipment.date)}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-sm">
            <span className="text-gray-500">Client:</span>
            <div className="font-medium">{equipment.nom_client}</div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="w-4 h-4 mr-1" />
            Détails
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
