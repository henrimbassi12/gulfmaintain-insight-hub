
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from 'sonner';
import { Equipment } from '@/hooks/useEquipments';
import { PDFGenerationService } from '@/services/pdfGenerationService';

interface EquipmentExportButtonProps {
  equipments: Equipment[];
  className?: string;
}

export function EquipmentExportButton({ equipments, className }: EquipmentExportButtonProps) {
  const handleExport = async () => {
    try {
      toast.loading('Génération de l\'export en cours...');

      // Générer le PDF avec le nouveau service
      const pdfService = new PDFGenerationService();
      const pdfData = {
        title: 'Inventaire des Équipements',
        tableData: {
          headers: [
            'Date',
            'Technicien',
            'Division',
            'Ville',
            'Client',
            'Type Frigo',
            'N° Série',
            'TAG Number'
          ],
          rows: equipments.map(eq => [
            eq.date,
            eq.technician,
            eq.division,
            eq.ville,
            eq.nom_client,
            eq.type_frigo,
            eq.serial_number,
            eq.tag_number
          ])
        },
        summary: `Export généré le ${new Date().toLocaleDateString('fr-FR')} - Total: ${equipments.length} équipements recensés`
      };

      const blob = pdfService.generatePDF('list', pdfData);

      // Télécharger le PDF
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventaire-equipements-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Export CSV complémentaire
      const csvHeaders = [
        'ID', 'Date', 'Technicien', 'Division', 'Secteur', 'Partenaire',
        'Ville', 'Nom Client', 'Nom PDV', 'Tel Barman', 'Quartier',
        'Localisation', 'Type Frigo', 'AF/NF', 'Branding', 'N° Série', 'TAG Number'
      ];
      
      const csvRows = equipments.map(eq => [
        eq.id, eq.date, eq.technician, eq.division, eq.secteur, eq.partenaire,
        eq.ville, eq.nom_client, eq.nom_pdv, eq.tel_barman, eq.quartier,
        eq.localisation, eq.type_frigo, eq.af_nf, eq.branding, eq.serial_number, eq.tag_number
      ]);
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const csvLink = document.createElement('a');
      csvLink.href = csvUrl;
      csvLink.download = `equipements-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(csvLink);
      csvLink.click();
      document.body.removeChild(csvLink);
      URL.revokeObjectURL(csvUrl);

      toast.dismiss();
      toast.success(`${equipments.length} équipements exportés (PDF + CSV)`);

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.dismiss();
      toast.error('Erreur lors de l\'export');
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={equipments.length === 0}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      Exporter PDF ({equipments.length})
    </Button>
  );
}
