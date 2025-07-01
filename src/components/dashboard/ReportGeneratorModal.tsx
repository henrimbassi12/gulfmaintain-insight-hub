import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useReportGeneration } from "@/hooks/useReportGeneration";
import { FileText, Download, Calendar, BarChart, Receipt, List } from "lucide-react";
import { toast } from 'sonner';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportGeneratorModal({ isOpen, onClose }: ReportGeneratorModalProps) {
  const { generateReport, isGenerating } = useReportGeneration();
  const [selectedReportType, setSelectedReportType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    period: '',
    startDate: '',
    endDate: '',
    includeGraphics: true,
    includeStats: true,
    includeRecommendations: false,
    description: '',
    technician: '',
    equipment: '',
    location: '',
    cost: ''
  });

  const reportTypes = [
    {
      id: 'maintenance',
      title: 'Rapport de maintenance',
      description: 'Rapport complet des interventions avec statistiques et recommandations',
      icon: BarChart,
      pdfType: 'report'
    },
    {
      id: 'equipment',
      title: 'Inventaire équipements',
      description: 'Liste détaillée de tous les équipements avec leur état',
      icon: List,
      pdfType: 'list'
    },
    {
      id: 'receipt',
      title: 'Reçu d\'intervention',
      description: 'Reçu détaillé d\'une intervention spécifique (style Orange Money)',
      icon: Receipt,
      pdfType: 'receipt'
    },
    {
      id: 'performance',
      title: 'Rapport de performance',
      description: 'Analyse des performances des équipements et des techniciens',
      icon: BarChart,
      pdfType: 'report'
    }
  ];

  const handleReportTypeSelect = (type: string) => {
    setSelectedReportType(type);
    const reportType = reportTypes.find(r => r.id === type);
    if (reportType) {
      setFormData(prev => ({ ...prev, title: reportType.title }));
    }
  };

  const handleGenerate = async () => {
    if (!selectedReportType) {
      toast.error("Veuillez sélectionner un type de rapport");
      return;
    }

    try {
      // Préparer les données spécifiques selon le type
      const reportData = selectedReportType === 'receipt' ? {
        technician: formData.technician,
        equipment: formData.equipment,
        location: formData.location,
        cost: formData.cost
      } : {
        title: formData.title,
        period: formData.period,
        description: formData.description
      };

      await generateReport(selectedReportType, reportData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    }
  };

  const selectedType = reportTypes.find(r => r.id === selectedReportType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Générateur de rapports PDF
          </DialogTitle>
          <DialogDescription>
            Créez des rapports professionnels au format PDF avec mise en page optimisée
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection du type de rapport */}
          <div>
            <Label className="text-base font-medium">Type de document PDF</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {reportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedReportType === type.id ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                    }`}
                    onClick={() => handleReportTypeSelect(type.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-orange-600" />
                        <CardTitle className="text-sm">{type.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs">
                        {type.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {selectedReportType && (
            <>
              {/* Configuration du rapport */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre du document</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Nom de votre document"
                    />
                  </div>
                  
                  {selectedReportType !== 'receipt' && (
                    <div className="space-y-2">
                      <Label htmlFor="period">Période</Label>
                      <Select value={formData.period} onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la période" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Aujourd'hui</SelectItem>
                          <SelectItem value="week">Cette semaine</SelectItem>
                          <SelectItem value="month">Ce mois</SelectItem>
                          <SelectItem value="quarter">Ce trimestre</SelectItem>
                          <SelectItem value="year">Cette année</SelectItem>
                          <SelectItem value="custom">Période personnalisée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Champs spécifiques au reçu */}
                {selectedReportType === 'receipt' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="space-y-2">
                      <Label htmlFor="technician">Technicien</Label>
                      <Input
                        id="technician"
                        value={formData.technician}
                        onChange={(e) => setFormData(prev => ({ ...prev, technician: e.target.value }))}
                        placeholder="Nom du technicien"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment">Équipement</Label>
                      <Input
                        id="equipment"
                        value={formData.equipment}
                        onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                        placeholder="Type d'équipement"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Lieu d'intervention"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Coût</Label>
                      <Input
                        id="cost"
                        value={formData.cost}
                        onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                        placeholder="Ex: 25,000 F CFA"
                      />
                    </div>
                  </div>
                )}

                {formData.period === 'custom' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de début</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Date de fin</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    placeholder="Ajoutez une description ou des notes pour ce rapport..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                {selectedReportType !== 'receipt' && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Options d'inclusion</Label>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeGraphics"
                          checked={formData.includeGraphics}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeGraphics: !!checked }))}
                        />
                        <Label htmlFor="includeGraphics" className="text-sm">
                          Inclure les graphiques et tableaux
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeStats"
                          checked={formData.includeStats}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeStats: !!checked }))}
                        />
                        <Label htmlFor="includeStats" className="text-sm">
                          Inclure les statistiques détaillées
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeRecommendations"
                          checked={formData.includeRecommendations}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeRecommendations: !!checked }))}
                        />
                        <Label htmlFor="includeRecommendations" className="text-sm">
                          Inclure les recommandations
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedReportType || isGenerating}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Génération...' : 'Générer le PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
