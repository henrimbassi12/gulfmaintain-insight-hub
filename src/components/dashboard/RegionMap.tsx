
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Activity } from "lucide-react";

interface RegionData {
  name: string;
  interventions: number;
  critical: number;
  inProgress: number;
  completed: number;
  color: string;
}

const RegionMap: React.FC = () => {
  const regions: RegionData[] = [
    { name: "Casablanca", interventions: 89, critical: 5, inProgress: 12, completed: 72, color: "bg-blue-500" },
    { name: "Rabat", interventions: 64, critical: 3, inProgress: 8, completed: 53, color: "bg-green-500" },
    { name: "Marrakech", interventions: 45, critical: 2, inProgress: 6, completed: 37, color: "bg-orange-500" },
    { name: "Tanger", interventions: 32, critical: 1, inProgress: 4, completed: 27, color: "bg-purple-500" }
  ];

  const totalInterventions = regions.reduce((acc, region) => acc + region.interventions, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          Carte des interventions par région
        </CardTitle>
        <CardDescription>Répartition géographique et statuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regions.map((region, index) => {
            const percentage = Math.round((region.interventions / totalInterventions) * 100);
            return (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                    <h3 className="font-semibold">{region.name}</h3>
                    <Badge variant="outline">{percentage}%</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium">{region.interventions}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-bold text-red-600">{region.critical}</div>
                    <div className="text-red-500">Critiques</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="font-bold text-orange-600">{region.inProgress}</div>
                    <div className="text-orange-500">En cours</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{region.completed}</div>
                    <div className="text-green-500">Terminées</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionMap;
