
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, MapPin, Wrench } from "lucide-react";
import { AlertDetails } from './AlertDetails';

const UrgentAlerts: React.FC = () => {
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const alerts = [
    {
      id: "ALT-001",
      equipment: "FR-2024-089",
      location: "Douala - Zone Industrielle",
      priority: "critical",
      description: "Panne électrique majeure",
      time: "Il y a 15 min",
      technician: "Non assigné"
    },
    {
      id: "ALT-002", 
      equipment: "FR-2024-156",
      location: "Yaoundé - Centre Ville",
      priority: "high",
      description: "Surchauffe système",
      time: "Il y a 1h",
      technician: "MBAPBOU GRÉGOIRE"
    },
    {
      id: "ALT-003",
      equipment: "FR-2024-203",
      location: "Bamenda - Quartier Commercial",
      priority: "medium",
      description: "Maintenance préventive",
      time: "Il y a 3h",
      technician: "VOUKENG"
    }
  ];

  const handleAssignTechnician = (alertId: string) => {
    toast({
      title: "Assignation",
      description: `Technicien assigné à l'alerte ${alertId}`,
    });
  };

  const handleViewDetails = (alertId: string) => {
    setSelectedAlert(alertId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Alertes urgentes
          </CardTitle>
          <CardDescription>Interventions prioritaires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-blue-600">{alert.id}</span>
                      <Badge 
                        variant={
                          alert.priority === 'critical' ? 'destructive' :
                          alert.priority === 'high' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {alert.priority === 'critical' ? 'Critique' :
                         alert.priority === 'high' ? 'Élevée' : 'Moyenne'}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        {alert.equipment}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-600">
                    Technicien: <span className="font-medium">{alert.technician}</span>
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewDetails(alert.id)}
                      className="text-xs"
                    >
                      Détails
                    </Button>
                    {alert.technician === "Non assigné" && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAssignTechnician(alert.id)}
                        className="text-xs"
                      >
                        Assigner
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedAlert && (
        <AlertDetails
          alertId={selectedAlert}
          isOpen={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </>
  );
};

export default UrgentAlerts;
