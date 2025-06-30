
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { TechnicianLocation, EquipmentLocation, InterventionLocation } from '@/types/geolocation';

interface GeolocationStatsProps {
  technicians: TechnicianLocation[];
  equipments: EquipmentLocation[];
  interventions: InterventionLocation[];
}

export function GeolocationStats({ technicians, equipments, interventions }: GeolocationStatsProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <Target className="w-5 h-5 text-blue-600" />
          📊 Statistiques en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {technicians.filter(t => t.status === 'available').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Techniciens disponibles</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {equipments.filter(e => e.status === 'operational').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Équipements opérationnels</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {interventions.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Interventions planifiées</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">95%</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Précision GPS</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
