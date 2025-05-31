
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Equipment } from '@/hooks/useEquipments';

interface EquipmentStatsProps {
  equipments: Equipment[];
}

export function EquipmentStats({ equipments }: EquipmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {equipments.filter(e => e.status === 'operational').length}
          </div>
          <div className="text-sm text-gray-600">Opérationnels</div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {equipments.filter(e => e.status === 'maintenance').length}
          </div>
          <div className="text-sm text-gray-600">En maintenance</div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {equipments.filter(e => e.status === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">Critiques</div>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-gray-500">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-900">
            {equipments.filter(e => e.status === 'offline').length}
          </div>
          <div className="text-sm text-gray-600">Hors ligne</div>
        </CardContent>
      </Card>
    </div>
  );
}
