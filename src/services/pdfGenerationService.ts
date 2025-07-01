import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PDFHeader {
  title: string;
  subtitle?: string;
  date: string;
  logo?: string;
}

interface PDFTableData {
  headers: string[];
  rows: (string | number)[][];
}

interface PDFSection {
  title: string;
  content: string | PDFTableData;
  type: 'text' | 'table';
}

export class PDFGenerationService {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageWidth: number;
  private margins = { left: 20, right: 20, top: 20, bottom: 20 };

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
  }

  // Méthode principale pour générer un PDF selon le type
  generatePDF(type: 'report' | 'list' | 'receipt', data: any): Blob {
    switch (type) {
      case 'report':
        return this.generateReport(data);
      case 'list':
        return this.generateList(data);
      case 'receipt':
        return this.generateReceipt(data);
      default:
        return this.generateReport(data);
    }
  }

  // Génération d'un rapport (style document)
  private generateReport(data: any): Blob {
    this.addHeader({
      title: data.title || 'Rapport de maintenance',
      subtitle: data.subtitle || 'GulfMaintain - Système de gestion',
      date: new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });

    this.addSeparator();

    // Sections du rapport
    if (data.sections) {
      data.sections.forEach((section: PDFSection) => {
        this.addSection(section);
      });
    }

    // Statistiques si disponibles
    if (data.stats) {
      this.addStatsSection(data.stats);
    }

    return new Blob([this.doc.output('arraybuffer')], { type: 'application/pdf' });
  }

  // Génération d'une liste/tableau
  private generateList(data: any): Blob {
    this.addHeader({
      title: data.title || 'Liste des données',
      date: new Date().toLocaleDateString('fr-FR')
    });

    this.addSeparator();

    if (data.tableData) {
      this.addTable(data.tableData);
    }

    // Résumé en bas
    if (data.summary) {
      this.addSummary(data.summary);
    }

    return new Blob([this.doc.output('arraybuffer')], { type: 'application/pdf' });
  }

  // Génération d'un reçu (style Orange Money)
  private generateReceipt(data: any): Blob {
    // En-tête avec logo (simulé)
    this.doc.setFontSize(16);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('🔧 GulfMaintain', this.margins.left, this.currentY);
    
    // Logo simulé (carré orange)
    this.doc.setFillColor(255, 165, 0);
    this.doc.rect(this.pageWidth - 40, 10, 20, 15, 'F');

    this.currentY += 25;

    // Titre du reçu
    this.doc.setFontSize(20);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(data.title || 'Reçu de maintenance', this.margins.left, this.currentY);

    this.currentY += 10;
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(`Date d'édition : ${new Date().toLocaleDateString('fr-FR')}`, 
                  this.margins.left, this.currentY);

    this.currentY += 20;

    // Nature de l'intervention
    this.addReceiptSection('Nature de l\'intervention', data.type || 'Maintenance préventive');

    // Technicien
    if (data.technician) {
      this.addReceiptSection('Technicien', '', [
        { label: 'Nom', value: data.technician.name || 'Non spécifié' },
        { label: 'Contact', value: data.technician.phone || 'Non spécifié' }
      ]);
    }

    // Détails de l'intervention
    if (data.intervention) {
      this.addReceiptSection('Intervention', '', [
        { label: 'N° Intervention', value: data.intervention.id || 'N/A' },
        { label: 'Date', value: data.intervention.date || new Date().toLocaleDateString('fr-FR') },
        { label: 'Durée', value: data.intervention.duration || 'Non spécifiée' },
        { label: 'Coût', value: data.intervention.cost || '0 F CFA' }
      ]);
    }

    // Équipement
    if (data.equipment) {
      this.addReceiptSection('Équipement', '', [
        { label: 'Type', value: data.equipment.type || 'Non spécifié' },
        { label: 'N° Série', value: data.equipment.serial || 'Non spécifié' },
        { label: 'Localisation', value: data.equipment.location || 'Non spécifiée' }
      ]);
    }

    return new Blob([this.doc.output('arraybuffer')], { type: 'application/pdf' });
  }

  // Méthodes utilitaires
  private addHeader(header: PDFHeader) {
    this.doc.setFontSize(18);
    this.doc.setFont(undefined, 'bold');
    
    // Titre centré
    const titleWidth = this.doc.getTextWidth(header.title);
    const titleX = (this.pageWidth - titleWidth) / 2;
    this.doc.text(header.title, titleX, this.currentY);
    
    this.currentY += 15;

    if (header.subtitle) {
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'normal');
      const subtitleWidth = this.doc.getTextWidth(header.subtitle);
      const subtitleX = (this.pageWidth - subtitleWidth) / 2;
      this.doc.text(header.subtitle, subtitleX, this.currentY);
      this.currentY += 10;
    }

    // Date
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    const dateWidth = this.doc.getTextWidth(header.date);
    const dateX = (this.pageWidth - dateWidth) / 2;
    this.doc.text(header.date, dateX, this.currentY);
    this.currentY += 15;
  }

  private addSeparator() {
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margins.left, this.currentY, this.pageWidth - this.margins.right, this.currentY);
    this.currentY += 10;
  }

  private addSection(section: PDFSection) {
    // Titre de section
    this.doc.setFontSize(14);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(section.title, this.margins.left, this.currentY);
    this.currentY += 10;

    if (section.type === 'text' && typeof section.content === 'string') {
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'normal');
      const lines = this.doc.splitTextToSize(section.content, this.pageWidth - this.margins.left - this.margins.right);
      this.doc.text(lines, this.margins.left, this.currentY);
      this.currentY += lines.length * 5 + 10;
    } else if (section.type === 'table' && typeof section.content === 'object') {
      this.addTable(section.content as PDFTableData);
    }
  }

  private addTable(tableData: PDFTableData) {
    (this.doc as any).autoTable({
      head: [tableData.headers],
      body: tableData.rows,
      startY: this.currentY,
      margin: { left: this.margins.left, right: this.margins.right },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [255, 165, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15;
  }

  private addReceiptSection(title: string, content?: string, details?: Array<{label: string, value: string}>) {
    // Titre de section
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text(title, this.margins.left, this.currentY);
    this.currentY += 8;

    if (content) {
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(content, this.margins.left, this.currentY);
      this.currentY += 8;
    }

    if (details) {
      details.forEach(detail => {
        this.doc.setFontSize(10);
        this.doc.setFont(undefined, 'normal');
        this.doc.text(detail.label, this.margins.left, this.currentY);
        this.doc.text(detail.value, this.pageWidth - this.margins.right - this.doc.getTextWidth(detail.value), this.currentY);
        this.currentY += 6;
      });
    }

    // Ligne de séparation
    this.doc.setLineWidth(0.2);
    this.doc.line(this.margins.left, this.currentY + 2, this.pageWidth - this.margins.right, this.currentY + 2);
    this.currentY += 10;
  }

  private addStatsSection(stats: any) {
    this.addSection({
      title: 'Statistiques',
      type: 'table',
      content: {
        headers: ['Indicateur', 'Valeur'],
        rows: Object.entries(stats).map(([key, value]) => [key, String(value)])
      }
    });
  }

  private addSummary(summary: string) {
    this.currentY += 10;
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'italic');
    const lines = this.doc.splitTextToSize(summary, this.pageWidth - this.margins.left - this.margins.right);
    this.doc.text(lines, this.margins.left, this.currentY);
  }
}
