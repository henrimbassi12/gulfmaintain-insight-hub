
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Clock, Award } from "lucide-react";

const TechnicianPerformance: React.FC = () => {
  const technicians = [
    {
      name: "Ahmed Benali",
      interventions: 23,
      efficiency: 94,
      avgTime: "2h 15min",
      status: "available"
    },
    {
      name: "Fatima Zahra",
      interventions: 18,
      efficiency: 89,
      avgTime: "2h 45min",
      status: "busy"
    },
    {
      name: "Mohamed Alami",
      interventions: 31,
      efficiency: 96,
      avgTime: "1h 55min",
      status: "available"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          Performance des techniciens
        </CardTitle>
        <CardDescription>Classement ce mois</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {technicians.map((tech, index) => (
            <div key={tech.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{tech.name}</p>
                  <p className="text-xs text-gray-500">{tech.interventions} interventions</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <Badge variant={tech.efficiency > 90 ? "default" : "secondary"} className="text-xs">
                    {tech.efficiency}%
                  </Badge>
                  <Badge 
                    variant={tech.status === 'available' ? "default" : "secondary"} 
                    className={tech.status === 'available' ? "bg-green-600" : "bg-orange-600"}
                  >
                    {tech.status === 'available' ? 'Disponible' : 'Occupé'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">{tech.avgTime} moyen</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianPerformance;
