
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Building2, TrendingUp, Clock, Users } from "lucide-react";

const AgencySummary: React.FC = () => {
  const { toast } = useToast();

  const agencies = [
    {
      name: "Agence Casablanca Centre",
      technicians: 12,
      interventions: 89,
      efficiency: 94,
      status: "active",
      trend: "+8%"
    },
    {
      name: "Agence Rabat Nord",
      technicians: 8,
      interventions: 56,
      efficiency: 91,
      status: "active", 
      trend: "+12%"
    },
    {
      name: "Agence Marrakech",
      technicians: 6,
      interventions: 34,
      efficiency: 88,
      status: "warning",
      trend: "-3%"
    }
  ];

  const handleViewAgency = (agencyName: string) => {
    toast({
      title: "Navigation",
      description: `Ouverture des détails de ${agencyName}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-500" />
          Résumé des agences
        </CardTitle>
        <CardDescription>Performance par agence ce mois</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agencies.map((agency) => (
            <div key={agency.name} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sm mb-1">{agency.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {agency.technicians} techniciens
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {agency.interventions} interventions
                    </span>
                  </div>
                </div>
                <Badge 
                  variant={agency.status === 'active' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {agency.status === 'active' ? 'Actif' : 'Attention'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-lg font-bold text-gray-900">{agency.efficiency}%</div>
                  <div className="text-xs text-gray-500">Efficacité</div>
                </div>
                <div>
                  <div className={`text-lg font-bold flex items-center gap-1 ${
                    agency.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {agency.trend}
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-gray-500">Tendance</div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleViewAgency(agency.name)}
                className="w-full text-xs"
              >
                Voir détails
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgencySummary;
