
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Thermometer } from "lucide-react";

const EquipmentTypeBreakdown: React.FC = () => {
  const fridgeTypes = [
    {
      type: "INNOVA 420",
      total: 89,
      operational: 82,
      maintenance: 5,
      critical: 2,
      color: "blue"
    },
    {
      type: "SANDEN 500", 
      total: 67,
      operational: 61,
      maintenance: 4,
      critical: 2,
      color: "green"
    },
    {
      type: "INNOVA 650",
      total: 54,
      operational: 49,
      maintenance: 3,
      critical: 2,
      color: "purple"
    },
    {
      type: "INNOVA 1000",
      total: 43,
      operational: 38,
      maintenance: 4,
      critical: 1,
      color: "orange"
    },
    {
      type: "SANDEN 300",
      total: 32,
      operational: 29,
      maintenance: 2,
      critical: 1,
      color: "red"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Type de frigo
        </CardTitle>
        <CardDescription>État par modèle de réfrigérateur</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fridgeTypes.map((fridge) => {
            const operationalPercent = Math.round((fridge.operational / fridge.total) * 100);
            
            return (
              <div key={fridge.type} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className={`w-5 h-5 text-${fridge.color}-500`} />
                    <h3 className="font-medium text-sm">{fridge.type}</h3>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {fridge.total} unités
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{fridge.operational}</div>
                    <div className="text-xs text-gray-500">OK</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{fridge.maintenance}</div>
                    <div className="text-xs text-gray-500">Maintenance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{fridge.critical}</div>
                    <div className="text-xs text-gray-500">Critique</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`bg-${fridge.color}-500 h-2 rounded-full`}
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
