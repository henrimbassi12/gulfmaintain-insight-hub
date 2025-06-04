
import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Table, 
  FileSpreadsheet,
  Settings,
  Calendar,
  Filter,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ExportTemplate {
  id: string;
  name: string;
  format: 'pdf' | 'excel' | 'csv';
  fields: string[];
  filters?: string[];
}

interface ExportField {
  id: string;
  label: string;
  category: string;
  required?: boolean;
}

export function DataExport() {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [dateRange, setDateRange] = useState('last-month');
  const { toast } = useToast();

  const templates: ExportTemplate[] = [
    {
      id: 'maintenance-report',
      name: 'Rapport de maintenance',
      format: 'pdf',
      fields: ['equipment_id', 'maintenance_date', 'technician', 'status', 'notes'],
      filters: ['date_range', 'location']
    },
    {
      id: 'equipment-inventory',
      name: 'Inventaire équipements',
      format: 'excel',
      fields: ['equipment_id', 'type', 'location', 'status', 'purchase_date', 'warranty']
    },
    {
      id: 'technician-performance',
      name: 'Performance techniciens',
      format: 'csv',
      fields: ['technician_name', 'interventions_count', 'average_time', 'satisfaction_score']
    }
  ];

  const availableFields: ExportField[] = [
    { id: 'equipment_id', label: 'ID Équipement', category: 'Équipement', required: true },
    { id: 'equipment_type', label: 'Type d\'équipement', category: 'Équipement' },
    { id: 'location', label: 'Localisation', category: 'Équipement' },
    { id: 'status', label: 'Statut', category: 'Équipement' },
    { id: 'maintenance_date', label: 'Date maintenance', category: 'Maintenance' },
    { id: 'technician', label: 'Technicien', category: 'Maintenance' },
    { id: 'notes', label: 'Notes', category: 'Maintenance' },
    { id: 'cost', label: 'Coût', category: 'Finances' },
  ];

  const fieldsByCategory = availableFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExportField[]>);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSelectedFields(template.fields);
      setSelectedFormat(template.format);
    }
  };

  const handleFieldToggle = (fieldId: string) => {
    const field = availableFields.find(f => f.id === fieldId);
    if (field?.required) return; // Ne pas permettre de désélectionner les champs requis

    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un champ à exporter",
        variant: "destructive"
      });
      return;
    }

    const formatLabels = {
      pdf: 'PDF',
      excel: 'Excel',
      csv: 'CSV'
    };

    toast({
      title: "Export en cours",
      description: `Génération du fichier ${formatLabels[selectedFormat]} avec ${selectedFields.length} champs sélectionnés`
    });

    // Simulation de l'export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: `Le fichier a été téléchargé avec succès`
      });
      setOpen(false);
    }, 2000);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />;
      case 'csv': return <Table className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export de données</DialogTitle>
          <DialogDescription>
            Choisissez un template ou personnalisez votre export
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Templates prédéfinis */}
          <div className="space-y-4">
            <h3 className="font-medium">Templates prédéfinis</h3>
            <div className="space-y-2">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-colors ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(template.format)}
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.fields.length} champs inclus
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Configuration personnalisée */}
          <div className="space-y-4">
            <h3 className="font-medium">Configuration</h3>
            
            {/* Format de fichier */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Format de fichier</label>
              <Select value={selectedFormat} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setSelectedFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF
                    </div>
                  </SelectItem>
                  <SelectItem value="excel">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      Excel
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4" />
                      CSV
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Période */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Dernière semaine</SelectItem>
                  <SelectItem value="last-month">Dernier mois</SelectItem>
                  <SelectItem value="last-quarter">Dernier trimestre</SelectItem>
                  <SelectItem value="last-year">Dernière année</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Champs à exporter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Champs à exporter</label>
              <div className="max-h-60 overflow-y-auto space-y-3 border rounded p-3">
                {Object.entries(fieldsByCategory).map(([category, fields]) => (
                  <div key={category}>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">{category}</h4>
                    <div className="space-y-2">
                      {fields.map((field) => (
                        <div key={field.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={field.id}
                            checked={selectedFields.includes(field.id)}
                            onCheckedChange={() => handleFieldToggle(field.id)}
                            disabled={field.required}
                          />
                          <label 
                            htmlFor={field.id} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {field.label}
                            {field.required && <Badge variant="outline" className="ml-2 text-xs">Requis</Badge>}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedFields.length} champs sélectionnés
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
