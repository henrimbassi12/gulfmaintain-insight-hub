
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Download } from "lucide-react";
import { toast } from "sonner";

interface DepotScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function DepotScheduleForm({ isOpen, onClose, onSave, onBack }: DepotScheduleFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    technician: '',
    arrivalTime: '',
    departureTime: '',
    visitPurpose: '',
    materialsCollected: '',
    toolsReturned: '',
    reportsSubmitted: '',
    nextTasks: '',
    supervisor: '',
    observations: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Fiche de passage au dépôt sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-depot-${formData.technician || 'nouveau'}-${formData.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE PASSE AU DÉPÔT ===

Date: ${formData.date}
Technicien: ${formData.technician}
Superviseur: ${formData.supervisor}

=== HORAIRES ===
Heure d'arrivée: ${formData.arrivalTime}
Heure de départ: ${formData.departureTime}

=== MOTIF DE LA VISITE ===
${formData.visitPurpose}

=== MATÉRIELS ET OUTILS ===
Matériels collectés: ${formData.materialsCollected}
Outils retournés: ${formData.toolsReturned}

=== RAPPORTS ===
Rapports remis: ${formData.reportsSubmitted}

=== PROCHAINES TÂCHES ===
${formData.nextTasks}

=== OBSERVATIONS ===
${formData.observations}

Généré le: ${new Date().toLocaleString('fr-FR')}
`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <DialogTitle>Fiche de Passe au Dépôt</DialogTitle>
              <DialogDescription>
                Suivi des passages des techniciens au dépôt
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="technician">Technicien</Label>
                  <Input
                    id="technician"
                    value={formData.technician}
                    onChange={(e) => handleInputChange('technician', e.target.value)}
                    placeholder="Nom du technicien"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="arrivalTime">Heure d'arrivée</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.arrivalTime}
                    onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Heure de départ</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.departureTime}
                    onChange={(e) => handleInputChange('departureTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supervisor">Superviseur</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  placeholder="Nom du superviseur présent"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Motif de la visite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visitPurpose">Motif</Label>
                <Select value={formData.visitPurpose} onValueChange={(value) => handleInputChange('visitPurpose', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le motif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collecte matériel">Collecte de matériel</SelectItem>
                    <SelectItem value="retour outils">Retour d'outils</SelectItem>
                    <SelectItem value="rapport activité">Rapport d'activité</SelectItem>
                    <SelectItem value="briefing">Briefing/Formation</SelectItem>
                    <SelectItem value="maintenance véhicule">Maintenance véhicule</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Matériels et outils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="materialsCollected">Matériels collectés</Label>
                <Textarea
                  id="materialsCollected"
                  value={formData.materialsCollected}
                  onChange={(e) => handleInputChange('materialsCollected', e.target.value)}
                  placeholder="Liste des matériels et pièces collectés..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toolsReturned">Outils retournés</Label>
                <Textarea
                  id="toolsReturned"
                  value={formData.toolsReturned}
                  onChange={(e) => handleInputChange('toolsReturned', e.target.value)}
                  placeholder="Liste des outils rendus au dépôt..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rapports et tâches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportsSubmitted">Rapports remis</Label>
                <Textarea
                  id="reportsSubmitted"
                  value={formData.reportsSubmitted}
                  onChange={(e) => handleInputChange('reportsSubmitted', e.target.value)}
                  placeholder="Rapports d'intervention, fiches de maintenance..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextTasks">Prochaines tâches assignées</Label>
                <Textarea
                  id="nextTasks"
                  value={formData.nextTasks}
                  onChange={(e) => handleInputChange('nextTasks', e.target.value)}
                  placeholder="Nouvelles missions, interventions programmées..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="observations">Remarques particulières</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Observations, problèmes signalés, demandes particulières..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
