
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, Clock, TrendingUp, MapPin, Phone, Mail } from "lucide-react";

interface AgencyDetailsProps {
  agencyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AgencyDetails({ agencyName, isOpen, onClose }: AgencyDetailsProps) {
  const { toast } = useToast();

  // Données simulées pour l'agence
  const agencyData = {
    name: agencyName,
    address: "123 Avenue Mohammed V, Casablanca",
    manager: "Rachid Benali",
    phone: "+212 5 22 12 34 56",
    email: "casablanca.centre@entreprise.ma",
    technicians: [
      { name: "Ahmed Benali", specialization: "Électricité", interventions: 23, efficiency: 94, status: "available" },
      { name: "Fatima Zahra", specialization: "Réfrigération", interventions: 18, efficiency: 89, status: "busy" },
      { name: "Omar Alaoui", specialization: "Mécanique", interventions: 15, efficiency: 92, status: "available" },
      { name: "Aicha Idrissi", specialization: "Électronique", interventions: 20, efficiency: 96, status: "available" }
    ],
    stats: {
      totalInterventions: 89,
      completedToday: 12,
      inProgress: 5,
      scheduled: 8,
      efficiency: 94,
      avgResponseTime: "1h 30min",
      customerSatisfaction: 4.8
    },
    equipment: {
      operational: 132,
      maintenance: 8,
      critical: 5,
      total: 145
    }
  };

  const handleContactManager = () => {
    toast({
      title: "Contact initié",
      description: `Appel vers ${agencyData.manager}`,
    });
  };

  const handleViewSchedule = () => {
    toast({
      title: "Planning",
      description: "Ouverture du planning de l'agence",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-500" />
            {agencyData.name}
          </DialogTitle>
          <DialogDescription>
            Détails complets de l'agence et performance des équipes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Adresse</label>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {agencyData.address}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsable</label>
                    <p className="text-sm">{agencyData.manager}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Téléphone</label>
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {agencyData.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {agencyData.email}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques de performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{agencyData.stats.totalInterventions}</div>
                  <div className="text-xs text-gray-600">Interventions totales</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">{agencyData.stats.completedToday}</div>
                  <div className="text-xs text-gray-600">Terminées aujourd'hui</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="text-2xl font-bold text-orange-600">{agencyData.stats.inProgress}</div>
                  <div className="text-xs text-gray-600">En cours</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="text-2xl font-bold text-purple-600">{agencyData.stats.scheduled}</div>
                  <div className="text-xs text-gray-600">Planifiées</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{agencyData.stats.efficiency}%</div>
                  <div className="text-sm text-gray-600">Efficacité</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{agencyData.stats.avgResponseTime}</div>
                  <div className="text-sm text-gray-600">Temps de réponse moyen</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{agencyData.stats.customerSatisfaction}/5</div>
                  <div className="text-sm text-gray-600">Satisfaction client</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Équipe de techniciens */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Équipe de techniciens ({agencyData.technicians.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agencyData.technicians.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{tech.name}</p>
                      <p className="text-sm text-gray-600">{tech.specialization}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant={tech.status === 'available' ? 'default' : 'secondary'}>
                          {tech.status === 'available' ? 'Disponible' : 'Occupé'}
                        </Badge>
                        <span className="text-sm">{tech.efficiency}%</span>
                      </div>
                      <p className="text-xs text-gray-500">{tech.interventions} interventions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* État des équipements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">État des équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="text-xl font-bold text-green-600">{agencyData.equipment.operational}</div>
                  <div className="text-xs text-gray-600">Opérationnels</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded">
                  <div className="text-xl font-bold text-yellow-600">{agencyData.equipment.maintenance}</div>
                  <div className="text-xs text-gray-600">En maintenance</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded">
                  <div className="text-xl font-bold text-red-600">{agencyData.equipment.critical}</div>
                  <div className="text-xs text-gray-600">Critiques</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-xl font-bold text-gray-600">{agencyData.equipment.total}</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleContactManager} className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Contacter le responsable
            </Button>
            <Button variant="outline" onClick={handleViewSchedule}>
              <Clock className="w-4 h-4 mr-2" />
              Voir planning
            </Button>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
