
import { useState } from 'react';
import { toast } from 'sonner';

interface ReportData {
  title: string;
  type: string;
  date: string;
  status: string;
  size: string;
}

export function useReportGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (reportType: string = 'general') => {
    setIsGenerating(true);
    
    try {
      toast.loading('Génération du rapport en cours...', { duration: 2000 });
      
      // Simulation de la génération du rapport
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Création d'un blob PDF simulé
      const pdfContent = generatePDFContent(reportType);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Téléchargement automatique
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Rapport généré et téléchargé avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.dismiss();
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadExistingReport = async (report: ReportData) => {
    try {
      toast.loading('Téléchargement en cours...');
      
      // Simulation du téléchargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Création du fichier simulé
      const content = generateReportContent(report);
      const blob = new Blob([content], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success(`Rapport "${report.title}" téléchargé avec succès !`);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.dismiss();
      toast.error('Erreur lors du téléchargement du rapport');
    }
  };

  return {
    generateReport,
    downloadExistingReport,
    isGenerating
  };
}

function generatePDFContent(reportType: string): string {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(GulfMaintain - Rapport ${reportType}) Tj
0 -20 Td
(Date: ${new Date().toLocaleDateString('fr-FR')}) Tj
0 -20 Td
(Ce rapport a été généré automatiquement.) Tj
0 -40 Td
(Contenu du rapport de maintenance...) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000136 00000 n 
0000000271 00000 n 
0000000535 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
634
%%EOF`;
}

function generateReportContent(report: ReportData): string {
  return generatePDFContent(report.type);
}
