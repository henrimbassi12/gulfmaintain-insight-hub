
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from 'sonner';
import { useReports } from '@/hooks/useReports';
import { MaintenanceReport } from '@/types/maintenance';

interface EquipmentHistoryExportProps {
  equipmentId?: string;
  className?: string;
  reports?: MaintenanceReport[];
}

export function EquipmentHistoryExport({ equipmentId, className, reports: passedReports }: EquipmentHistoryExportProps) {
  const { reports: allReports } = useReports();
  const reports = passedReports || allReports;

  const handleExportHistory = () => {
    // Filtrer par équipement si un ID est fourni
    const filteredReports = equipmentId 
      ? reports.filter(report => report.equipment.includes(equipmentId) || report.report_id.includes(equipmentId))
      : reports;

    // Transformer les données pour l'export
    const historyData = {
      equipment_id: equipmentId || 'ALL_EQUIPMENT',
      export_date: new Date().toISOString(),
      total_reports: filteredReports.length,
      history: filteredReports.map(report => ({
        id: report.id,
        report_id: report.report_id,
        date: report.date,
        type: report.type,
        equipment: report.equipment,
        equipment_brand: report.equipment_brand,
        equipment_model: report.equipment_model,
        equipment_serial_number: report.equipment_serial_number,
        technician: report.technician,
        assigned_technician: report.assigned_technician,
        duration: report.duration,
        description: report.description,
        notes: report.notes,
        location: report.location,
        region: report.region,
        status: report.status,
        priority: report.priority,
        cost: report.cost,
        completion_percentage: report.completion_percentage,
        parts_used: report.parts_used,
        next_maintenance_date: report.next_maintenance_date,
        created_at: report.created_at,
        updated_at: report.updated_at
      })),
      summary: {
        total_interventions: filteredReports.length,
        total_cost: filteredReports.reduce((sum, report) => sum + Number(report.cost), 0),
        average_cost: filteredReports.length > 0 
          ? filteredReports.reduce((sum, report) => sum + Number(report.cost), 0) / filteredReports.length 
          : 0,
        completed_reports: filteredReports.filter(r => r.status === 'Terminé').length,
        pending_reports: filteredReports.filter(r => r.status === 'En cours').length,
        planned_reports: filteredReports.filter(r => r.status === 'Planifié').length,
        latest_intervention: filteredReports.length > 0 
          ? Math.max(...filteredReports.map(r => new Date(r.date).getTime()))
          : null,
        regions: [...new Set(filteredReports.map(r => r.region))],
        technicians: [...new Set(filteredReports.map(r => r.technician))],
        equipment_types: [...new Set(filteredReports.map(r => r.equipment))]
      }
    };

    // Export JSON
    const jsonStr = JSON.stringify(historyData, null, 2);
    const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
    
    // Export CSV pour l'historique
    const csvHeaders = [
      'ID Rapport',
      'Date',
      'Type',
      'Équipement',
      'Marque',
      'Modèle',
      'N° Série',
      'Technicien',
      'Technicien Assigné',
      'Durée',
      'Description',
      'Notes',
      'Lieu',
      'Région',
      'Statut',
      'Priorité',
      'Coût (FCFA)',
      'Avancement (%)',
      'Pièces Utilisées',
      'Prochaine Maintenance',
      'Créé le',
      'Modifié le'
    ];
    
    const csvRows = historyData.history.map(report => [
      report.report_id,
      new Date(report.date).toLocaleDateString('fr-FR'),
      report.type,
      report.equipment,
      report.equipment_brand || '',
      report.equipment_model || '',
      report.equipment_serial_number || '',
      report.technician,
      report.assigned_technician || '',
      report.duration,
      report.description,
      report.notes || '',
      report.location,
      report.region,
      report.status,
      report.priority || '',
      report.cost,
      report.completion_percentage || '',
      report.parts_used?.join('; ') || '',
      report.next_maintenance_date ? new Date(report.next_maintenance_date).toLocaleDateString('fr-FR') : '',
      new Date(report.created_at).toLocaleDateString('fr-FR'),
      new Date(report.updated_at).toLocaleDateString('fr-FR')
    ]);
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Télécharger les fichiers
    const date = new Date().toISOString().split('T')[0];
    const filePrefix = equipmentId ? `historique-${equipmentId}` : 'historique-complet';
    
    // JSON
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `${filePrefix}-${date}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
    
    // CSV
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `${filePrefix}-${date}.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);

    const exportedCount = historyData.history.length;
    toast.success(`${exportedCount} rapport(s) d'historique exporté(s) (JSON + CSV)`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExportHistory}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      Exporter historique
    </Button>
  );
}
