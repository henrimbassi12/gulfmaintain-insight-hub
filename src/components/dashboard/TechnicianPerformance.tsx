
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, CheckCircle, Star } from "lucide-react";

interface TechnicianStats {
  name: string;
  interventions: number;
  successRate: number;
  avgResolutionTime: string;
  rating: number;
}

const TechnicianPerformance: React.FC = () => {
  const technicianStats: TechnicianStats[] = [
    { name: "Ahmed Benali", interventions: 42, successRate: 96, avgResolutionTime: "1h 45min", rating: 4.8 },
    { name: "Fatima Zahra", interventions: 38, successRate: 94, avgResolutionTime: "2h 10min", rating: 4.7 },
    { name: "Mohamed Alami", interventions: 35, successRate: 92, avgResolutionTime: "1h 55min", rating: 4.6 },
    { name: "Youssef Idrissi", interventions: 29, successRate: 89, avgResolutionTime: "2h 30min", rating: 4.4 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Performance par technicien
        </CardTitle>
        <CardDescription>Statistiques et taux de réussite des techniciens</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {technicianStats.map((tech, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{tech.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {tech.interventions} interventions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tech.avgResolutionTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {tech.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">{tech.successRate}%</span>
                  <p className="text-xs text-gray-500">Taux de succès</p>
                </div>
              </div>
              <Progress value={tech.successRate} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianPerformance;
