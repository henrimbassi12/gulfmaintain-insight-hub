import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserPlus, Star, MapPin, Clock, CheckCircle, Brain, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface TechnicianAssignmentModalProps {
  prediction: any;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignmentData: any) => void;
}

const availableTechnicians = [
  {
    id: '1',
    name: 'Jean Mballa',
    specialization: ['Réfrigération', 'Climatisation'],
    experience: '8 ans',
    rating: 4.8,
    availability: 'Disponible',
    location: 'Douala Centre',
    successRate: 95,
    phone: '+237 678 123 456',
    email: 'jean.mballa@company.com',
    certifications: ['Certifié Coca-Cola', 'Expert Froid Commercial']
  },
  {
    id: '2',
    name: 'Marie Ngono',
    specialization: ['Électricité', 'Maintenance'],
    experience: '6 ans',
    rating: 4.6,
    availability: 'Occupé',
    location: 'Douala Akwa',
    successRate: 92,
    phone: '+237 678 123 457',
    email: 'marie.ngono@company.com',
    certifications: ['Électricien Certifié', 'Maintenance Préventive']
  },
  {
    id: '3',
    name: 'Paul Atangana',
    specialization: ['Diagnostic', 'Réparation'],
    experience: '10 ans',
    rating: 4.9,
    availability: 'Disponible',
    location: 'Douala Bonapriso',
    successRate: 98,
    phone: '+237 678 123 458',
    email: 'paul.atangana@company.com',
    certifications: ['Expert Diagnostic', 'Formateur Agréé']
  },
  {
    id: '4',
    name: 'Grace Fouda',
    specialization: ['Réfrigération', 'Électricité'],
    experience: '5 ans',
    rating: 4.7,
    availability: 'Disponible',
    location: 'Douala Bonanjo',
    successRate: 94,
    phone: '+237 678 123 459',
    email: 'grace.fouda@company.com',
    certifications: ['Technicienne Frigoriste', 'Sécurité Électrique']
  }
];

export function TechnicianAssignmentModal({ prediction, isOpen, onClose, onAssign }: TechnicianAssignmentModalProps) {
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTechnician) {
      toast.error('Veuillez sélectionner un technicien');
      return;
    }

    const technicianData = availableTechnicians.find(t => t.id === selectedTechnician);
    
    const assignmentData = {
      technician: technicianData?.name,
      technicianId: selectedTechnician,
      notes,
      urgency,
      equipment_id: prediction?.equipment_id,
      prediction_id: prediction?.id,
      assignedAt: new Date().toISOString()
    };

    onAssign(assignmentData);
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'Disponible':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'Occupé':
        return <Badge className="bg-red-100 text-red-800">Occupé</Badge>;
      case 'En pause':
        return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!prediction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">Assigner un technicien</div>
              <div className="text-sm text-gray-500 font-normal">
                Pour l'équipement {prediction.equipment_name} ({prediction.equipment_id})
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Informations sur la prédiction */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800">Intervention recommandée par l'IA</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Type:</span>
              <span className="ml-2 font-medium">{prediction.predicted_status.replace(/_/g, ' ')}</span>
            </div>
            <div>
              <span className="text-gray-600">Durée estimée:</span>
              <span className="ml-2 font-medium">{prediction.estimated_duration_hours}h</span>
            </div>
            <div>
              <span className="text-gray-600">Compétences requises:</span>
              <div className="mt-1">
                {prediction.required_skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Pièces recommandées:</span>
              <div className="mt-1">
                {prediction.recommended_parts.map((part: string, index: number) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                    {part}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Liste des techniciens disponibles */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Techniciens disponibles
            </Label>
            <div className="grid gap-4">
              {availableTechnicians.map((technician) => (
                <div
                  key={technician.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTechnician === technician.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTechnician(technician.id)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {technician.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{technician.name}</h3>
                        <div className="flex items-center gap-2">
                          {getAvailabilityBadge(technician.availability)}
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{technician.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{technician.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{technician.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>{technician.successRate}% succès</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          <Mail className="w-3 h-3" />
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-sm text-gray-600 mb-1">Spécialisations:</div>
                        <div className="flex flex-wrap gap-1">
                          {technician.specialization.map((spec, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="text-sm text-gray-600 mb-1">Certifications:</div>
                        <div className="flex flex-wrap gap-1">
                          {technician.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgence */}
          <div>
            <Label htmlFor="urgency" className="text-sm font-medium">
              Niveau d'urgence
            </Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <span className="text-green-600">Faible - Maintenance préventive</span>
                </SelectItem>
                <SelectItem value="normal">
                  <span className="text-blue-600">Normal - Maintenance programmée</span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="text-orange-600">Élevé - Intervention rapide</span>
                </SelectItem>
                <SelectItem value="urgent">
                  <span className="text-red-600">Urgent - Intervention immédiate</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes d'assignation */}
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes pour le technicien
            </Label>
            <Textarea
              id="notes"
              placeholder="Instructions spéciales, outils nécessaires, précautions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Assigner le technicien
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}