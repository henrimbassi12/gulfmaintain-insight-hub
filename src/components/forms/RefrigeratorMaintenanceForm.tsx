
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
    // Informations client
    division: '',
    secteur: '',
    partenaire: '',
    ville: '',
    nomsClient: '',
    nomPdv: '',
    telBarman: '',
    quartier: '',
    
    // Informations frigo
    typeFrigo: '',
    afNf: '',
    branding: '',
    sn: '',
    tagNumber: '',
    securite: '',
    tauxRemplissage: '',
    eclairage: '',
    temperature: '',
    lineaire: '',
    tension: '',
    intensiteAvant: '',
    intensiteApres: '',
    purgeCircuit: false,
    soufflageParties: false,
    observations: '',
    signatureBarman: '',
    
    // Droite
    taeRse: '',
    technicienGfi: '',
    
    // Bas de page
    nomDateSignature: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Fiche d\'entretien des frigos sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-entretien-frigos-${formData.nomPdv || 'nouveau'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE D'ENTRETIEN DES FRIGOS ===

Gulf Froid Industriel, le partenaire de la qualité
GUINNESS.

=== INFORMATIONS CLIENT ===
Division: ${formData.division}
Secteur: ${formData.secteur}
Partenaire: ${formData.partenaire}
Ville: ${formData.ville}
Noms Client: ${formData.nomsClient}
Nom PDV: ${formData.nomPdv}
Tél Barman: ${formData.telBarman}
Quartier: ${formData.quartier}

=== INFORMATIONS FRIGO ===
Type Frigo: ${formData.typeFrigo}
AF/NF: ${formData.afNf}
Branding: ${formData.branding}
SN: ${formData.sn}
TAG NUMBER: ${formData.tagNumber}
Sécurité: ${formData.securite}
Taux Remplissage: ${formData.tauxRemplissage}%
Éclairage: ${formData.eclairage}
Température: ${formData.temperature}°C
Linéaire: ${formData.lineaire}
Tension: ${formData.tension}V
Intensité Avant: ${formData.intensiteAvant}A
Intensité Après: ${formData.intensiteApres}A
Purge du circuit: ${formData.purgeCircuit ? 'Oui' : 'Non'}
Soufflage des parties: ${formData.soufflageParties ? 'Oui' : 'Non'}

=== OBSERVATIONS ===
${formData.observations}

=== SIGNATURES ===
Signature Barman: ${formData.signatureBarman}
TAE/RSE Guinness: ${formData.taeRse}
Technicien GFI: ${formData.technicienGfi}
Nom, Date, Signature: ${formData.nomDateSignature}

