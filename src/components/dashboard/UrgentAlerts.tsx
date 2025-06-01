
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Brain, Clock, MapPin } from "lucide-react";

interface Alert {
  id: string;
  type: 'critical' | 'overdue' | 'ai_prediction';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  confidence?: number;
}

const UrgentAlerts: React.FC = () => {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "critical",
      title: "Panne critique FR-2024-089",
      description: "Température hors limite critique -18°C atteinte",
      location: "Casablanca Nord",
      timestamp: "Il y a 15 min"
    },
    {
      id: "2",
      type: "ai_prediction",
      title: "Prédiction IA - Panne imminente",
      description: "FR-2024-045 - Probabilité de panne dans 24h",
      location: "Rabat Centre",
      timestamp: "Il y a 1h",
      confidence: 87
    },
    {
      id: "3",
      type: "overdue",
      title: "Intervention en retard",
      description: "INT-2024-156 - Dépassement du délai prévu de 2h",
      location: "Marrakech Sud",
      timestamp: "Il y a 3h"
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ai_prediction':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'overdue':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'ai_prediction':
        return 'bg-purple-50 border-purple-200';
      case 'overdue':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'ai_prediction':
        return 'secondary';
      case 'overdue':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Urgences & alertes
        </CardTitle>
        <CardDescription>Interventions critiques et prédictions IA</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <h3 className="font-semibold text-sm">{alert.title}</h3>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span>{alert.timestamp}</span>
                      {alert.confidence && (
                        <Badge variant="outline" className="text-xs">
                          Confiance: {alert.confidence}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Traiter
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
