
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Clock, User, MapPin, Wrench, Calendar, Brain, MessageSquare, Edit, CheckCircle } from "lucide-react";

interface MaintenanceDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  maintenance: any;
  onEdit: () => void;
  onUpdateStatus: (status: string) => void;
}

const MaintenanceDetails: React.FC<MaintenanceDetailsProps> = ({ 
  isOpen, 
  onClose, 
  maintenance,
  onEdit,
  onUpdateStatus
}) => {
  if (!maintenance) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'planned': return 'Planifié';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const aiRiskLevel = maintenance.equipment === 'FR-2024-012' ? 83 : 
                     maintenance.equipment === 'FR-2024-045' ? 67 : null;

  const history = [
    { date: '2024-01-28 14:30', action: 'Intervention créée', user: 'Système' },
    { date: '2024-01-28 15:45', action: 'Technicien assigné', user: 'Manager' },
    { date: '2024-01-29 09:00', action: 'Intervention démarrée', user: maintenance.technician },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {maintenance.title}
            <Badge className={getStatusColor(maintenance.status)}>
              {getStatusText(maintenance.status)}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            ID: {maintenance.id}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* AI Risk Alert */}
          {aiRiskLevel && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700">
                <Brain className="w-4 h-4" />
                <span className="font-medium">Analyse IA</span>
                <Badge variant="secondary" className="ml-auto">
                  Risque: {aiRiskLevel}%
                </Badge>
              </div>
              <p className="text-sm text-orange-600 mt-1">
                Ce frigo a un risque de panne NF de {aiRiskLevel}% — Vérifiez tension & température.
              </p>
            </div>
          )}

          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{maintenance.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{maintenance.time} ({maintenance.duration})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{maintenance.location}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span>{maintenance.technician}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wrench className="w-4 h-4 text-gray-500" />
                <span>{maintenance.type}</span>
              </div>
              <div>
                <Badge className={getPriorityColor(maintenance.priority)}>
                  {maintenance.priority === 'high' ? 'Critique' :
                   maintenance.priority === 'medium' ? 'Moyenne' : 'Faible'}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Equipment Info */}
          <div>
            <h3 className="font-semibold mb-2">Équipement concerné</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{maintenance.equipment}</p>
              <p className="text-sm text-gray-600">Réfrigérateur commercial - Marque XYZ</p>
            </div>
          </div>

          {/* Status Actions */}
          <div className="flex gap-2">
            {maintenance.status === 'planned' && (
              <Button 
                size="sm" 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => onUpdateStatus('in-progress')}
              >
                🟢 Démarrer
              </Button>
            )}
            {maintenance.status === 'in-progress' && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onUpdateStatus('completed')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Terminer
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Modifier
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Discussion
            </Button>
          </div>

          <Separator />

          {/* History */}
          <div>
            <h3 className="font-semibold mb-3">Historique</h3>
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{entry.action}</p>
                    <p className="text-xs text-gray-500">{entry.date} - {entry.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MaintenanceDetails;