Généré le: ${new Date().toLocaleString('fr-FR')}
`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="text-center w-full">
              <div className="text-sm text-gray-600 mb-1">Gulf Froid Industriel, le partenaire de la qualité</div>
              <DialogTitle className="text-xl font-bold">FICHE D'ENTRETIEN DES FRIGOS</DialogTitle>
              <div className="text-lg font-semibold text-gray-800 mt-1">GUINNESS.</div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Informations client */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations sur le client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="division">DIVISION</Label>
                    <Input
                      id="division"
                      value={formData.division}
                      onChange={(e) => handleInputChange('division', e.target.value)}
                      placeholder="Division"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secteur">SECTEUR</Label>
                    <Input
                      id="secteur"
                      value={formData.secteur}
                      onChange={(e) => handleInputChange('secteur', e.target.value)}
                      placeholder="Secteur"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partenaire">PARTENAIRE</Label>
                    <Input
                      id="partenaire"
                      value={formData.partenaire}
                      onChange={(e) => handleInputChange('partenaire', e.target.value)}
                      placeholder="Partenaire"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ville">VILLE</Label>
                    <Input
                      id="ville"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      placeholder="Ville"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomsClient">NOMS CLIENT</Label>
                    <Input
                      id="nomsClient"
                      value={formData.nomsClient}
                      onChange={(e) => handleInputChange('nomsClient', e.target.value)}
                      placeholder="Noms du client"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomPdv">NOM PDV</Label>
                    <Input
                      id="nomPdv"
                      value={formData.nomPdv}
                      onChange={(e) => handleInputChange('nomPdv', e.target.value)}
                      placeholder="Nom du point de vente"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telBarman">TEL BARMAN</Label>
                    <Input
                      id="telBarman"
                      value={formData.telBarman}
                      onChange={(e) => handleInputChange('telBarman', e.target.value)}
                      placeholder="Téléphone barman"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quartier">QUARTIER</Label>
                    <Input
                      id="quartier"
                      value={formData.quartier}
                      onChange={(e) => handleInputChange('quartier', e.target.value)}
                      placeholder="Quartier"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations sur le frigo */}
            <Card>
              <CardHeader>
                <CardTitle>Informations sur le frigo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="typeFrigo">TYPE FRIGO</Label>
                    <Select value={formData.typeFrigo} onValueChange={(value) => handleInputChange('typeFrigo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INNOVA 420">INNOVA 420</SelectItem>
                        <SelectItem value="INNOVA 650">INNOVA 650</SelectItem>
                        <SelectItem value="INNOVA 1000">INNOVA 1000</SelectItem>
                        <SelectItem value="SANDEN 300">SANDEN 300</SelectItem>
                        <SelectItem value="SANDEN 500">SANDEN 500</SelectItem>
                        <SelectItem value="SUPER-35">SUPER-35</SelectItem>
                        <SelectItem value="FV 400">FV 400</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="afNf">AF / NF</Label>
                    <Select value={formData.afNf} onValueChange={(value) => handleInputChange('afNf', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AF">AF</SelectItem>
                        <SelectItem value="NF">NF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branding">BRANDING</Label>
                    <Input
                      id="branding"
                      value={formData.branding}
                      onChange={(e) => handleInputChange('branding', e.target.value)}
                      placeholder="Branding"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sn">SN</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="securite">SÉCURITÉ (DISJONCTEUR/RÉGULATEUR)</Label>
                    <Select value={formData.securite} onValueChange={(value) => handleInputChange('securite', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DISJONCTEUR">DISJONCTEUR</SelectItem>
                        <SelectItem value="RÉGULATEUR">RÉGULATEUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tauxRemplissage">TAUX REMPLISSAGE (EN %)</Label>
                    <Input
                      id="tauxRemplissage"
                      type="number"
                      value={formData.tauxRemplissage}
                      onChange={(e) => handleInputChange('tauxRemplissage', e.target.value)}
                      placeholder="0-100"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eclairage">ÉCLAIRAGE (O/N)</Label>
                    <Select value={formData.eclairage} onValueChange={(value) => handleInputChange('eclairage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="O">O</SelectItem>
                        <SelectItem value="N">N</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">TEMPÉRATURE (EN °C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      placeholder="Température"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lineaire">LINÉAIRE (0/1)</Label>
                    <Select value={formData.lineaire} onValueChange={(value) => handleInputChange('lineaire', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tension">TENSION (en V)</Label>
                    <Input
                      id="tension"
                      type="number"
                      value={formData.tension}
                      onChange={(e) => handleInputChange('tension', e.target.value)}
                      placeholder="Tension en volts"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="intensiteAvant">INTENSITÉ AVANT ENTRETIEN (en A)</Label>
                    <Input
                      id="intensiteAvant"
                      type="number"
                      value={formData.intensiteAvant}
                      onChange={(e) => handleInputChange('intensiteAvant', e.target.value)}
                      placeholder="Intensité avant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intensiteApres">INTENSITÉ APRÈS ENTRETIEN (en A)</Label>
                    <Input
                      id="intensiteApres"
                      type="number"
                      value={formData.intensiteApres}
                      onChange={(e) => handleInputChange('intensiteApres', e.target.value)}
                      placeholder="Intensité après"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="purgeCircuit"
                      checked={formData.purgeCircuit}
                      onCheckedChange={(checked) => handleInputChange('purgeCircuit', checked)}
                    />
                    <Label htmlFor="purgeCircuit">PURGE DU CIRCUIT D'ÉVACUATION DES EAUX</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="soufflageParties"
                      checked={formData.soufflageParties}
                      onCheckedChange={(checked) => handleInputChange('soufflageParties', checked)}
                    />
                    <Label htmlFor="soufflageParties">SOUFFLAGE DES PARTIES ACTIVES À L'AIR</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">OBSERVATIONS / COMMENTAIRES</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange('observations', e.target.value)}
                    placeholder="Observations et commentaires..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signatureBarman">SIGNATURE BARMAN</Label>
                  <Input
                    id="signatureBarman"
                    value={formData.signatureBarman}
                    onChange={(e) => handleInputChange('signatureBarman', e.target.value)}
                    placeholder="Signature du barman"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taeRse">TAE / RSE GUINNESS</Label>
                  <Input
                    id="taeRse"
                    value={formData.taeRse}
                    onChange={(e) => handleInputChange('taeRse', e.target.value)}
                    placeholder="TAE / RSE Guinness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technicienGfi">TECHNICIEN GFI</Label>
                  <Select value={formData.technicienGfi} onValueChange={(value) => handleInputChange('technicienGfi', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un technicien" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VOUKENG">VOUKENG</SelectItem>
                      <SelectItem value="MBAPBOU Grégoire">MBAPBOU Grégoire</SelectItem>
                      <SelectItem value="TCHINDA Constant">TCHINDA Constant</SelectItem>
                      <SelectItem value="Cédric">Cédric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signatures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="nomDateSignature">NOM, DATE, SIGNATURE<br/>TECHNICIEN GFI et TAE OU ASM</Label>
                  <Textarea
                    id="nomDateSignature"
                    value={formData.nomDateSignature}
                    onChange={(e) => handleInputChange('nomDateSignature', e.target.value)}
                    placeholder="Nom, date, signature du technicien GFI et TAE ou ASM"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
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
