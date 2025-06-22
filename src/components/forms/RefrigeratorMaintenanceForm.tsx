
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

interface RefrigeratorMaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function RefrigeratorMaintenanceForm({ isOpen, onClose, onSave, onBack }: RefrigeratorMaintenanceFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    technician: '',
    refrigeratorId: '',
    location: '',
    maintenanceType: '',
    temperature: '',
    cleaning: '',
    gasLevel: '',
    electricalCheck: '',
    observations: '',
    nextMaintenance: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Fiche d\'entretien sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-entretien-${formData.refrigeratorId || 'nouveau'}-${formData.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE D'ENTRETIEN DES FRIGOS ===

Date: ${formData.date}
Technicien: ${formData.technician}
ID Réfrigérateur: ${formData.refrigeratorId}
Localisation: ${formData.location}
Type d'entretien: ${formData.maintenanceType}

=== CONTRÔLES EFFECTUÉS ===
Température: ${formData.temperature}
Nettoyage: ${formData.cleaning}
Niveau de gaz: ${formData.gasLevel}
Contrôle électrique: ${formData.electricalCheck}

=== OBSERVATIONS ===
${formData.observations}

Prochaine maintenance prévue: ${formData.nextMaintenance}

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
              <DialogTitle>Fiche d'Entretien des Frigos</DialogTitle>
              <DialogDescription>
                Formulaire pour l'entretien périodique des réfrigérateurs
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
                  <Label htmlFor="refrigeratorId">ID Réfrigérateur</Label>
                  <Input
                    id="refrigeratorId"
                    value={formData.refrigeratorId}
                    onChange={(e) => handleInputChange('refrigeratorId', e.target.value)}
                    placeholder="Ex: FRIG-001"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Adresse ou zone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceType">Type d'entretien</Label>
                <Select value={formData.maintenanceType} onValueChange={(value) => handleInputChange('maintenanceType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventif">Entretien préventif</SelectItem>
                    <SelectItem value="correctif">Entretien correctif</SelectItem>
                    <SelectItem value="urgence">Intervention d'urgence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contrôles effectués</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Température (°C)</Label>
                  <Input
                    id="temperature"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    placeholder="Ex: 4°C"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gasLevel">Niveau de gaz</Label>
                  <Select value={formData.gasLevel} onValueChange={(value) => handleInputChange('gasLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="État du gaz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="optimal">Optimal</SelectItem>
                      <SelectItem value="bas">Bas</SelectItem>
                      <SelectItem value="rechargé">Rechargé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cleaning">Nettoyage</Label>
                  <Select value={formData.cleaning} onValueChange={(value) => handleInputChange('cleaning', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="État de propreté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="effectué">Effectué</SelectItem>
                      <SelectItem value="partiel">Partiel</SelectItem>
                      <SelectItem value="nécessaire">Nécessaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="electricalCheck">Contrôle électrique</Label>
                  <Select value={formData.electricalCheck} onValueChange={(value) => handleInputChange('electricalCheck', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="État électrique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conforme">Conforme</SelectItem>
                      <SelectItem value="défaillant">Défaillant</SelectItem>
                      <SelectItem value="réparé">Réparé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Observations et suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Remarques, problèmes détectés, actions effectuées..."
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextMaintenance">Prochaine maintenance</Label>
                <Input
                  id="nextMaintenance"
                  type="date"
                  value={formData.nextMaintenance}
                  onChange={(e) => handleInputChange('nextMaintenance', e.target.value)}
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
