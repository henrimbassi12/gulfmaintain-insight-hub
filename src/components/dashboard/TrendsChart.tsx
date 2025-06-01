
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const TrendsChart: React.FC = () => {
  const weeklyData = [
    { week: "Sem 1", interventions: 45, avgTime: 2.1 },
    { week: "Sem 2", interventions: 52, avgTime: 1.9 },
    { week: "Sem 3", interventions: 38, avgTime: 2.3 },
    { week: "Sem 4", interventions: 61, avgTime: 1.8 }
  ];

  const maxInterventions = Math.max(...weeklyData.map(d => d.interventions));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Tendances
        </CardTitle>
        <CardDescription>Évolution des interventions et délais de résolution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Graphique interventions */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              Interventions hebdomadaires
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 text-sm">+12%</span>
            </h3>
            <div className="space-y-2">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">{data.week}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div 
                      className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(data.interventions / maxInterventions) * 100}%` }}
                    >
                      <span className="text-white text-xs font-medium">{data.interventions}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Délais de résolution */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              Délai moyen de résolution (heures)
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-red-600 text-sm">-8%</span>
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {weeklyData.map((data, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600">{data.week}</div>
                  <div className="text-lg font-bold text-gray-900">{data.avgTime}h</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsChart;
