
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

interface MovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function MovementForm({ isOpen, onClose, onSave, onBack }: MovementFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    technician: '',
    refrigeratorId: '',
    movementType: '',
    originLocation: '',
    destinationLocation: '',
    reason: '',
    transportMethod: '',
    condition: '',
    observations: '',
    receivedBy: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Fiche de mouvement sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-mouvement-${formData.refrigeratorId || 'nouveau'}-${formData.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE SUIVI DE MOUVEMENT DES FRIGOS ===

Date: ${formData.date}
Technicien: ${formData.technician}
ID Réfrigérateur: ${formData.refrigeratorId}
Type de mouvement: ${formData.movementType}

=== DÉTAILS DU MOUVEMENT ===
Origine: ${formData.originLocation}
Destination: ${formData.destinationLocation}
Raison: ${formData.reason}
Méthode de transport: ${formData.transportMethod}
État du matériel: ${formData.condition}

=== RÉCEPTION ===
Reçu par: ${formData.receivedBy}

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
              <DialogTitle>Fiche de Suivi de Mouvement des Frigos</DialogTitle>
              <DialogDescription>
                Enregistrement des déplacements et transferts de frigos
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
                  <Label htmlFor="movementType">Type de mouvement</Label>
                  <Select value={formData.movementType} onValueChange={(value) => handleInputChange('movementType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfert">Transfert</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="retrait">Retrait</SelectItem>
                      <SelectItem value="maintenance">Déplacement maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du mouvement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originLocation">Lieu d'origine</Label>
                  <Input
                    id="originLocation"
                    value={formData.originLocation}
                    onChange={(e) => handleInputChange('originLocation', e.target.value)}
                    placeholder="Adresse de départ"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destinationLocation">Lieu de destination</Label>
                  <Input
                    id="destinationLocation"
                    value={formData.destinationLocation}
                    onChange={(e) => handleInputChange('destinationLocation', e.target.value)}
                    placeholder="Adresse d'arrivée"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Raison du mouvement</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  placeholder="Motif du déplacement..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transportMethod">Mode de transport</Label>
                  <Select value={formData.transportMethod} onValueChange={(value) => handleInputChange('transportMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Méthode de transport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camion">Camion</SelectItem>
                      <SelectItem value="camionnette">Camionnette</SelectItem>
                      <SelectItem value="véhicule léger">Véhicule léger</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="condition">État du matériel</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="État à la réception" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="bon">Bon</SelectItem>
                      <SelectItem value="moyen">Moyen</SelectItem>
                      <SelectItem value="dégradé">Dégradé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Réception et observations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receivedBy">Reçu par</Label>
                <Input
                  id="receivedBy"
                  value={formData.receivedBy}
                  onChange={(e) => handleInputChange('receivedBy', e.target.value)}
                  placeholder="Nom du destinataire"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Remarques particulières, dommages constatés..."
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
