
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, Filter, X, Wrench, AlertTriangle, CheckCircle, Clock, Eye, Download, Edit, Trash2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/contexts/AuthContext';
import { PermissionCheck } from '@/components/auth/PermissionCheck';
import { ReportDetailsModal } from '@/components/reports/ReportDetailsModal';
import { ReportEditModal } from '@/components/reports/ReportEditModal';
import { EquipmentHistoryExport } from '@/components/EquipmentHistoryExport';
import { MaintenanceReport } from '@/types/maintenance';
import { toast } from 'sonner';

export function EquipmentHistory() {
  const { userProfile } = useAuth();
  const { reports, isLoading, updateReport, deleteReport } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [filteredReports, setFilteredReports] = useState<MaintenanceReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MaintenanceReport | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      const statusMap: Record<string, string> = {
        'completed': 'Terminé',
        'pending': 'En cours',
        'planned': 'Planifié'
      };
      filtered = filtered.filter(report => report.status === statusMap[statusFilter]);
    }

    if (actionFilter) {
      filtered = filtered.filter(report => report.type === actionFilter);
    }

    // Trier par date décroissante
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, actionFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminé':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'En cours':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Planifié':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Terminé':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
      case 'En cours':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En cours</Badge>;
      case 'Planifié':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Planifié</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const handleViewReport = (report: MaintenanceReport) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  };

  const handleEditReport = (report: MaintenanceReport) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  const handleDeleteReport = async (report: MaintenanceReport) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le rapport ${report.report_id} ?`)) {
      try {
        await deleteReport(report.id);
        toast.success('Rapport supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression du rapport');
      }
    }
  };

  const handleUpdateReport = async (id: string, updates: Partial<MaintenanceReport>) => {
    try {
      await updateReport(id, updates);
      setIsEditModalOpen(false);
      setSelectedReport(null);
      toast.success('Rapport mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du rapport');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setActionFilter('');
  };

  const hasActiveFilters = searchTerm || statusFilter || actionFilter;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-spin" />
              <h3 className="text-lg font-medium mb-2">Chargement de l'historique...</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            Filtres et Actions
            <div className="ml-auto flex items-center gap-2">
              <EquipmentHistoryExport 
                reports={filteredReports} 
                className="text-xs" 
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Effacer
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher équipement, technicien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
                <SelectItem value="planned">Planifié</SelectItem>
              </SelectContent>
            </Select>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Préventive">Préventive</SelectItem>
                <SelectItem value="Corrective">Corrective</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span>Historique des Interventions</span>
            </div>
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {filteredReports.length} résultat{filteredReports.length > 1 ? 's' : ''}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredReports.map((report, index) => (
                <div key={report.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 md:gap-4 flex-1">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusIcon(report.status)}
                        <Wrench className="w-4 h-4 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">
                            {report.equipment}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {report.report_id}
                            </Badge>
                            {getStatusBadge(report.status)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600 mb-3">
                          <div><strong>Type:</strong> {report.type}</div>
                          <div><strong>Technicien:</strong> {report.technician}</div>
                          <div><strong>Date:</strong> {new Date(report.date).toLocaleDateString('fr-FR')}</div>
                          <div><strong>Durée:</strong> {report.duration}</div>
                          <div><strong>Lieu:</strong> {report.location}</div>
                          <div><strong>Coût:</strong> <span className="font-medium text-blue-600">{report.cost.toLocaleString('fr-FR')} FCFA</span></div>
                        </div>
                        
                        <p className="text-gray-700 text-xs md:text-sm bg-gray-50 p-3 rounded-lg mb-3">
                          {report.description}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                            className="text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Voir détails
                          </Button>

                          <PermissionCheck allowedRoles={['admin']}>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditReport(report)}
                              className="text-xs"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Modifier
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteReport(report)}
                              className="text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Supprimer
                            </Button>
                          </PermissionCheck>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {index < filteredReports.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedReport(null);
        }}
      />

      <PermissionCheck allowedRoles={['admin']}>
        <ReportEditModal
          report={selectedReport}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedReport(null);
          }}
          onSave={handleUpdateReport}
        />
      </PermissionCheck>
    </div>
  );
}
