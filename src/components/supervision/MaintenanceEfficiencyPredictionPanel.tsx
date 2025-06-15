
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export const MaintenanceEfficiencyPredictionPanel = () => {
  const segments = [
    { name: "Succès total", rate: 70, details: "2.4-2.6A post-maintenance", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-100" },
    { name: "Succès partiel", rate: 20, details: "Nécessite surveillance", icon: AlertCircle, color: "text-orange-500", bgColor: "bg-orange-100" },
    { name: "Résistance", rate: 10, details: "Intervention spécialisée requise", icon: XCircle, color: "text-red-500", bgColor: "bg-red-100" }
  ];

  return (
    <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in" style={{ animationDelay: '150ms' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">🔧</span>
          Prédiction d'Efficacité de Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">Modèle spécialisé évaluant l'impact des interventions de maintenance basé sur des analyses avant/après.</p>
        
        <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Segmentation automatique des résultats :</p>
            <div className="flex w-full h-4 rounded-full overflow-hidden bg-gray-200">
                <div className="bg-green-500" style={{ width: '70%' }}></div>
                <div className="bg-orange-500" style={{ width: '20%' }}></div>
                <div className="bg-red-500" style={{ width: '10%' }}></div>
            </div>
        </div>
        
        <div className="space-y-3 mt-6">
          {segments.map(segment => (
            <div key={segment.name} className={`p-4 border rounded-lg flex items-center gap-4 ${segment.bgColor.replace('100', '50/50')}`}>
              <div className={`w-10 h-10 ${segment.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <segment.icon className={`w-6 h-6 ${segment.color}`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{segment.name} <Badge variant="outline" className="ml-2">{segment.rate}%</Badge></h4>
                <p className="text-sm text-gray-500">{segment.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
