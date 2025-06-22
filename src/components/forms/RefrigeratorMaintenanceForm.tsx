
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

interface RefrigeratorMaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function RefrigeratorMaintenanceForm({ isOpen, onClose, onSave, onBack }: RefrigeratorMaintenanceFormProps) {
  const [formData, setFormData] = useState({
    // Informations client et localisation
    division: '',
    secteur: '',
    partenaire: '',
    ville: '',
    nomsClient: '',
    nomPdv: '',
    telBarman: '',
    quartier: '',
    localisation: '',
    
    // Informations frigo
    typeFrigo: '',
    afNf: '', // AF/NF
    branding: '',
    sn: '',
    tagNumber: '',
    
    // Contrôles techniques
    securite: '', // Disjoncteur/Régulateur
    tauxRemplissage: '', // En %
    eclairage: '', // O/N
    temperature: '', // En degrés Celsius
    lineaire: '', // 0/1
    tension: '', // En V
    intensiteAvant: '', // En A
    intensiteApres: '', // En A
    purgeCircuit: false,
    soufflageParties: false,
    
    // Observations et signatures
    observations: '',
    signatureBarman: '',
    taeRseGuinness: '',
    technicienGfi: '',
    
    // Bas de page
    nomDateSignatureTechnicien: '',
    nomDateSignatureTae: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
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
    link.download = `fiche-entretien-${formData.tagNumber || 'nouveau'}-${new Date().toISOString().split('T')[0]}.txt`;
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

=== INFORMATIONS CLIENT ET LOCALISATION ===
Division: ${formData.division}
Secteur: ${formData.secteur}
Partenaire: ${formData.partenaire}
Ville: ${formData.ville}
Noms client: ${formData.nomsClient}
Nom PDV: ${formData.nomPdv}
Tel barman: ${formData.telBarman}
Quartier: ${formData.quartier}
Localisation: ${formData.localisation}

=== INFORMATIONS SUR LE FRIGO ===
Type frigo: ${formData.typeFrigo}
AF/NF: ${formData.afNf}
Branding: ${formData.branding}
SN: ${formData.sn}
TAG NUMBER: ${formData.tagNumber}

=== CONTRÔLES TECHNIQUES ===
Sécurité (Disjoncteur/Régulateur): ${formData.securite}
Taux remplissage (%): ${formData.tauxRemplissage}
Éclairage (O/N): ${formData.eclairage}
Température (°C): ${formData.temperature}
Linéaire (0/1): ${formData.lineaire}
Tension (V): ${formData.tension}
Intensité avant entretien (A): ${formData.intensiteAvant}
Intensité après entretien (A): ${formData.intensiteApres}
Purge du circuit d'évacuation des eaux: ${formData.purgeCircuit ? 'Effectuée' : 'Non effectuée'}
Soufflage des parties actives à l'air: ${formData.soufflageParties ? 'Effectué' : 'Non effectué'}

=== OBSERVATIONS ===
${formData.observations}

=== SIGNATURES ===
Signature barman: ${formData.signatureBarman}
TAE/RSE Guinness: ${formData.taeRseGuinness}
Technicien GFI: ${formData.technicienGfi}

Technicien GFI: ${formData.nomDateSignatureTechnicien}
TAE ou ASM: ${formData.nomDateSignatureTae}

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
              <div className="text-sm text-gray-600 mb-1">Gulf Froid Industriel, le partenaire de la qualité</div>
              <DialogTitle className="text-xl font-bold">FICHE D'ENTRETIEN DES FRIGOS</DialogTitle>
              <div className="text-lg font-semibold text-gray-800 mt-1">GUINNESS.</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations client et localisation */}
          <Card>
            <CardHeader>
              <CardTitle>Informations client et localisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    placeholder="Téléphone du barman"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quartier">QUARTIER</Label>
                  <Input
                    id="quartier"
                    value={formData.quartier}
                    onChange={(e) => handleInputChange('quartier', e.target.value)}
                    placeholder="Quartier"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="localisation">LOCALISATION</Label>
                  <Input
                    id="localisation"
                    value={formData.localisation}
                    onChange={(e) => handleInputChange('localisation', e.target.value)}
                    placeholder="Localisation précise"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations sur le frigo */}
          <Card>
            <CardHeader>
              <CardTitle>INFORMATION SUR LE FRIGO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeFrigo">TYPE FRIGO</Label>
                  <Input
                    id="typeFrigo"
                    value={formData.typeFrigo}
                    onChange={(e) => handleInputChange('typeFrigo', e.target.value)}
                    placeholder="Type de frigo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="afNf">AF / NF</Label>
                  <Select value={formData.afNf} onValueChange={(value) => handleInputChange('afNf', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="AF ou NF" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AF">AF (Ancien Frigo)</SelectItem>
                      <SelectItem value="NF">NF (Nouveau Frigo)</SelectItem>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>

          {/* Contrôles techniques */}
          <Card>
            <CardHeader>
              <CardTitle>Contrôles techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="securite">SÉCURITÉ (DISJONCTEUR / RÉGULATEUR)</Label>
                  <Input
                    id="securite"
                    value={formData.securite}
                    onChange={(e) => handleInputChange('securite', e.target.value)}
                    placeholder="État de la sécurité"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tauxRemplissage">TAUX REMPLISSAGE (EN %)</Label>
                  <Input
                    id="tauxRemplissage"
                    type="number"
                    value={formData.tauxRemplissage}
                    onChange={(e) => handleInputChange('tauxRemplissage', e.target.value)}
                    placeholder="Pourcentage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eclairage">ÉCLAIRAGE (O / N)</Label>
                  <Select value={formData.eclairage} onValueChange={(value) => handleInputChange('eclairage', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="O ou N" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="O">O (Oui)</SelectItem>
                      <SelectItem value="N">N (Non)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">TEMPÉRATURE (EN °C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    placeholder="Température en °C"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineaire">LINÉAIRE (0 / 1)</Label>
                  <Select value={formData.lineaire} onValueChange={(value) => handleInputChange('lineaire', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="0 ou 1" />
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
                    placeholder="Tension en V"
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
                    placeholder="Intensité en A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="intensiteApres">INTENSITÉ APRÈS ENTRETIEN (en A)</Label>
                  <Input
                    id="intensiteApres"
                    type="number"
                    value={formData.intensiteApres}
                    onChange={(e) => handleInputChange('intensiteApres', e.target.value)}
                    placeholder="Intensité en A"
                  />
                </div>
              </div>

              <div className="space-y-3">
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
            </CardContent>
          </Card>

          {/* Observations et signatures */}
          <Card>
            <CardHeader>
              <CardTitle>Observations et signatures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="observations">OBSERVATIONS / COMMENTAIRES</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  placeholder="Observations et commentaires..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signatureBarman">SIGNATURE BARMAN</Label>
                  <Input
                    id="signatureBarman"
                    value={formData.signatureBarman}
                    onChange={(e) => handleInputChange('signatureBarman', e.target.value)}
                    placeholder="Signature du barman"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taeRseGuinness">TAE / RSE GUINNESS</Label>
                  <Input
                    id="taeRseGuinness"
                    value={formData.taeRseGuinness}
                    onChange={(e) => handleInputChange('taeRseGuinness', e.target.value)}
                    placeholder="TAE/RSE Guinness"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technicienGfi">TECHNICIEN GFI</Label>
                  <Input
                    id="technicienGfi"
                    value={formData.technicienGfi}
                    onChange={(e) => handleInputChange('technicienGfi', e.target.value)}
                    placeholder="Technicien GFI"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-base font-medium">NOM, DATE, SIGNATURE</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="nomDateSignatureTechnicien">TECHNICIEN GFI</Label>
                    <Input
                      id="nomDateSignatureTechnicien"
                      value={formData.nomDateSignatureTechnicien}
                      onChange={(e) => handleInputChange('nomDateSignatureTechnicien', e.target.value)}
                      placeholder="Nom, date, signature technicien GFI"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomDateSignatureTae">TAE OU ASM</Label>
                    <Input
                      id="nomDateSignatureTae"
                      value={formData.nomDateSignatureTae}
                      onChange={(e) => handleInputChange('nomDateSignatureTae', e.target.value)}
                      placeholder="Nom, date, signature TAE ou ASM"
                    />
                  </div>
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
