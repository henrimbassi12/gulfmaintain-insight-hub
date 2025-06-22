
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

interface RepairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function RepairForm({ isOpen, onClose, onSave, onBack }: RepairFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    technician: '',
    refrigeratorId: '',
    location: '',
    failureType: '',
    failureDescription: '',
    diagnosisTime: '',
    repairTime: '',
    partsUsed: '',
    repairMethod: '',
    testResults: '',
    status: '',
    cost: '',
    observations: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Fiche de réparation sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-reparation-${formData.refrigeratorId || 'nouveau'}-${formData.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE SUIVI DES RÉPARATIONS DES FRIGOS ===

Date: ${formData.date}
Technicien: ${formData.technician}
ID Réfrigérateur: ${formData.refrigeratorId}
Localisation: ${formData.location}

=== PANNE IDENTIFIÉE ===
Type de panne: ${formData.failureType}
Description: ${formData.failureDescription}

=== INTERVENTION ===
Temps de diagnostic: ${formData.diagnosisTime}
Temps de réparation: ${formData.repairTime}
Méthode de réparation: ${formData.repairMethod}

=== PIÈCES ET COÛTS ===
Pièces utilisées: ${formData.partsUsed}
Coût total: ${formData.cost}

=== RÉSULTATS ===
Tests effectués: ${formData.testResults}
Statut: ${formData.status}

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
              <DialogTitle>Fiche de Suivi des Réparations des Frigos</DialogTitle>
              <DialogDescription>
                Documentation des pannes et des réparations effectuées
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Panne identifiée</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="failureType">Type de panne</Label>
                <Select value={formData.failureType} onValueChange={(value) => handleInputChange('failureType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type de panne" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="électrique">Électrique</SelectItem>
                    <SelectItem value="mécanique">Mécanique</SelectItem>
                    <SelectItem value="thermique">Thermique</SelectItem>
                    <SelectItem value="gaz">Système de gaz</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="failureDescription">Description de la panne</Label>
                <Textarea
                  id="failureDescription"
                  value={formData.failureDescription}
                  onChange={(e) => handleInputChange('failureDescription', e.target.value)}
                  placeholder="Décrire les symptômes et la panne constatée..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Intervention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnosisTime">Temps de diagnostic</Label>
                  <Input
                    id="diagnosisTime"
                    value={formData.diagnosisTime}
                    onChange={(e) => handleInputChange('diagnosisTime', e.target.value)}
                    placeholder="Ex: 30 min"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="repairTime">Temps de réparation</Label>
                  <Input
                    id="repairTime"
                    value={formData.repairTime}
                    onChange={(e) => handleInputChange('repairTime', e.target.value)}
                    placeholder="Ex: 2h"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repairMethod">Méthode de réparation</Label>
                <Textarea
                  id="repairMethod"
                  value={formData.repairMethod}
                  onChange={(e) => handleInputChange('repairMethod', e.target.value)}
                  placeholder="Décrire les étapes de la réparation..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pièces et coûts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partsUsed">Pièces utilisées</Label>
                <Textarea
                  id="partsUsed"
                  value={formData.partsUsed}
                  onChange={(e) => handleInputChange('partsUsed', e.target.value)}
                  placeholder="Liste des pièces remplacées ou utilisées..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Coût total (FCFA)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  placeholder="Coût total de la réparation"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résultats et suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testResults">Tests effectués</Label>
                <Textarea
                  id="testResults"
                  value={formData.testResults}
                  onChange={(e) => handleInputChange('testResults', e.target.value)}
                  placeholder="Tests de fonctionnement, vérifications..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut de la réparation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="réparé">Réparé</SelectItem>
                    <SelectItem value="partiellement réparé">Partiellement réparé</SelectItem>
                    <SelectItem value="en attente pièces">En attente de pièces</SelectItem>
                    <SelectItem value="irréparable">Irréparable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Remarques additionnelles, recommandations..."
                  rows={3}
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
