
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, MapPin, CheckCircle } from "lucide-react";
import { Equipment } from '@/hooks/useEquipments';

interface EquipmentStatsProps {
  equipments: Equipment[];
}

export function EquipmentStats({ equipments }: EquipmentStatsProps) {
  const stats = React.useMemo(() => {
    const total = equipments.length;
    
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

    const af = statsByAfNf['AF'] || 0;
    const nf = statsByAfNf['NF'] || 0;

    const topTypes = Object.entries(statsByType)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const topCity = Object.entries(statsByCity)
      .sort(([,a], [,b]) => b - a)[0];

    return { total, af, nf, topTypes, topCity };
  }, [equipments]);

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-100 pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          Statistiques des équipements
          <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
            Temps réel
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{stats.af}</p>
            </div>
            <p className="text-sm text-gray-600">AF</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Package className="w-4 h-4 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{stats.nf}</p>
            </div>
            <p className="text-sm text-gray-600">NF</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MapPin className="w-4 h-4 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{stats.topCity?.[1] || 0}</p>
            </div>
            <p className="text-sm text-gray-600 truncate">{stats.topCity?.[0] || 'Aucune'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
