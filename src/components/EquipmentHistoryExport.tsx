
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from 'sonner';

interface EquipmentHistoryExportProps {
  equipmentId?: string;
  className?: string;
}

export function EquipmentHistoryExport({ equipmentId = 'FR-2024-089', className }: EquipmentHistoryExportProps) {
  const handleExportHistory = () => {
    // Données simulées d'historique
    const historyData = {
      equipment_id: equipmentId,
      export_date: new Date().toISOString(),
      history: [
        {
          id: '1',
          date: '2024-01-28T10:30:00Z',
          type: 'maintenance',
          title: 'Maintenance préventive trimestrielle',
          description: 'Nettoyage complet, vérification des joints, contrôle de température',
          technician: 'CÉDRIC MBARGA',
          duration: '2h 30min',
          cost: 350,
          parts: ['Filtre air', 'Joint étanchéité'],
          status: 'completed'
        },
        {
          id: '2',
          date: '2024-01-20T14:15:00Z',
          type: 'repair',
          title: 'Réparation thermostat défaillant',
          description: 'Remplacement du thermostat principal suite à dysfonctionnement',
          technician: 'MBAPBOU GRÉGOIRE',
          duration: '1h 45min',
          cost: 125,
          parts: ['Thermostat digital'],
          status: 'completed'
        },
        {
          id: '3',
          date: '2024-01-15T08:00:00Z',
          type: 'installation',
          title: 'Installation initiale',
          description: 'Installation et mise en service du réfrigérateur professionnel',
          technician: 'VOUKENG JULES',
          duration: '3h 00min',
          cost: 200,
          status: 'completed'
        }
      ],
      summary: {
        total_interventions: 3,
        total_cost: 675,
        average_duration: '2h 25min',
        last_maintenance: '2024-01-28'
      }
    };

    // Export JSON
    const jsonStr = JSON.stringify(historyData, null, 2);
    const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
    
    // Export CSV pour l'historique
    const csvHeaders = [
      'Date',
      'Type',
      'Titre',
      'Description',
      'Technicien',
      'Durée',
      'Coût',
      'Pièces',
      'Statut'
    ];
    
    const csvRows = historyData.history.map(event => [
      new Date(event.date).toLocaleDateString('fr-FR'),
      event.type,
      event.title,
      event.description,
      event.technician,
      event.duration,
      event.cost || '',
      event.parts?.join('; ') || '',
      event.status
    ]);
    
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Télécharger les fichiers
    const date = new Date().toISOString().split('T')[0];
    
    // JSON
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = `historique-${equipmentId}-${date}.json`;
    document.body.appendChild(jsonLink);
    jsonLink.click();
    document.body.removeChild(jsonLink);
    URL.revokeObjectURL(jsonUrl);
    
    // CSV
    const csvUrl = URL.createObjectURL(csvBlob);
    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `historique-${equipmentId}-${date}.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);

    toast.success(`Historique de ${equipmentId} exporté (JSON + CSV)`);
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
