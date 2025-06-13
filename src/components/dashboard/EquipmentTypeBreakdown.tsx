
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Wrench, Thermometer, Zap, Gauge } from "lucide-react";

const EquipmentTypeBreakdown: React.FC = () => {
  const equipmentTypes = [
    {
      type: "Réfrigérateurs",
      icon: Thermometer,
      total: 156,
      operational: 142,
      maintenance: 10,
      critical: 4,
      color: "blue"
    },
    {
      type: "Systèmes électriques", 
      icon: Zap,
      total: 89,
      operational: 81,
      maintenance: 6,
      critical: 2,
      color: "yellow"
    },
    {
      type: "Équipements de mesure",
      icon: Gauge,
      total: 67,
      operational: 63,
      maintenance: 3,
      critical: 1,
      color: "green"
    },
    {
      type: "Outils de maintenance",
      icon: Wrench,
      total: 43,
      operational: 39,
      maintenance: 3,
      critical: 1,
      color: "purple"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Répartition par type d'équipement
        </CardTitle>
        <CardDescription>État par catégorie d'équipement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {equipmentTypes.map((equipment) => {
            const IconComponent = equipment.icon;
            const operationalPercent = Math.round((equipment.operational / equipment.total) * 100);
            
            return (
              <div key={equipment.type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 text-${equipment.color}-500`} />
                    <h3 className="font-medium text-sm">{equipment.type}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {equipment.total} unités
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{equipment.operational}</div>
                    <div className="text-xs text-gray-500">OK</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{equipment.maintenance}</div>
                    <div className="text-xs text-gray-500">Maintenance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{equipment.critical}</div>
                    <div className="text-xs text-gray-500">Critique</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`bg-${equipment.color}-500 h-2 rounded-full`}
                    style={{ width: `${operationalPercent}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {operationalPercent}% fonctionnels
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentTypeBreakdown;
