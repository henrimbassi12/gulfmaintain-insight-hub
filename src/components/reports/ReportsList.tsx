import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Edit, Trash2, Download } from 'lucide-react';
import { MaintenanceReport } from '@/types/maintenance';
import { useAuth } from '@/contexts/AuthContext';
import { ReportDetailsModal } from './ReportDetailsModal';
import { ReportEditModal } from './ReportEditModal';
import { toast } from 'sonner';

interface ReportsListProps {
  reports: MaintenanceReport[];
  onUpdateReport: (id: string, updates: Partial<MaintenanceReport>) => Promise<any>;
  onDeleteReport: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ReportsList({ reports, onUpdateReport, onDeleteReport, isLoading }: ReportsListProps) {
  const { userProfile } = useAuth();
  const [selectedReport, setSelectedReport] = useState<MaintenanceReport | null>(null);
  const [editingReport, setEditingReport] = useState<MaintenanceReport | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isAdmin = userProfile?.role === 'admin';

  const handleViewDetails = (report: MaintenanceReport) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleEditReport = (report: MaintenanceReport) => {
    if (!isAdmin) {
      toast.error('Seuls les administrateurs peuvent modifier les rapports');
      return;
    }
    setEditingReport(report);
    setShowEditModal(true);
  };

  const handleDeleteReport = async (report: MaintenanceReport) => {
    if (!isAdmin) {
      toast.error('Seuls les administrateurs peuvent supprimer les rapports');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le rapport "${report.report_id}" ?`)) {
      try {
        await onDeleteReport(report.id);
        toast.success('Rapport supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression du rapport');
      }
    }
  };

  const handleDownloadReport = (report: MaintenanceReport) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Téléchargement du rapport "${report.report_id}"...`,
        success: `Rapport "${report.report_id}" téléchargé avec succès`,
        error: 'Erreur lors du téléchargement'
      }
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Terminé': 'bg-green-50 text-green-700 border-green-200',
      'En cours': 'bg-orange-50 text-orange-700 border-orange-200',
      'Planifié': 'bg-blue-50 text-blue-700 border-blue-200'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-50 text-gray-700 border-gray-200';
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

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Rapports de maintenance
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              {reports.length} rapports
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {reports.length === 0 ? (
            <div className="text-center py-8 px-6">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rapport disponible</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="py-4 px-6 font-semibold">ID Rapport</th>
                    <th className="py-4 px-6 font-semibold">Équipement</th>
                    <th className="py-4 px-6 font-semibold">Technicien</th>
                    <th className="py-4 px-6 font-semibold">Type</th>
                    <th className="py-4 px-6 font-semibold">Priorité</th>
                    <th className="py-4 px-6 font-semibold">Statut</th>
                    <th className="py-4 px-6 font-semibold">Date</th>
                    <th className="py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{report.report_id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-medium text-gray-900">{report.equipment}</span>
                          {report.equipment_brand && (
                            <p className="text-sm text-gray-600">{report.equipment_brand}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{report.technician}</td>
                      <td className="py-4 px-6">
                        <Badge className={`text-xs ${getTypeBadge(report.type)}`}>
                          {report.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={`text-xs ${getPriorityBadge(report.priority)}`}>
                          {report.priority === 'high' ? 'Haute' : report.priority === 'medium' ? 'Moyenne' : 'Basse'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge className={`text-xs ${getStatusBadge(report.status)}`}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(report.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleViewDetails(report)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={() => handleEditReport(report)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleDownloadReport(report)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                          
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteReport(report)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedReport(null);
        }}
      />

      <ReportEditModal
        report={editingReport}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingReport(null);
        }}
        onSave={onUpdateReport}
      />
    </>
  );
}