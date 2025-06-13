
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, Clock, Phone, Star } from "lucide-react";

interface TechnicianAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TechnicianAssignmentModal({ isOpen, onClose }: TechnicianAssignmentModalProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  const technicians = [
    {
      id: "tech-001",
      name: "Ahmed Benali",
      specialization: "Électricité",
      status: "available",
      location: "Casablanca",
      phone: "+212 6 12 34 56 78",
      rating: 4.8,
      currentTasks: 0,
      experience: "5 ans",
      lastIntervention: "Il y a 2h"
    },
    {
      id: "tech-002",
      name: "Fatima Zahra",
      specialization: "Climatisation",
      status: "available",
      location: "Rabat",
      phone: "+212 6 87 65 43 21",
      rating: 4.9,
      currentTasks: 1,
      experience: "7 ans",
      lastIntervention: "Il y a 1h"
    },
    {
      id: "tech-003",
      name: "Mohamed Alami",
      specialization: "Mécanique",
      status: "busy",
      location: "Marrakech",
      phone: "+212 6 11 22 33 44",
      rating: 4.6,
      currentTasks: 3,
      experience: "3 ans",
      lastIntervention: "En cours"
    },
    {
      id: "tech-004",
      name: "Youssef Idrissi",
      specialization: "Électronique",
      status: "available",
      location: "Casablanca",
      phone: "+212 6 55 66 77 88",
      rating: 4.7,
      currentTasks: 0,
      experience: "4 ans",
      lastIntervention: "Il y a 30min"
    },
    {
      id: "tech-005",
      name: "Aicha Bennis",
      specialization: "Plomberie",
      status: "unavailable",
      location: "Fès",
      phone: "+212 6 99 88 77 66",
      rating: 4.5,
      currentTasks: 0,
      experience: "6 ans",
      lastIntervention: "Hier"
    }
  ];

  const filteredTechnicians = technicians.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignTechnician = (technicianId: string, technicianName: string) => {
    setSelectedTechnician(technicianId);
    toast({
      title: "✅ Technicien assigné",
      description: `${technicianName} a été assigné à l'intervention`,
    });
    
    setTimeout(() => {
      onClose();
      setSelectedTechnician(null);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Libre</Badge>;
      case 'busy':
        return <Badge className="bg-orange-100 text-orange-800">Occupé</Badge>;
      case 'unavailable':
        return <Badge className="bg-red-100 text-red-800">Indisponible</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-500" />
            Assigner un technicien
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un technicien disponible pour l'intervention
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Barre de recherche */}
          <div>
            <Input
              placeholder="Rechercher par nom, spécialisation ou localisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Liste des techniciens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTechnicians.map((technician) => (
              <Card 
                key={technician.id} 
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedTechnician === technician.id ? 'ring-2 ring-blue-500' : ''
                } ${technician.status === 'unavailable' ? 'opacity-60' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{technician.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {technician.specialization} • {technician.experience}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(technician.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {technician.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {technician.phone}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{technician.rating}/5</span>
                    </div>
                    <span>Tâches: {technician.currentTasks}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Dernière intervention: {technician.lastIntervention}
                  </div>
                  
                  {technician.status === 'available' && (
                    <div className="bg-green-50 p-2 rounded text-xs text-green-700">
                      ✅ Recommandé - Technicien libre et proche
                    </div>
                  )}
                  
                  <Button
                    onClick={() => handleAssignTechnician(technician.id, technician.name)}
                    disabled={technician.status === 'unavailable'}
                    className="w-full"
                    variant={technician.status === 'available' ? 'default' : 'outline'}
                  >
                    {technician.status === 'available' ? 'Assigner' :
                     technician.status === 'busy' ? 'Assigner (Occupé)' : 'Indisponible'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTechnicians.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun technicien trouvé pour cette recherche
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
