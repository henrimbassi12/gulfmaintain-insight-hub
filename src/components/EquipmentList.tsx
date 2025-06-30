
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Equipment } from '@/hooks/useEquipments';
import { EquipmentCard } from './EquipmentCard';
import { EquipmentExportButton } from './EquipmentExportButton';
import { Search, Package } from 'lucide-react';

interface EquipmentListProps {
  equipments: Equipment[];
  filteredEquipments: Equipment[];
  isLoading: boolean;
}

export function EquipmentList({ 
  equipments, 
  filteredEquipments, 
  isLoading 
}: EquipmentListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600">Chargement des équipements...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (equipments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun équipement</h3>
          <p className="text-gray-600">Commencez par ajouter votre premier équipement</p>
        </CardContent>
      </Card>
    );
  }

  if (filteredEquipments.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Search className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat</h3>
          <p className="text-gray-600">Aucun équipement ne correspond à vos critères de recherche</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">
              Liste des équipements
            </CardTitle>
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {filteredEquipments.length} équipement{filteredEquipments.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <EquipmentExportButton equipments={filteredEquipments} />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipments.map((equipment) => (
            <EquipmentCard key={equipment.id} equipment={equipment} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
