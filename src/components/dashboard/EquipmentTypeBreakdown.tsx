
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wrench, TrendingDown } from "lucide-react";

interface EquipmentTypeData {
  type: string;
  brand: string;
  failures: number;
  totalUnits: number;
  failureRate: number;
  avgRepairTime: string;
}

const EquipmentTypeBreakdown: React.FC = () => {
  const equipmentData: EquipmentTypeData[] = [
    { type: "Réfrigérateur commercial", brand: "Samsung", failures: 28, totalUnits: 145, failureRate: 19.3, avgRepairTime: "2h 15min" },
    { type: "Congélateur vitrine", brand: "LG", failures: 22, totalUnits: 98, failureRate: 22.4, avgRepairTime: "1h 45min" },
    { type: "Chambre froide", brand: "Carrier", failures: 15, totalUnits: 67, failureRate: 22.4, avgRepairTime: "3h 30min" },
    { type: "Réfrigérateur domestique", brand: "Whirlpool", failures: 12, totalUnits: 89, failureRate: 13.5, avgRepairTime: "1h 20min" }
  ];

  const getFailureColor = (rate: number) => {
    if (rate >= 20) return "text-red-600 bg-red-50";
    if (rate >= 15) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-purple-500" />
          Répartition par type d'équipement
        </CardTitle>
        <CardDescription>Analyse des pannes par modèle et marque</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {equipmentData.map((equipment, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{equipment.type}</h3>
                  <p className="text-sm text-gray-600">{equipment.brand}</p>
                </div>
                <div className={`px-2 py-1 rounded text-sm font-medium ${getFailureColor(equipment.failureRate)}`}>
                  {equipment.failureRate}% pannes
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Pannes:</span>
                  <div className="font-bold">{equipment.failures}/{equipment.totalUnits}</div>
                </div>
                <div>
                  <span className="text-gray-600">Temps moyen:</span>
                  <div className="font-bold">{equipment.avgRepairTime}</div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span className="text-sm text-red-600">Problématique</span>
                </div>
              </div>
              <Progress value={equipment.failureRate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentTypeBreakdown;
