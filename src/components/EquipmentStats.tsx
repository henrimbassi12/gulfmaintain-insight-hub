
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Equipment } from '@/hooks/useEquipments';

interface EquipmentStatsProps {
  equipments: Equipment[];
}

export function EquipmentStats({ equipments }: EquipmentStatsProps) {
  const totalEquipments = equipments.length;
  
  const statsByType = equipments.reduce((acc, equipment) => {
    acc[equipment.type_frigo] = (acc[equipment.type_frigo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statsByCity = equipments.reduce((acc, equipment) => {
    acc[equipment.ville] = (acc[equipment.ville] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statsByAfNf = equipments.reduce((acc, equipment) => {
    acc[equipment.af_nf] = (acc[equipment.af_nf] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTypes = Object.entries(statsByType)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topCities = Object.entries(statsByCity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalEquipments}</div>
          <div className="text-sm text-gray-600">Total équipements</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Par type</div>
          {topTypes.map(([type, count]) => (
            <div key={type} className="flex justify-between text-sm">
              <span className="truncate">{type}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Par ville</div>
          {topCities.map(([city, count]) => (
            <div key={city} className="flex justify-between text-sm">
              <span className="truncate">{city}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">AF/NF</div>
          {Object.entries(statsByAfNf).map(([type, count]) => (
            <div key={type} className="flex justify-between text-sm">
              <span className="truncate">{type}</span>
              <span className="font-medium">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
