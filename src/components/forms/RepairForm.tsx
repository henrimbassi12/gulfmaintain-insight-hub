
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface RepairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

interface ReplacedPart {
  id: string;
  designation1: string;
  quantite1: string;
  designation2: string;
  quantite2: string;
}

export function RepairForm({ isOpen, onClose, onSave, onBack }: RepairFormProps) {
  const [formData, setFormData] = useState({
    // En-tête
    nomClient: '',
    nomPdv: '',
    
    // Déclaration de pannes
    date: new Date().toISOString().split('T')[0],
    heure: '',
    ancienFrigo: '',
    nouveauFrigo: '',
    sn: '',
    tagNumber: '',
    typeFrigo: '',
    quartier: '',
    arrondissement: '',
    organisation: '',
    partenaire: '',
    reparation: '',
    descriptionPanne: '',
    nomPrenomDateSignature: '',
    
    // Statut de réparation
    seWs2: '',
    abdm: '',
    tas: '',
    gulfFroid: '',
    dateReparation: new Date().toISOString().split('T')[0],
    panneDetectee: '',
    travauxEffectues: '',
    nomPrenomTechnicien: '',
    dateTechnicien: '',
    signatureTechnicien: '',
    telephoneTechnicien: '',
    resultatAudit: '',
    commentaires: '',
    
    // Approbations
    gerantNom: '',
    gerantSignature: '',
    gerantDate: '',
    sdNom: '',
    sdSignature: '',
    sdDate: '',
    seNom: '',
    seSignature: '',
    seDate: '',
    abdmNom: '',
    abdmSignature: '',
    abdmDate: '',
    tasNom: '',
    tasSignature: '',
    tasDate: ''
  });

  const [replacedParts, setReplacedParts] = useState<ReplacedPart[]>([
    { id: '1', designation1: '', quantite1: '', designation2: '', quantite2: '' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addReplacedPart = () => {
    const newPart: ReplacedPart = {
      id: Date.now().toString(),
      designation1: '',
      quantite1: '',
      designation2: '',
      quantite2: ''
    };
    setReplacedParts(prev => [...prev, newPart]);
  };

  const removeReplacedPart = (id: string) => {
    setReplacedParts(prev => prev.filter(part => part.id !== id));
  };

  const updateReplacedPart = (id: string, field: string, value: string) => {
    setReplacedParts(prev => 
      prev.map(part => 
        part.id === id ? { ...part, [field]: value } : part
      )
    );
  };

  const handleSave = () => {
    const completeData = {
      ...formData,
      replacedParts
    };
    onSave(completeData);
    toast.success('Fiche de suivi des réparations sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-reparation-${formData.nomPdv || 'nouveau'}-${formData.date}.txt`;
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
Date: ${formData.date}
Heure: ${formData.heure}

Informations sur le frigo:
- Ancien frigo: ${formData.ancienFrigo}
- Nouveau Frigo: ${formData.nouveauFrigo}
- S.N: ${formData.sn}
- TAG NUMBER: ${formData.tagNumber}

Type de frigo: ${formData.typeFrigo}

Localisation:
- Quartier: ${formData.quartier}
- Arrondissement: ${formData.arrondissement}
- Organisation: ${formData.organisation}
- Partenaire: ${formData.partenaire}
- Réparation: ${formData.reparation}

Description de la panne: ${formData.descriptionPanne}
Nom, prénom, date, signature: ${formData.nomPrenomDateSignature}

=== 2. STATUT DE RÉPARATION ===
SE/WS2: ${formData.seWs2}
ABDM: ${formData.abdm}
TAS: ${formData.tas}
GULF FROID INDUSTRIEL: ${formData.gulfFroid}
Date: ${formData.dateReparation}

Panne détectée(s): ${formData.panneDetectee}
Travaux effectué(s): ${formData.travauxEffectues}

=== PIÈCES REMPLACÉES ===
${replacedParts.map(part => `
Désignation: ${part.designation1} - Quantité: ${part.quantite1}
Désignation: ${part.designation2} - Quantité: ${part.quantite2}
`).join('\n')}

Technicien: ${formData.nomPrenomTechnicien}
Date: ${formData.dateTechnicien}
Signature: ${formData.signatureTechnicien}
Téléphone: ${formData.telephoneTechnicien}

Résultat Audit Guinness Rep: ${formData.resultatAudit}
Commentaires: ${formData.commentaires}

=== APPROBATIONS ===
Gérant: ${formData.gerantNom} - ${formData.gerantSignature} - ${formData.gerantDate}
SD: ${formData.sdNom} - ${formData.sdSignature} - ${formData.sdDate}
SE: ${formData.seNom} - ${formData.seSignature} - ${formData.seDate}
ABDM: ${formData.abdmNom} - ${formData.abdmSignature} - ${formData.abdmDate}
TAS: ${formData.tasNom} - ${formData.tasSignature} - ${formData.tasDate}

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
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heure">HEURE</Label>
                  <Input
                    id="heure"
                    type="time"
                    value={formData.heure}
                    onChange={(e) => handleInputChange('heure', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Informations sur le frigo:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ancienFrigo">Ancien frigo</Label>
                    <Input
                      id="ancienFrigo"
                      value={formData.ancienFrigo}
                      onChange={(e) => handleInputChange('ancienFrigo', e.target.value)}
                      placeholder="Ancien frigo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nouveauFrigo">Nouveau Frigo</Label>
                    <Input
                      id="nouveauFrigo"
                      value={formData.nouveauFrigo}
                      onChange={(e) => handleInputChange('nouveauFrigo', e.target.value)}
                      placeholder="Nouveau frigo"
                    />
                  </div>
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

              <div className="space-y-2">
                <Label htmlFor="typeFrigo">Type de frigo</Label>
                <Select value={formData.typeFrigo} onValueChange={(value) => handleInputChange('typeFrigo', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FV800">FV800</SelectItem>
                    <SelectItem value="FV420">FV420</SelectItem>
                    <SelectItem value="SDMA1500">SDMA1500</SelectItem>
                    <SelectItem value="SDMA650">SDMA650</SelectItem>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Localisation:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="arrondissement">Arrondissement sélect.</Label>
                    <Input
                      id="arrondissement"
                      value={formData.arrondissement}
                      onChange={(e) => handleInputChange('arrondissement', e.target.value)}
                      placeholder="Arrondissement"
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
                    <Label htmlFor="reparation">Réparation</Label>
                    <Input
                      id="reparation"
                      value={formData.reparation}
                      onChange={(e) => handleInputChange('reparation', e.target.value)}
                      placeholder="Réparation"
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
                  placeholder="Description détaillée de la panne..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomPrenomDateSignature">Nom, prénom, date, signature, n° de signature</Label>
                <Input
                  id="nomPrenomDateSignature"
                  value={formData.nomPrenomDateSignature}
                  onChange={(e) => handleInputChange('nomPrenomDateSignature', e.target.value)}
                  placeholder="Nom, prénom, date, signature, n° de signature"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seWs2">SE/WS2</Label>
                  <Input
                    id="seWs2"
                    value={formData.seWs2}
                    onChange={(e) => handleInputChange('seWs2', e.target.value)}
                    placeholder="SE/WS2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="abdm">ABDM</Label>
                  <Input
                    id="abdm"
                    value={formData.abdm}
                    onChange={(e) => handleInputChange('abdm', e.target.value)}
                    placeholder="ABDM"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tas">TAS</Label>
                  <Input
                    id="tas"
                    value={formData.tas}
                    onChange={(e) => handleInputChange('tas', e.target.value)}
                    placeholder="TAS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gulfFroid">GULF FROID INDUSTRIEL</Label>
                  <Input
                    id="gulfFroid"
                    value={formData.gulfFroid}
                    onChange={(e) => handleInputChange('gulfFroid', e.target.value)}
                    placeholder="Gulf Froid Industriel"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateReparation">Date</Label>
                <Input
                  id="dateReparation"
                  type="date"
                  value={formData.dateReparation}
                  onChange={(e) => handleInputChange('dateReparation', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panneDetectee">Panne détectée(s)</Label>
                  <Textarea
                    id="panneDetectee"
                    value={formData.panneDetectee}
                    onChange={(e) => handleInputChange('panneDetectee', e.target.value)}
                    placeholder="Pannes détectées..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="travauxEffectues">Travaux effectué(s)</Label>
                  <Textarea
                    id="travauxEffectues"
                    value={formData.travauxEffectues}
                    onChange={(e) => handleInputChange('travauxEffectues', e.target.value)}
                    placeholder="Travaux effectués..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Pièces remplacées */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Pièces remplacée(s)</h4>
                  <Button onClick={addReplacedPart} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter des pièces
                  </Button>
                </div>
                {replacedParts.map((part, index) => (
                  <div key={part.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Pièces {index + 1}</h5>
                      {replacedParts.length > 1 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeReplacedPart(part.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Désignation</Label>
                        <Input
                          value={part.designation1}
                          onChange={(e) => updateReplacedPart(part.id, 'designation1', e.target.value)}
                          placeholder="Désignation de la pièce"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantités</Label>
                        <Input
                          value={part.quantite1}
                          onChange={(e) => updateReplacedPart(part.id, 'quantite1', e.target.value)}
                          placeholder="Quantité"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Désignation</Label>
                        <Input
                          value={part.designation2}
                          onChange={(e) => updateReplacedPart(part.id, 'designation2', e.target.value)}
                          placeholder="Désignation de la pièce"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantités</Label>
                        <Input
                          value={part.quantite2}
                          onChange={(e) => updateReplacedPart(part.id, 'quantite2', e.target.value)}
                          placeholder="Quantité"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomPrenomTechnicien">Nom, Prénom Technicien</Label>
                  <Input
                    id="nomPrenomTechnicien"
                    value={formData.nomPrenomTechnicien}
                    onChange={(e) => handleInputChange('nomPrenomTechnicien', e.target.value)}
                    placeholder="Nom et prénom du technicien"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTechnicien">Date</Label>
                  <Input
                    id="dateTechnicien"
                    type="date"
                    value={formData.dateTechnicien}
                    onChange={(e) => handleInputChange('dateTechnicien', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signatureTechnicien">Signature</Label>
                  <Input
                    id="signatureTechnicien"
                    value={formData.signatureTechnicien}
                    onChange={(e) => handleInputChange('signatureTechnicien', e.target.value)}
                    placeholder="Signature du technicien"
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

              <div className="space-y-2">
                <Label htmlFor="resultatAudit">Résultat Audit Guinness Rep</Label>
                <Select value={formData.resultatAudit} onValueChange={(value) => handleInputChange('resultatAudit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le résultat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Satisfait">Satisfait</SelectItem>
                    <SelectItem value="Insatisfaisant">Insatisfaisant</SelectItem>
                  </SelectContent>
                </Select>
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
              {[
                { prefix: 'gerant', label: 'Gérant' },
                { prefix: 'sd', label: 'SD' },
                { prefix: 'se', label: 'SE' },
                { prefix: 'abdm', label: 'ABDM' },
                { prefix: 'tas', label: 'TAS' }
              ].map(({ prefix, label }) => (
                <div key={prefix} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">{label}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input
                        value={formData[`${prefix}Nom` as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(`${prefix}Nom`, e.target.value)}
                        placeholder="Nom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Signature</Label>
                      <Input
                        value={formData[`${prefix}Signature` as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(`${prefix}Signature`, e.target.value)}
                        placeholder="Signature"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={formData[`${prefix}Date` as keyof typeof formData] as string}
                        onChange={(e) => handleInputChange(`${prefix}Date`, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
