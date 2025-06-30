
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User, MapPin, Wrench, Calendar, Brain, Edit } from "lucide-react";
import { toast } from 'sonner';
import { MaintenanceStatusButton } from './MaintenanceStatusButton';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(maintenance?.status || 'planned');
  const [currentStatus, setCurrentStatus] = useState(maintenance?.status || 'planned');

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
      case 'prevu': return 'bg-purple-100 text-purple-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in-progress': return 'En cours';
      case 'planned': return 'Planifié';
      case 'prevu': return 'Prévu';
      case 'urgent': return 'Urgent';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const handleStatusUpdate = () => {
    setCurrentStatus(newStatus);
    onUpdateStatus(newStatus);
    setIsEditModalOpen(false);
    toast.success(`Statut mis à jour vers: ${getStatusText(newStatus)}`);
  };

  const handleStartMaintenance = () => {
    setCurrentStatus('in-progress');
    onUpdateStatus('in-progress');
    toast.success('Maintenance démarrée');
  };

  const handleCompleteMaintenance = () => {
    setCurrentStatus('completed');
    onUpdateStatus('completed');
    toast.success('Maintenance terminée');
  };

  const aiRiskLevel = maintenance.equipment === 'FR-2024-012' ? 83 : 
                     maintenance.equipment === 'FR-2024-045' ? 67 : null;

  const history = [
    { date: '2024-01-28 14:30', action: 'Intervention créée', user: 'Système' },
    { date: '2024-01-28 15:45', action: 'Technicien assigné', user: 'Manager' },
    { date: '2024-01-29 09:00', action: 'Intervention démarrée', user: maintenance.technician },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader className="space-y-3">
            <SheetTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-left">
              <span className="break-words">{maintenance.type || maintenance.equipment}</span>
              <Badge className={getStatusColor(currentStatus)}>
                {getStatusText(currentStatus)}
              </Badge>
            </SheetTitle>
            <SheetDescription className="text-left">
              ID: {maintenance.id}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
            {/* AI Risk Alert */}
            {aiRiskLevel && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700">
                  <Brain className="w-4 h-4 flex-shrink-0" />
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

            {/* Main Info - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="break-words">{maintenance.scheduledDate || maintenance.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="break-words">{maintenance.timeSlot || maintenance.time} ({maintenance.duration || '2h'})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="break-words">{maintenance.location}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="break-words">{maintenance.technician}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wrench className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="break-words">{maintenance.type}</span>
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
                <p className="font-medium break-words">{maintenance.equipment}</p>
                <p className="text-sm text-gray-600 break-words">Client: {maintenance.client}</p>
              </div>
            </div>

            {/* Status Actions - Responsive Layout */}
            <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
              <MaintenanceStatusButton
                status={currentStatus}
                onStart={handleStartMaintenance}
                onComplete={handleCompleteMaintenance}
              />
              
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)} className="w-full sm:w-auto">
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
            </div>

            <Separator />

            {/* History */}
            <div>
              <h3 className="font-semibold mb-3">Historique</h3>
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium break-words">{entry.action}</p>
                      <p className="text-xs text-gray-500 break-words">{entry.date} - {entry.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Modal d'édition de statut */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Modifier le statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nouveau statut
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="prevu">Prévu</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={handleStatusUpdate} className="flex-1">
                Mettre à jour
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaintenanceDetails;
