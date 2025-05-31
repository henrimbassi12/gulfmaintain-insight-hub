
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from '@/components/StatusBadge';
import { Equipment } from '@/hooks/useEquipments';
import { 
  MapPin, 
  Calendar,
  User,
  Thermometer,
  Settings
} from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold text-blue-600">
              {equipment.equipment_id}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">{equipment.type}</p>
          </div>
          <StatusBadge status={equipment.status}>
            {equipment.status === 'operational' ? 'Opérationnel' :
             equipment.status === 'maintenance' ? 'Maintenance' :
             equipment.status === 'critical' ? 'Critique' : 'Hors ligne'}
          </StatusBadge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Marque:</span>
            <div className="font-medium">{equipment.brand} {equipment.model}</div>
          </div>
          <div>
            <span className="text-gray-500">Température:</span>
            <div className="font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              {equipment.temperature || 'N/A'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{equipment.location}</span>
          </div>
          {equipment.technician && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-gray-400" />
              <span>{equipment.technician}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Prochaine maintenance: {formatDate(equipment.next_maintenance)}</span>
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
