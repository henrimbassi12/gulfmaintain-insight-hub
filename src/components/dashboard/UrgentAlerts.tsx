
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Clock, MapPin, Wrench } from "lucide-react";
import { AlertDetails } from './AlertDetails';
import { TechnicianAssignmentModal } from './TechnicianAssignmentModal';

const UrgentAlerts: React.FC = () => {
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [showTechnicianModal, setShowTechnicianModal] = useState<string | null>(null);
  const [alerts, setAlerts] = useState([
    {
      id: "ALT-001",
      equipment: "FR-2024-089",
      location: "Douala - Zone Industrielle",
      priority: "critical",
      description: "Panne électrique majeure",
      time: "Il y a 15 min",
      technician: "Non assigné",
      status: "unassigned"
    },
    {
      id: "ALT-002", 
      equipment: "FR-2024-156",
      location: "Yaoundé - Centre Ville",
      priority: "high",
      description: "Surchauffe système",
      time: "Il y a 1h",
      technician: "MBAPBOU GRÉGOIRE",
      status: "assigned"
    },
    {
      id: "ALT-003",
      equipment: "FR-2024-203",
      location: "Bamenda - Quartier Commercial",
      priority: "medium",
      description: "Maintenance préventive",
      time: "Il y a 3h",
      technician: "VOUKENG",
      status: "assigned"
    }
  ]);

  // Données des techniciens disponibles avec leurs compétences et positions
  const availableTechnicians = [
    {
      id: "tech-001",
      name: "CÉDRIC",
      specialization: ["Électricité", "Réfrigération"],
      location: "Douala - Japoma",
      distance: 2.5, // km
      availability: "available",
      experience: 5,
      successRate: 92
    },
    {
      id: "tech-002",
      name: "MBAPBOU GRÉGOIRE",
      specialization: ["Climatisation", "Électronique"],
      location: "Yaoundé - Akwa",
      distance: 1.8,
      availability: "busy",
      experience: 7,
      successRate: 95
    },
    {
      id: "tech-003",
      name: "VOUKENG",
      specialization: ["Mécanique", "Réparation"],
      location: "Bamenda - Centre",
      distance: 0.5,
      availability: "available",
      experience: 3,
      successRate: 88
    },
    {
      id: "tech-004",
      name: "TCHINDA CONSTANT",
      specialization: ["Électronique", "Diagnostic"],
      location: "Douala - Ange Raphael",
      distance: 3.2,
      availability: "available",
      experience: 4,
      successRate: 90
    }
  ];

  const findBestTechnician = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return null;

    // Algorithme de scoring pour trouver le meilleur technicien
    const candidates = availableTechnicians
      .filter(tech => tech.availability === "available")
      .map(tech => {
        let score = 0;
        
        // Score basé sur la spécialisation (40% du score)
        const isSpecialist = tech.specialization.some(spec => 
          alert.description.toLowerCase().includes(spec.toLowerCase()) ||
          (alert.description.includes("électrique") && spec === "Électricité") ||
          (alert.description.includes("surchauffe") && spec === "Climatisation")
        );
        score += isSpecialist ? 40 : 10;
        
        // Score basé sur la proximité (30% du score)
        const proximityScore = Math.max(0, 30 - (tech.distance * 3));
        score += proximityScore;
        
        // Score basé sur l'expérience (20% du score)
        score += Math.min(20, tech.experience * 3);
        
        // Score basé sur le taux de succès (10% du score)
        score += (tech.successRate - 80) / 2;
        
        return { ...tech, score: Math.round(score) };
      })
      .sort((a, b) => b.score - a.score);

    return candidates[0] || null;
  };

  const handleAssignTechnician = (alertId: string) => {
    const bestTechnician = findBestTechnician(alertId);
    
    if (!bestTechnician) {
      toast({
        title: "❌ Aucun technicien disponible",
        description: "Tous les techniciens sont actuellement occupés",
      });
      return;
    }

    // Mettre à jour l'alerte avec le technicien assigné
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              technician: bestTechnician.name,
              status: "assigned"
            }
          : alert
      )
    );

    toast({
      title: "✅ Assignation automatique réussie",
      description: `${bestTechnician.name} assigné à l'alerte ${alertId} (Score: ${bestTechnician.score}%)`,
    });
  };

  const handleViewDetails = (alertId: string) => {
    setSelectedAlert(alertId);
  };

  const getStatusBadge = (status: string, technician: string) => {
    if (status === "assigned" || technician !== "Non assigné") {
      return <Badge className="bg-green-100 text-green-800">Assigné</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Non assigné</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Alertes urgentes
          </CardTitle>
          <CardDescription>Interventions prioritaires avec assignation intelligente</CardDescription>
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
                      {getStatusBadge(alert.status, alert.technician)}
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
                    {(alert.status === "unassigned" || alert.technician === "Non assigné") && (
                      <Button 
                        size="sm" 
                        onClick={() => handleAssignTechnician(alert.id)}
                        className="text-xs"
                      >
                        Assigner (IA)
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

      {showTechnicianModal && (
        <TechnicianAssignmentModal
          isOpen={!!showTechnicianModal}
          onClose={() => setShowTechnicianModal(null)}
        />
      )}
    </>
  );
};

export default UrgentAlerts;
