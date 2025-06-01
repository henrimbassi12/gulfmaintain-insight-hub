
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface AgencyData {
  name: string;
  interventions: number;
  avgResponseTime: string;
  criticalRate: number;
  efficiency: number;
  technicians: number;
}

const AgencySummary: React.FC = () => {
  const agencies: AgencyData[] = [
    { name: "Casablanca Nord", interventions: 89, avgResponseTime: "1h 15min", criticalRate: 5.6, efficiency: 94, technicians: 8 },
    { name: "Rabat Centre", interventions: 64, avgResponseTime: "1h 30min", criticalRate: 4.7, efficiency: 96, technicians: 6 },
    { name: "Marrakech Sud", interventions: 45, avgResponseTime: "2h 10min", criticalRate: 4.4, efficiency: 92, technicians: 5 },
    { name: "Tanger Port", interventions: 32, avgResponseTime: "1h 45min", criticalRate: 3.1, efficiency: 98, technicians: 4 }
  ];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-600";
    if (efficiency >= 90) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-indigo-500" />
          Résumé par agence
        </CardTitle>
        <CardDescription>Performance et statistiques par agence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agencies.map((agency, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{agency.name}</h3>
                  <p className="text-sm text-gray-600">{agency.technicians} techniciens</p>
                </div>
                <Badge variant="outline" className={getEfficiencyColor(agency.efficiency)}>
                  {agency.efficiency}% efficacité
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600">Interventions</span>
                  </div>
                  <div className="font-bold text-blue-700">{agency.interventions}</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <span className="text-xs text-orange-600">Délai moyen</span>
                  </div>
                  <div className="font-bold text-orange-700">{agency.avgResponseTime}</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-600">Taux critique</span>
                  </div>
                  <div className="font-bold text-red-700">{agency.criticalRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgencySummary;
