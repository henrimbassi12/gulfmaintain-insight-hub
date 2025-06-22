
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
import { Checkbox } from "@/components/ui/checkbox";

interface RepairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function RepairForm({ isOpen, onClose, onSave, onBack }: RepairFormProps) {
  const [formData, setFormData] = useState({
    // En-tête
    nomClient: '',
    nomPdv: '',
    
    // 1. Déclaration de pannes
    date1: new Date().toISOString().split('T')[0],
    heure1: '',
    ancienFrigo: false,
    nouveauFrigo: false,
    sn: '',
    tagNumber: '',
    fv800: false,
    fv420: false,
    sdm1500: false,
    sdm650: false,
    branding: '',
    autres: '',
    quartier: '',
    emplacement: '',
    organisation: '',
    partenaire: '',
    villeDivision: '',
    descriptionPanne: '',
    nomPrenomSignature1: '',
    
    // 2. Statut de réparation
    date2: new Date().toISOString().split('T')[0],
    panneDetectee: '',
    travauxEffectues: '',
    piecesRemplacees: [
      { designation: '', quantite: '' },
      { designation: '', quantite: '' }
    ],
    nomPrenomTechnicien: '',
    telephoneTechnicien: '',
    satisfait: false,
    insatisfaisant: false,
    commentaires: '',
    
    // Approbations
    gerant: '',
    sd: '',
    se: '',
    abdm: '',
    tas: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePieceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      piecesRemplacees: prev.piecesRemplacees.map((piece, i) => 
        i === index ? { ...piece, [field]: value } : piece
      )
    }));
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
    link.download = `fiche-reparation-${formData.tagNumber || 'nouveau'}-${formData.date1}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE SUIVI DES RÉPARATIONS DES FRIGOS ===

GUINNESS.
Nom du client: ${formData.nomClient}
Nom du PDV: ${formData.nomPdv}

=== 1. DÉCLARATION DE PANNES ===
Date: ${formData.date1}
Heure: ${formData.heure1}

Informations sur le frigo:
- Ancien frigo: ${formData.ancienFrigo ? 'Oui' : 'Non'}
- Nouveau frigo: ${formData.nouveauFrigo ? 'Oui' : 'Non'}
- S.N: ${formData.sn}
- TAG NUMBER: ${formData.tagNumber}

Type de frigo:
- FV800: ${formData.fv800 ? 'Oui' : 'Non'}
- FV420: ${formData.fv420 ? 'Oui' : 'Non'}
- SDM1500: ${formData.sdm1500 ? 'Oui' : 'Non'}
- SDM650: ${formData.sdm650 ? 'Oui' : 'Non'}
- Branding: ${formData.branding}
- Autres: ${formData.autres}

Localisation:
- Quartier: ${formData.quartier}
- Emplacement exact: ${formData.emplacement}
- Organisation: ${formData.organisation}
- Partenaire: ${formData.partenaire}
- Ville Division: ${formData.villeDivision}

Description de la panne: ${formData.descriptionPanne}

=== 2. STATUT DE RÉPARATION ===
Date: ${formData.date2}
Panne détectée: ${formData.panneDetectee}
Travaux effectués: ${formData.travauxEffectues}

Pièces remplacées:
${formData.piecesRemplacees.map((piece, index) => 
  `${index + 1}. ${piece.designation} - Quantité: ${piece.quantite}`
).join('\n')}

Technicien: ${formData.nomPrenomTechnicien}
Téléphone: ${formData.telephoneTechnicien}

Résultat audit: ${formData.satisfait ? 'Satisfait' : formData.insatisfaisant ? 'Insatisfaisant' : 'Non renseigné'}
Commentaires: ${formData.commentaires}

Approbations:
- Gérant: ${formData.gerant}
- SD: ${formData.sd}
- SE: ${formData.se}
- ABDM: ${formData.abdm}
- TAS: ${formData.tas}

Généré le: ${new Date().toLocaleString('fr-FR')}
`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="text-center w-full">
              <DialogTitle className="text-xl font-bold">FICHE DE SUIVI DES RÉPARATIONS DES FRIGOS</DialogTitle>
              <div className="text-lg font-semibold text-gray-800 mt-1">GUINNESS.</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomClient">NOM DU CLIENT</Label>
                  <Input
                    id="nomClient"
                    value={formData.nomClient}
                    onChange={(e) => handleInputChange('nomClient', e.target.value)}
                    placeholder="Nom du client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomPdv">NOM DU PDV</Label>
                  <Input
                    id="nomPdv"
                    value={formData.nomPdv}
                    onChange={(e) => handleInputChange('nomPdv', e.target.value)}
                    placeholder="Nom du point de vente"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. Déclaration de pannes */}
          <Card>
            <CardHeader>
              <CardTitle>1. DÉCLARATION DE PANNES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date1">Date</Label>
                  <Input
                    id="date1"
                    type="date"
                    value={formData.date1}
                    onChange={(e) => handleInputChange('date1', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure1">HEURE</Label>
                  <Input
                    id="heure1"
                    type="time"
                    value={formData.heure1}
                    onChange={(e) => handleInputChange('heure1', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Informations sur le frigo</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ancienFrigo"
                      checked={formData.ancienFrigo}
                      onCheckedChange={(checked) => handleInputChange('ancienFrigo', checked)}
                    />
                    <Label htmlFor="ancienFrigo">Ancien Frigo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nouveauFrigo"
                      checked={formData.nouveauFrigo}
                      onCheckedChange={(checked) => handleInputChange('nouveauFrigo', checked)}
                    />
                    <Label htmlFor="nouveauFrigo">Nouveau Frigo</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="sn">S.N</Label>
                    <Input
                      id="sn"
                      value={formData.sn}
                      onChange={(e) => handleInputChange('sn', e.target.value)}
                      placeholder="Numéro de série"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagNumber">TAG NUMBER</Label>
                    <Input
                      id="tagNumber"
                      value={formData.tagNumber}
                      onChange={(e) => handleInputChange('tagNumber', e.target.value)}
                      placeholder="Numéro de tag"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Type de frigo</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fv800"
                      checked={formData.fv800}
                      onCheckedChange={(checked) => handleInputChange('fv800', checked)}
                    />
                    <Label htmlFor="fv800">FV800</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fv420"
                      checked={formData.fv420}
                      onCheckedChange={(checked) => handleInputChange('fv420', checked)}
                    />
                    <Label htmlFor="fv420">FV420</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sdm1500"
                      checked={formData.sdm1500}
                      onCheckedChange={(checked) => handleInputChange('sdm1500', checked)}
                    />
                    <Label htmlFor="sdm1500">SDM1500</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sdm650"
                      checked={formData.sdm650}
                      onCheckedChange={(checked) => handleInputChange('sdm650', checked)}
                    />
                    <Label htmlFor="sdm650">SDM650</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="branding">Branding</Label>
                    <Input
                      id="branding"
                      value={formData.branding}
                      onChange={(e) => handleInputChange('branding', e.target.value)}
                      placeholder="Branding"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autres">Autres</Label>
                    <Input
                      id="autres"
                      value={formData.autres}
                      onChange={(e) => handleInputChange('autres', e.target.value)}
                      placeholder="Autres types"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Localisation</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="quartier">Quartier</Label>
                    <Input
                      id="quartier"
                      value={formData.quartier}
                      onChange={(e) => handleInputChange('quartier', e.target.value)}
                      placeholder="Quartier"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emplacement">Emplacement exact</Label>
                    <Input
                      id="emplacement"
                      value={formData.emplacement}
                      onChange={(e) => handleInputChange('emplacement', e.target.value)}
                      placeholder="Emplacement exact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organisation">Organisation</Label>
                    <Input
                      id="organisation"
                      value={formData.organisation}
                      onChange={(e) => handleInputChange('organisation', e.target.value)}
                      placeholder="Organisation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partenaire">Partenaire</Label>
                    <Input
                      id="partenaire"
                      value={formData.partenaire}
                      onChange={(e) => handleInputChange('partenaire', e.target.value)}
                      placeholder="Partenaire"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="villeDivision">Ville Division</Label>
                    <Input
                      id="villeDivision"
                      value={formData.villeDivision}
                      onChange={(e) => handleInputChange('villeDivision', e.target.value)}
                      placeholder="Ville Division"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionPanne">Description de la panne</Label>
                <Textarea
                  id="descriptionPanne"
                  value={formData.descriptionPanne}
                  onChange={(e) => handleInputChange('descriptionPanne', e.target.value)}
                  placeholder="Décrire la panne en détail..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Statut de réparation */}
          <Card>
            <CardHeader>
              <CardTitle>2. STATUT DE RÉPARATION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date2">Date</Label>
                <Input
                  id="date2"
                  type="date"
                  value={formData.date2}
                  onChange={(e) => handleInputChange('date2', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panneDetectee">Panne détectée(s)</Label>
                <Textarea
                  id="panneDetectee"
                  value={formData.panneDetectee}
                  onChange={(e) => handleInputChange('panneDetectee', e.target.value)}
                  placeholder="Pannes détectées..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travauxEffectues">Travaux effectué(s)</Label>
                <Textarea
                  id="travauxEffectues"
                  value={formData.travauxEffectues}
                  onChange={(e) => handleInputChange('travauxEffectues', e.target.value)}
                  placeholder="Travaux effectués..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Pièces remplacée(s)</Label>
                <div className="space-y-3 mt-2">
                  {formData.piecesRemplacees.map((piece, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Désignation</Label>
                        <Input
                          value={piece.designation}
                          onChange={(e) => handlePieceChange(index, 'designation', e.target.value)}
                          placeholder="Désignation de la pièce"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantités</Label>
                        <Input
                          value={piece.quantite}
                          onChange={(e) => handlePieceChange(index, 'quantite', e.target.value)}
                          placeholder="Quantité"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomPrenomTechnicien">Nom, Prénom technicien</Label>
                  <Input
                    id="nomPrenomTechnicien"
                    value={formData.nomPrenomTechnicien}
                    onChange={(e) => handleInputChange('nomPrenomTechnicien', e.target.value)}
                    placeholder="Nom et prénom du technicien"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephoneTechnicien">Téléphone technicien</Label>
                  <Input
                    id="telephoneTechnicien"
                    value={formData.telephoneTechnicien}
                    onChange={(e) => handleInputChange('telephoneTechnicien', e.target.value)}
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Résultat Audit Guinness Rep</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="satisfait"
                      checked={formData.satisfait}
                      onCheckedChange={(checked) => {
                        handleInputChange('satisfait', checked);
                        if (checked) handleInputChange('insatisfaisant', false);
                      }}
                    />
                    <Label htmlFor="satisfait">Satisfait</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insatisfaisant"
                      checked={formData.insatisfaisant}
                      onCheckedChange={(checked) => {
                        handleInputChange('insatisfaisant', checked);
                        if (checked) handleInputChange('satisfait', false);
                      }}
                    />
                    <Label htmlFor="insatisfaisant">Insatisfaisant</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentaires">Commentaires</Label>
                <Textarea
                  id="commentaires"
                  value={formData.commentaires}
                  onChange={(e) => handleInputChange('commentaires', e.target.value)}
                  placeholder="Commentaires..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Approbations */}
          <Card>
            <CardHeader>
              <CardTitle>Approbation (Nom, Prénom, Signature, Date)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gerant">Gérant</Label>
                  <Input
                    id="gerant"
                    value={formData.gerant}
                    onChange={(e) => handleInputChange('gerant', e.target.value)}
                    placeholder="Nom, prénom, date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sd">SD</Label>
                  <Input
                    id="sd"
                    value={formData.sd}
                    onChange={(e) => handleInputChange('sd', e.target.value)}
                    placeholder="Nom, prénom, date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="se">SE</Label>
                  <Input
                    id="se"
                    value={formData.se}
                    onChange={(e) => handleInputChange('se', e.target.value)}
                    placeholder="Nom, prénom, date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abdm">ABDM</Label>
                  <Input
                    id="abdm"
                    value={formData.abdm}
                    onChange={(e) => handleInputChange('abdm', e.target.value)}
                    placeholder="Nom, prénom, date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tas">TAS</Label>
                  <Input
                    id="tas"
                    value={formData.tas}
                    onChange={(e) => handleInputChange('tas', e.target.value)}
                    placeholder="Nom, prénom, date"
                  />
                </div>
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
