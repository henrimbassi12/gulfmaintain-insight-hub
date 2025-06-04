
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, TrendingDown } from "lucide-react";

interface AgencyData {
  name: string;
  location: string;
  equipmentCount: number;
  activeInterventions: number;
  completionRate: number;
  monthlyTrend: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

const AgencySummary: React.FC = () => {
  const agencyData: AgencyData[] = [
    { 
      name: "Agence Maarif", 
      location: "Casablanca", 
      equipmentCount: 45, 
      activeInterventions: 3, 
      completionRate: 96, 
      monthlyTrend: 8,
      status: 'excellent'
    },
    { 
      name: "Agence Hay Riad", 
      location: "Rabat", 
      equipmentCount: 32, 
      activeInterventions: 2, 
      completionRate: 94, 
      monthlyTrend: 5,
      status: 'excellent'
    },
    { 
      name: "Agence Majorelle", 
      location: "Marrakech", 
      equipmentCount: 28, 
      activeInterventions: 4, 
      completionRate: 87, 
      monthlyTrend: -2,
      status: 'good'
    },
    { 
      name: "Agence Corniche", 
      location: "Tanger", 
      equipmentCount: 19, 
      activeInterventions: 1, 
      completionRate: 92, 
      monthlyTrend: 12,
      status: 'excellent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'warning':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Bon';
      case 'warning':
        return 'Attention';
      case 'critical':
        return 'Critique';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-500" />
          Résumé par agence
        </CardTitle>
        <CardDescription>Performance et activité de chaque agence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {agencyData.map((agency, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{agency.name}</h3>
                  <p className="text-sm text-gray-600">{agency.location}</p>
                </div>
                <Badge className={getStatusColor(agency.status)}>
                  {getStatusLabel(agency.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xl font-bold text-gray-900">{agency.equipmentCount}</div>
                  <div className="text-xs text-gray-600">Équipements</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="text-xl font-bold text-orange-600">{agency.activeInterventions}</div>
                  <div className="text-xs text-gray-600">En cours</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-xl font-bold text-green-600">{agency.completionRate}%</div>
                  <div className="text-xs text-gray-600">Taux de réussite</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Taux de completion</span>
                  <span>{agency.completionRate}%</span>
                </div>
                <Progress value={agency.completionRate} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tendance mensuelle:</span>
                <div className="flex items-center gap-1">
                  {agency.monthlyTrend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={agency.monthlyTrend > 0 ? 'text-green-600' : 'text-red-600'}>
                    {agency.monthlyTrend > 0 ? '+' : ''}{agency.monthlyTrend}%
                  </span>
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
