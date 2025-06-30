
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
        id: eq.id,
        date: eq.date,
        technician: eq.technician,
        division: eq.division,
        secteur: eq.secteur,
        partenaire: eq.partenaire,
        ville: eq.ville,
        nom_client: eq.nom_client,
        nom_pdv: eq.nom_pdv,
        tel_barman: eq.tel_barman,
        quartier: eq.quartier,
        localisation: eq.localisation,
        type_frigo: eq.type_frigo,
        af_nf: eq.af_nf,
        branding: eq.branding,
        serial_number: eq.serial_number,
        tag_number: eq.tag_number
      }))
    };

    // Export JSON
    const jsonStr = JSON.stringify(exportData, null, 2);
    const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
    
    // Export CSV
    const csvHeaders = [
      'ID',
      'Date',
      'Technicien',
      'Division',
      'Secteur',
      'Partenaire',
      'Ville',
      'Nom Client',
      'Nom PDV',
      'Tel Barman',
      'Quartier',
      'Localisation',
      'Type Frigo',
      'AF/NF',
      'Branding',
      'N° Série',
      'TAG Number'
    ];
    
    const csvRows = equipments.map(eq => [
      eq.id,
      eq.date,
      eq.technician,
      eq.division,
      eq.secteur,
      eq.partenaire,
      eq.ville,
      eq.nom_client,
      eq.nom_pdv,
      eq.tel_barman,
      eq.quartier,
      eq.localisation,
      eq.type_frigo,
      eq.af_nf,
      eq.branding,
      eq.serial_number,
      eq.tag_number
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
