
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface MaintenanceScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MaintenanceScheduleModal({ isOpen, onClose }: MaintenanceScheduleModalProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();

  const scheduledMaintenances = [
    {
      id: "MAINT-001",
      equipment: "FR-2024-089",
      type: "Maintenance préventive",
      date: "2024-01-22",
      time: "09:00",
      technician: "Ahmed Benali",
      location: "Casablanca - Zone A",
      status: "planned"
    },
    {
      id: "MAINT-002", 
      equipment: "FR-2024-156",
      type: "Inspection",
      date: "2024-01-22",
      time: "14:30",
      technician: "Fatima Zahra",
      location: "Rabat - Centre",
      status: "confirmed"
    },
    {
      id: "MAINT-003",
      equipment: "FR-2024-203",
      type: "Maintenance corrective",
      date: "2024-01-23",
      time: "10:15",
      technician: "Mohamed Alami",
      location: "Marrakech - Gueliz",
      status: "pending"
    }
  ];

  const handleScheduleNew = () => {
    toast({
      title: "✅ Planification",
      description: "Redirection vers le formulaire de planification...",
    });
  };

  const handleReschedule = (maintenanceId: string) => {
    toast({
      title: "Reprogrammation",
      description: `Maintenance ${maintenanceId} reprogrammée`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            Planning de maintenance
          </DialogTitle>
          <DialogDescription>
            Consultez et gérez le planning des maintenances programmées
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendrier */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendrier</CardTitle>
                <CardDescription>Sélectionnez une date pour voir les maintenances</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="mt-4">
                  <Button onClick={handleScheduleNew} className="w-full">
                    Programmer nouvelle maintenance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des maintenances */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenances programmées</CardTitle>
                <CardDescription>Prochaines interventions de maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledMaintenances.map((maintenance) => (
                  <div key={maintenance.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-blue-600">{maintenance.id}</span>
                          <Badge 
                            variant={
                              maintenance.status === 'confirmed' ? 'default' :
                              maintenance.status === 'planned' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {maintenance.status === 'confirmed' ? 'Confirmé' :
                             maintenance.status === 'planned' ? 'Planifié' : 'En attente'}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm mt-1">{maintenance.type}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {maintenance.date} à {maintenance.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {maintenance.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {maintenance.technician}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReschedule(maintenance.id)}
                        className="text-xs"
                      >
                        Reprogrammer
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Détails
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button>
            Exporter planning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
