
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Zap, History, SlidersHorizontal } from 'lucide-react';

export const IntelligentFailurePredictionPanel = () => {
  const factors = [
    { name: "Température", weight: 30, details: "Pic à 8°C identifié", icon: Thermometer, color: "text-red-500" },
    { name: "Intensité électrique", weight: 35, details: "Zones optimales 2.4-2.6A", icon: Zap, color: "text-yellow-500" },
    { name: "Historique maintenance", weight: 25, details: "", icon: History, color: "text-blue-500" },
    { name: "Utilisation", weight: 10, details: "", icon: SlidersHorizontal, color: "text-green-500" }
  ];

  return (
    <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">🧠</span>
          Prédiction de Pannes Intelligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">Algorithme composite basé sur 4 facteurs clés pour anticiper les défaillances avant qu'elles ne surviennent.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map(factor => (
            <div key={factor.name} className="p-4 border rounded-lg bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <factor.icon className={`w-5 h-5 ${factor.color}`} />
                  <h4 className="font-semibold text-gray-800">{factor.name}</h4>
                </div>
                <Badge variant="secondary" className="font-bold">{factor.weight}%</Badge>
              </div>
              {factor.details && <p className="text-sm text-gray-500 pl-7">{factor.details}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
