import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, MapPin, Package, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { MaintenanceReport } from '@/types/maintenance';

interface ReportDetailsModalProps {
  report: MaintenanceReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportDetailsModal({ report, isOpen, onClose }: ReportDetailsModalProps) {
  if (!report) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Terminé': { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle },
      'En cours': { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: AlertCircle },
      'Planifié': { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Calendar }
    };
    return statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: AlertCircle };
  };

  const getTypeBadge = (type: string) => {
    const typeColors = {
      'Préventive': 'bg-blue-50 text-blue-700 border-blue-200',
      'Corrective': 'bg-orange-50 text-orange-700 border-orange-200',
      'Urgente': 'bg-red-50 text-red-700 border-red-200'
    };
    return typeColors[type as keyof typeof typeColors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      'high': 'bg-red-50 text-red-700 border-red-200',
      'medium': 'bg-orange-50 text-orange-700 border-orange-200',
      'low': 'bg-green-50 text-green-700 border-green-200'
    };
    return priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const StatusIcon = getStatusBadge(report.status).icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            Détails du rapport - {report.report_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Statut et badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={`text-sm px-3 py-1 ${getStatusBadge(report.status).color}`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {report.status}
            </Badge>
            <Badge className={`text-sm px-3 py-1 ${getTypeBadge(report.type)}`}>
              {report.type}
            </Badge>
            <Badge className={`text-sm px-3 py-1 ${getPriorityBadge(report.priority)}`}>
              Priorité {report.priority === 'high' ? 'Haute' : report.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </Badge>
            <div className="ml-auto text-sm text-gray-500">
              {report.completion_percentage}% complété
            </div>
          </div>

          <Separator />

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Équipement
              </h3>
              <div className="pl-7 space-y-2">
                <p><span className="font-medium">Nom:</span> {report.equipment}</p>
                {report.equipment_brand && <p><span className="font-medium">Marque:</span> {report.equipment_brand}</p>}
                {report.equipment_model && <p><span className="font-medium">Modèle:</span> {report.equipment_model}</p>}
                {report.equipment_serial_number && <p><span className="font-medium">N° Série:</span> {report.equipment_serial_number}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Localisation
              </h3>
              <div className="pl-7 space-y-2">
                <p><span className="font-medium">Lieu:</span> {report.location}</p>
                <p><span className="font-medium">Région:</span> {report.region}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personnel et temps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personnel
              </h3>
              <div className="pl-7 space-y-2">
                <p><span className="font-medium">Technicien:</span> {report.technician}</p>
                {report.assigned_technician && (
                  <p><span className="font-medium">Assigné à:</span> {report.assigned_technician}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Planification
              </h3>
              <div className="pl-7 space-y-2">
                <p><span className="font-medium">Date:</span> {new Date(report.date).toLocaleDateString('fr-FR')}</p>
                <p><span className="font-medium">Durée:</span> {report.duration}</p>
                {report.next_maintenance_date && (
                  <p><span className="font-medium">Prochaine maintenance:</span> {new Date(report.next_maintenance_date).toLocaleDateString('fr-FR')}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description et notes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Description des travaux</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{report.description}</p>
            </div>
          </div>

          {report.notes && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Notes additionnelles</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 whitespace-pre-wrap">{report.notes}</p>
              </div>
            </div>
          )}

          {/* Pièces utilisées */}
          {report.parts_used && report.parts_used.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Pièces utilisées</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {report.parts_used.map((part, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                    <p className="text-gray-700">{part}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Coût et métadonnées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Coût
              </h3>
              <div className="pl-7">
                <p className="text-2xl font-bold text-green-600">{report.cost.toLocaleString('fr-FR')} FCFA</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Métadonnées
              </h3>
              <div className="pl-7 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Créé le:</span> {new Date(report.created_at).toLocaleString('fr-FR')}</p>
                <p><span className="font-medium">Modifié le:</span> {new Date(report.updated_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}