
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, MapPin, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UrgentAlert {
  id: string;
  equipmentId: string;
  location: string;
  agency: string;
  type: string;
  severity: 'critical' | 'high' | 'medium';
  timeAgo: string;
  description: string;
}

const UrgentAlerts: React.FC = () => {
  const { toast } = useToast();

  const urgentAlerts: UrgentAlert[] = [
    {
      id: 'ALT-001',
      equipmentId: 'FR-2024-089',
      location: 'Casablanca Centre',
      agency: 'Agence Maarif',
      type: 'Réfrigérateur commercial',
      severity: 'critical',
      timeAgo: '5 min',
      description: 'Température critique dépassée'
    },
    {
      id: 'ALT-002',
      equipmentId: 'FR-2024-134',
      location: 'Rabat Agdal',
      agency: 'Agence Hay Riad',
      type: 'Congélateur vitrine',
      severity: 'high',
      timeAgo: '12 min',
      description: 'Défaillance du système de refroidissement'
    },
    {
      id: 'ALT-003',
      equipmentId: 'FR-2024-056',
      location: 'Marrakech Gueliz',
      agency: 'Agence Majorelle',
      type: 'Chambre froide',
      severity: 'medium',
      timeAgo: '25 min',
      description: 'Maintenance préventive requise'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAssignTechnician = (alertId: string) => {
    toast({
      title: "Technicien assigné",
      description: `L'alerte ${alertId} a été assignée au technicien le plus proche.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Alertes urgentes
          <Badge variant="destructive" className="ml-auto">
            {urgentAlerts.filter(alert => alert.severity === 'critical').length} critiques
          </Badge>
        </CardTitle>
        <CardDescription>Interventions nécessitant une attention immédiate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {urgentAlerts.map((alert) => (
            <div key={alert.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity === 'critical' ? 'CRITIQUE' : 
                     alert.severity === 'high' ? 'ÉLEVÉ' : 'MOYEN'}
                  </Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Il y a {alert.timeAgo}
                  </span>
                </div>
                <span className="text-sm font-mono text-blue-600">{alert.equipmentId}</span>
              </div>
              
              <h3 className="font-semibold mb-2">{alert.description}</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {alert.location}
                </div>
                <div className="flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  {alert.type}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{alert.agency}</span>
                <Button 
                  size="sm" 
                  onClick={() => handleAssignTechnician(alert.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Assigner technicien
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentAlerts;
