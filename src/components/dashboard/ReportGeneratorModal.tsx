
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Calendar, BarChart } from "lucide-react";

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportGeneratorModal({ isOpen, onClose }: ReportGeneratorModalProps) {
  const { toast } = useToast();
  const [selectedReportType, setSelectedReportType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    period: '',
    startDate: '',
    endDate: '',
    includeGraphics: true,
    includeStats: true,
    includeRecommendations: false,
    description: ''
  });

  const reportTypes = [
    {
      id: 'performance',
      title: 'Rapport de performance',
      description: 'Analyse des performances des équipements et des techniciens',
      icon: BarChart
    },
    {
      id: 'maintenance',
      title: 'Rapport de maintenance',
      description: 'Suivi des interventions et de la maintenance préventive',
      icon: FileText
    },
    {
      id: 'incidents',
      title: 'Rapport d\'incidents',
      description: 'Analyse des pannes et des incidents survenus',
      icon: FileText
    },
    {
      id: 'costs',
      title: 'Rapport de coûts',
      description: 'Analyse financière des coûts de maintenance',
      icon: BarChart
    }
  ];

  const handleReportTypeSelect = (type: string) => {
    setSelectedReportType(type);
    const reportType = reportTypes.find(r => r.id === type);
    if (reportType) {
      setFormData(prev => ({ ...prev, title: reportType.title }));
    }
  };

  const handleGenerate = () => {
    if (!selectedReportType) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un type de rapport",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "✅ Génération en cours",
      description: "Votre rapport est en cours de génération...",
    });

    setTimeout(() => {
      toast({
        title: "Rapport généré",
        description: "Le rapport a été généré et téléchargé avec succès",
      });
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Générateur de rapports
          </DialogTitle>
          <DialogDescription>
            Créez et personnalisez vos rapports de maintenance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Sélection du type de rapport */}
          <div>
            <Label className="text-base font-medium">Type de rapport</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {reportTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedReportType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleReportTypeSelect(type.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
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
                    <Label htmlFor="title">Titre du rapport</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Nom de votre rapport"
                    />
                  </div>
                  
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
                </div>

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

                {/* Options du rapport */}
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
                        Inclure les graphiques et charts
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
                        Inclure les recommandations IA
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleGenerate} disabled={!selectedReportType}>
            <Download className="w-4 h-4 mr-2" />
            Générer le rapport
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
