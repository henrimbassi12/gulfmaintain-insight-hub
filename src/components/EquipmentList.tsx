
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { EquipmentCard } from '@/components/EquipmentCard';
import { Equipment } from '@/hooks/useEquipments';

interface EquipmentListProps {
  equipments: Equipment[];
  filteredEquipments: Equipment[];
  isLoading: boolean;
}

export function EquipmentList({ equipments, filteredEquipments, isLoading }: EquipmentListProps) {
  if (filteredEquipments.length === 0 && !isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">
            {equipments.length === 0 
              ? 'Aucun équipement trouvé. Ajoutez votre premier équipement!'
              : 'Aucun équipement trouvé avec ces critères.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredEquipments.map((equipment) => (
        <EquipmentCard key={equipment.id} equipment={equipment} />
      ))}
    </div>
  );
}
