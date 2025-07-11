
import { useState } from 'react';
import { toast } from 'sonner';
import { PDFGenerationService } from '@/services/pdfGenerationService';

interface ReportData {
  title: string;
  type: string;
  date: string;
  status: string;
  size: string;
}

export function useReportGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (reportType: string = 'general', reportData?: any) => {
    setIsGenerating(true);
    
    try {
      toast.loading('Génération du rapport PDF en cours...', { duration: 2000 });
      
      // Simulation de la génération du rapport avec délai
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pdfService = new PDFGenerationService();
      
      // Préparer les données selon le type de rapport
      let pdfData;
      
      switch (reportType) {
        case 'maintenance':
          pdfData = {
            title: 'Rapport de Maintenance',
            subtitle: 'GulfMaintain - Suivi des interventions',
            sections: [
              {
                title: 'Résumé Exécutif',
                type: 'text',
                content: 'Ce rapport présente un aperçu complet des activités de maintenance effectuées durant la période sélectionnée. Il inclut les statistiques clés, les interventions réalisées et les recommandations pour l\'optimisation future.'
              },
              {
                title: 'Statistiques des Interventions',
                type: 'table',
                content: {
                  headers: ['Type', 'Nombre', 'Durée Moyenne', 'Coût Total'],
                  rows: [
                    ['Maintenance Préventive', '15', '2h30', '45,000 F CFA'],
                    ['Réparation Urgente', '8', '4h15', '120,000 F CFA'],
                    ['Contrôle de Routine', '22', '1h45', '33,000 F CFA']
                  ]
                }
              }
            ],
            stats: {
              'Total Interventions': 45,
              'Temps Moyen': '2h47min',
              'Taux de Succès': '94%',
              'Coût Total': '198,000 F CFA'
            }
          };
          break;
          
        case 'equipment':
          pdfData = {
            title: 'Inventaire des Équipements',
            sections: [
              {
                title: 'Liste des Équipements',
                type: 'table',
                content: {
                  headers: ['Type', 'N° Série', 'Localisation', 'État', 'Dernière Maintenance'],
                  rows: [
                    ['INNOVA 420', 'INN42015', 'AKWA - Bar Central', 'Bon', '15/06/2025'],
                    ['SANDEN 300', 'SAN30089', 'BONABERI - Restaurant', 'Moyen', '12/06/2025'],
                    ['SUPER-35', 'SUP35001', 'DOUALA - Café', 'Excellent', '20/06/2025']
                  ]
                }
              }
            ],
            summary: `Total: ${reportData?.equipments?.length || 45} équipements recensés. Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}`
          };
          break;
          
        case 'receipt':
          pdfData = {
            title: 'Reçu d\'Intervention',
            type: 'Maintenance préventive',
            technician: {
              name: reportData?.technician || 'VOUKENG',
              phone: '6 55 16 15 63'
            },
            intervention: {
              id: `INT${Date.now().toString().slice(-6)}`,
              date: new Date().toLocaleDateString('fr-FR'),
              duration: reportData?.duration || '2h30',
              cost: reportData?.cost || '25,000 F CFA'
            },
            equipment: {
              type: reportData?.equipment || 'INNOVA 420',
              serial: reportData?.serial || 'INN420156',
              location: reportData?.location || 'AKWA - Bar Central'
            }
          };
          break;
          
        default:
          pdfData = {
            title: 'Rapport Général',
            subtitle: 'GulfMaintain - Vue d\'ensemble',
            sections: [
              {
                title: 'Introduction',
                type: 'text',
                content: 'Ce rapport général présente l\'état actuel du système de maintenance et les principaux indicateurs de performance.'
              }
            ]
          };
      }
      
      // Générer le PDF
      const pdfType = reportType === 'receipt' ? 'receipt' : reportType === 'equipment' ? 'list' : 'report';
      const blob = pdfService.generatePDF(pdfType as any, pdfData);
      
      // Vérifier que le blob est bien un PDF
      if (blob.type !== 'application/pdf') {
        throw new Error('Erreur de génération PDF');
      }
      
      // Téléchargement automatique
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
      link.setAttribute('type', 'application/pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Rapport PDF généré et téléchargé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la génération du rapport PDF:', error);
      toast.dismiss();
      toast.error('Erreur lors de la génération du rapport PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadExistingReport = async (report: ReportData) => {
    try {
      toast.loading('Téléchargement du PDF en cours...');
      
      // Simulation du téléchargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Utiliser le nouveau service PDF
      const pdfService = new PDFGenerationService();
      const blob = pdfService.generatePDF('report', {
        title: report.title,
        sections: [
          {
            title: 'Contenu du rapport',
            type: 'text',
            content: `Ce rapport "${report.title}" a été généré le ${report.date}. Type: ${report.type}, Statut: ${report.status}.`
          }
        ]
      });
      
      // Vérifier le type de blob
      if (blob.type !== 'application/pdf') {
        throw new Error('Erreur de génération PDF');
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      link.setAttribute('type', 'application/pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success(`Rapport PDF "${report.title}" téléchargé avec succès !`);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      toast.dismiss();
      toast.error('Erreur lors du téléchargement du rapport PDF');
    }
  };

  const getAvailableReports = () => {
    return [
      {
        id: 1,
        title: 'Rapport mensuel - Janvier 2024',
        type: 'Maintenance',
        date: '31/01/2024',
        status: 'Terminé',
        size: '2.4 MB',
        technician: 'Jean Dupont',
        zone: 'Zone Nord'
      },
      {
        id: 2,
        title: 'Analyse des pannes - Q4 2023',
        type: 'Analyse',
        date: '15/01/2024',
        status: 'Terminé',
        size: '1.8 MB',
        technician: 'Marie Martin',
        zone: 'Zone Sud'
      },
      {
        id: 3,
        title: 'Performance techniciens - Décembre',
        type: 'RH',
        date: '05/01/2024',
        status: 'En cours',
        size: '-',
        technician: 'Paul Durand',
        zone: 'Zone Ouest'
      },
      {
        id: 4,
        title: 'Rapport de coûts - Q4 2023',
        type: 'Financier',
        date: '20/01/2024',
        status: 'Terminé',
        size: '1.2 MB',
        technician: 'Sophie Leroy',
        zone: 'Zone Est'
      }
    ];
  };

  return {
    generateReport,
    downloadExistingReport,
    getAvailableReports,
    isGenerating
  };
}
