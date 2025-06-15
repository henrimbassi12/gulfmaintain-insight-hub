
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, AlertTriangle } from "lucide-react";

const RegionMap: React.FC = () => {
  const regions = [
    {
      name: "Douala",
      equipments: 145,
      operational: 132,
      maintenance: 8,
      critical: 5,
      interventions: 23
    },
    {
      name: "Yaoundé", 
      equipments: 89,
      operational: 84,
      maintenance: 3,
      critical: 2,
      interventions: 12
    },
    {
      name: "Bamenda",
      equipments: 67,
      operational: 61,
      maintenance: 4,
      critical: 2,
      interventions: 8
    },
    {
      name: "Bafoussam",
      equipments: 54,
      operational: 48,
      maintenance: 5,
      critical: 1,
      interventions: 6
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          Répartition géographique
        </CardTitle>
        <CardDescription>État des équipements par région</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regions.map((region) => (
            <div key={region.name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{region.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {region.equipments} équipements
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{region.operational}</div>
                  <div className="text-xs text-gray-500">Opérationnels</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{region.maintenance}</div>
                  <div className="text-xs text-gray-500">Maintenance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{region.critical}</div>
                  <div className="text-xs text-gray-500">Critiques</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{region.interventions}</div>
                  <div className="text-xs text-gray-500">Interventions</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(region.operational / region.equipments) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((region.operational / region.equipments) * 100)}% opérationnels
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionMap;
