
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

const TrendsChart: React.FC = () => {
  const monthlyData = [
    { month: "Jan", interventions: 156, preventive: 89, corrective: 67 },
    { month: "Fév", interventions: 189, preventive: 102, corrective: 87 },
    { month: "Mar", interventions: 234, preventive: 134, corrective: 100 },
    { month: "Avr", interventions: 198, preventive: 118, corrective: 80 },
    { month: "Mai", interventions: 267, preventive: 156, corrective: 111 },
    { month: "Juin", interventions: 223, preventive: 142, corrective: 81 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.interventions));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Tendances des interventions
        </CardTitle>
        <CardDescription>Évolution sur 6 mois</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Graphique simplifié */}
          <div className="space-y-3">
            {monthlyData.map((data) => (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="text-gray-600">{data.interventions} total</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(data.interventions / maxValue) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Préventif: {data.preventive}</span>
                    <span>Correctif: {data.corrective}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé des tendances */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyse de tendance
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">+19%</div>
                <div className="text-xs text-gray-600">Préventif</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">+12%</div>
                <div className="text-xs text-gray-600">Correctif</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Évolution moyenne sur 6 mois
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsChart;
