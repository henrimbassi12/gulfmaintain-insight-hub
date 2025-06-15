
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, MapPin, Calendar, Wrench, BarChart, Server } from "lucide-react";
import { FailurePrediction } from '@/types/supervision';
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PredictionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: FailurePrediction | null;
}

export const PredictionDetails: React.FC<PredictionDetailsProps> = ({ isOpen, onClose, prediction }) => {
  if (!prediction) return null;

  const getRiskColor = (risk: number) => {
    if (risk > 70) return "destructive";
    if (risk >= 30) return "secondary";
    return "outline";
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 70) return "Élevé";
    if (risk >= 30) return "Moyen";
    return "Faible";
  };

  const getTypeLabel = (type: string) => {
    return type === 'AF' ? 'Arrêt Forcé' : 'Non Fonctionnel';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[450px] sm:max-w-[450px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="text-orange-500" />
            Détails de la Prédiction
          </SheetTitle>
          <SheetDescription>
            Analyse détaillée de la prédiction de panne pour l'équipement {prediction.equipment_id}.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{prediction.equipment_name}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={getRiskColor(prediction.failure_risk)} className="text-sm">
                Risque {getRiskLabel(prediction.failure_risk)} - {prediction.failure_risk}%
              </Badge>
              <Badge variant="outline" className="text-sm">{getTypeLabel(prediction.type)}</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">Localisation</p>
                <p className="text-gray-600">{prediction.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-800">Date de prédiction</p>
                <p className="text-gray-600">{format(new Date(prediction.predicted_date), 'PPP', { locale: fr })}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-500" />
              Action Recommandée
            </h4>
            <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md border border-blue-100">{prediction.recommended_action}</p>
          </div>
          
          <Separator />
          
          <div>
             <h4 className="font-semibold mb-3 flex items-center gap-2">
                <BarChart className="w-5 h-5 text-green-500" />
                Niveau de Risque
             </h4>
             <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full transition-all ${
                      prediction.failure_risk > 70 ? 'bg-red-500' :
                      prediction.failure_risk >= 30 ? 'bg-orange-500' : 
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${prediction.failure_risk}%` }}
                  />
             </div>
             <p className="text-center text-lg font-bold mt-2">{prediction.failure_risk}%</p>
          </div>

          <Separator />
          
           <div>
             <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Server className="w-5 h-5 text-gray-500" />
                Informations Techniques
             </h4>
             <div className="text-xs text-gray-500 space-y-1">
                <p>ID Prédiction: {prediction.id}</p>
                <p>ID Équipement: {prediction.equipment_id}</p>
                <p>Créé le: {format(new Date(prediction.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}</p>
             </div>
           </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
