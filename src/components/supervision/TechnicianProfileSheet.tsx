
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Star, Clock, Wrench, Award, Phone, Mail } from "lucide-react";
import { TechnicianRecommendation } from '@/types/supervision';

interface TechnicianProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  technician: TechnicianRecommendation | null;
}

export const TechnicianProfileSheet: React.FC<TechnicianProfileSheetProps> = ({ isOpen, onClose, technician }) => {
  if (!technician) return null;
  
  const getAvailabilityColor = (availability: string) => {
    return availability.toLowerCase().includes("disponible") ? "text-green-600" : "text-orange-600";
  };


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[450px] sm:max-w-[450px] overflow-y-auto">
        <SheetHeader className="mb-6 text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-gray-500" />
            </div>
          <SheetTitle className="text-2xl font-bold">{technician.technician}</SheetTitle>
          <SheetDescription>
            Profil du technicien
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">

            <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className={getAvailabilityColor(technician.availability)}>{technician.availability}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>Basé à {technician.location}</span>
                </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                        <p className="font-medium text-gray-800">Expérience</p>
                        <p className="text-gray-600">{technician.experience}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                        <p className="font-medium text-gray-800">Taux de réussite</p>
                        <p className="text-gray-600">{technician.success_rate}% sur interventions similaires</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                        <p className="font-medium text-gray-800">Domaines d'expertise</p>
                         <div className="flex flex-wrap gap-1 mt-1">
                            {technician.expertise.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                 <h4 className="font-semibold mb-3 flex items-center gap-2">
                    Score de Compatibilité
                 </h4>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all ${
                          technician.match_score >= 90 ? 'bg-green-500' :
                          technician.match_score >= 70 ? 'bg-blue-500' : 
                          'bg-gray-500'
                        }`}
                        style={{ width: `${technician.match_score}%` }}
                      />
                 </div>
                 <p className="text-center text-lg font-bold mt-2">{technician.match_score}%</p>
                 <p className="text-xs text-center text-gray-500">Pour {technician.equipment_name} à {technician.location}</p>
            </div>

             <Separator />
            
            <div>
                 <h4 className="font-semibold mb-3 flex items-center gap-2">
                    Contacter
                 </h4>
                <div className="space-y-2">
                     <div className="flex items-center justify-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">Appeler (numéro masqué)</span>
                     </div>
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">Envoyer un message</span>
                     </div>
                </div>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
