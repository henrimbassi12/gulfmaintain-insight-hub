
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from 'sonner';
import { Equipment } from '@/hooks/useEquipments';

interface EquipmentExportButtonProps {
  equipments: Equipment[];
  className?: string;
}

export function EquipmentExportButton({ equipments, className }: EquipmentExportButtonProps) {
  const handleExport = () => {
    const exportData = {
      date: new Date().toISOString(),
      total: equipments.length,
      equipments: equipments.map(eq => ({
        id: eq.equipment_id,
        type: eq.type,
        brand: eq.brand,
        model: eq.model,
        serial_number: eq.serial_number,
        location: eq.location,
        agency: eq.agency,
        technician: eq.technician,
        status: eq.status,
        temperature: eq.temperature,
        last_maintenance: eq.last_maintenance,
        next_maintenance: eq.next_maintenance
      }))
    };

    // Export JSON
    const jsonStr = JSON.stringify(exportData, null, 2);
    const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
    
    // Export CSV
    const csvHeaders = [
      'ID',
      'Type',
      'Marque',
      'Modèle',
      'N° Série',
      'Localisation',
      'Agence',
      'Technicien',
      'Statut',
      'Température',
      'Dernière maintenance',
      'Prochaine maintenance'
    ];
    
    const csvRows = equipments.map(eq => [
      eq.equipment_id,
      eq.type,
      eq.brand,
      eq.model,
      eq.serial_number,
      eq.location,
      eq.agency,
      eq.technician || '',
      eq.status,
      eq.temperature || '',
      eq.last_maintenance ? new Date(eq.last_maintenance).toLocaleDateString('fr-FR') : '',
      eq.next_maintenance ? new Date(eq.next_maintenance).toLocaleDateString('fr-FR') : ''
    ]);
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Télécharger les deux fichiers
    const date = new Date().toISOString().split('T')[0];
    
    // JSON
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `equipements-${date}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
    
    // CSV
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `equipements-${date}.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);

    toast.success(`${equipments.length} équipements exportés (JSON + CSV)`);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={equipments.length === 0}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      Exporter ({equipments.length})
    </Button>
  );
}
