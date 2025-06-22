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

interface MovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function MovementForm({ isOpen, onClose, onSave, onBack }: MovementFormProps) {
  const [formData, setFormData] = useState({
    // En-tête
    nomClient: '',
    nomPdv: '',
    
    // 1. Point de départ - Déclaration de pannes
    dateDepart: new Date().toISOString().split('T')[0],
    heureDepart: '',
    ancienFrigoDepart: false,
    nouveauFrigoDepart: false,
    snDepart: '',
    tagNumberDepart: '',
    fv400Depart: false,
    fv420Depart: false,
    sdm500Depart: false,
    sdm650Depart: false,
    extroDepart: false,
    brandingDepart: '',
    autresDepart: '',
    quartierDepart: '',
    emplacementDepart: '',
    organisationDepart: '',
    partenaireDepart: '',
    villeDivisionDepart: '',
    gerantDepart: '',
    proprietaireDepart: '',
    seDepart: '',
    abdmDepart: '',
    
    // 2. Transmission TAS
    tasTransmission: '',
    gulfFroidTransmission: '',
    
    // 3. Point d'arrivée
    nomClientArrivee: '',
    dateArrivee: new Date().toISOString().split('T')[0],
    heureArrivee: '',
    nomPointVenteArrivee: '',
    ancienFrigoArrivee: false,
    nouveauFrigoArrivee: false,
    snArrivee: '',
    tagNumberArrivee: '',
    fv400Arrivee: false,
    fv420Arrivee: false,
    sdm1500Arrivee: false,
    sdm650Arrivee: false,
    extroArrivee: false,
    brandingArrivee: '',
    autresArrivee: '',
    quartierArrivee: '',
    emplacementArrivee: '',
    organisationArrivee: '',
    partenaireArrivee: '',
    villeDivisionArrivee: '',
    gerantArrivee: '',
    proprietaireArrivee: '',
    seArrivee: '',
    abdmArrivee: '',
    
    // Signatures finales
    signatureGulfFroid: '',
    tasSignature: '',
    cpmSignature: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
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
    link.download = `fiche-mouvement-${formData.tagNumberDepart || 'nouveau'}-${formData.dateDepart}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE SUIVI MOUVEMENT DES FRIGOS - POINT DE DÉPART ===

GUINNESS.
Nom du client: ${formData.nomClient}
Nom du PDV: ${formData.nomPdv}

=== POINT DE DÉPART ===
=== 1. DÉCLARATION DE PANNES ===
Date: ${formData.dateDepart}
Heure: ${formData.heureDepart}

Informations sur le frigo:
- Ancien Frigo: ${formData.ancienFrigoDepart ? 'Oui' : 'Non'}
- Nouveau Frigo: ${formData.nouveauFrigoDepart ? 'Oui' : 'Non'}
- S.N: ${formData.snDepart}
- TAG NUMBER: ${formData.tagNumberDepart}

Type de frigo:
- FV400: ${formData.fv400Depart ? 'Oui' : 'Non'}
- FV420: ${formData.fv420Depart ? 'Oui' : 'Non'}
- SDM500: ${formData.sdm500Depart ? 'Oui' : 'Non'}
- SDM650: ${formData.sdm650Depart ? 'Oui' : 'Non'}
- Extro: ${formData.extroDepart ? 'Oui' : 'Non'}
- Branding: ${formData.brandingDepart}
- Autres: ${formData.autresDepart}

Localisation:
- Quartier: ${formData.quartierDepart}
- Emplacement exact: ${formData.emplacementDepart}
- Organisation: ${formData.organisationDepart}
- Partenaire: ${formData.partenaireDepart}
- Ville Division: ${formData.villeDivisionDepart}

Signatures:
- Gérant: ${formData.gerantDepart}
- Propriétaire: ${formData.proprietaireDepart}
- SE: ${formData.seDepart}
- ABDM: ${formData.abdmDepart}

=== 2. TRANSMISSION DU TAS A GULF FROID INDUSTRIEL SARL ===
TAS: ${formData.tasTransmission}
Gulf Froid Industriel SARL: ${formData.gulfFroidTransmission}

=== 3. POINT D'ARRIVÉE ===
Nom du client: ${formData.nomClientArrivee}
Date: ${formData.dateArrivee}
Heure: ${formData.heureArrivee}
Nom du point de vente: ${formData.nomPointVenteArrivee}

Informations sur le frigo:
- Ancien Frigo: ${formData.ancienFrigoArrivee ? 'Oui' : 'Non'}
- Nouveau Frigo: ${formData.nouveauFrigoArrivee ? 'Oui' : 'Non'}
- S.N: ${formData.snArrivee}
- TAG NUMBER: ${formData.tagNumberArrivee}

Type de frigo:
- FV400: ${formData.fv400Arrivee ? 'Oui' : 'Non'}
- FV420: ${formData.fv420Arrivee ? 'Oui' : 'Non'}
- SDM1500: ${formData.sdm1500Arrivee ? 'Oui' : 'Non'}
- SDM650: ${formData.sdm650Arrivee ? 'Oui' : 'Non'}
- Extro: ${formData.extroArrivee ? 'Oui' : 'Non'}
- Branding: ${formData.brandingArrivee}
- Autres: ${formData.autresArrivee}

Localisation:
- Quartier: ${formData.quartierArrivee}
- Emplacement exact: ${formData.emplacementArrivee}
- Organisation: ${formData.organisationArrivee}
- Partenaire: ${formData.partenaireArrivee}
- Ville Division: ${formData.villeDivisionArrivee}

Signatures:
- Gérant: ${formData.gerantArrivee}
- Propriétaire: ${formData.proprietaireArrivee}
- SE: ${formData.seArrivee}
- ABDM: ${formData.abdmArrivee}

=== SIGNATURES FINALES ===
Signature Gulf Froid: ${formData.signatureGulfFroid}
TAS: ${formData.tasSignature}
CPM: ${formData.cpmSignature}

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
              <DialogTitle className="text-xl font-bold">FICHE DE SUIVI MOUVEMENT DES FRIGOS</DialogTitle>
              <div className="text-lg font-semibold text-gray-800 mt-1">POINT DE DÉPART</div>
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

          {/* 1. Point de départ - Déclaration */}
          <Card>
            <CardHeader>
              <CardTitle>POINT DE DÉPART - 1. DÉCLARATION DE PANNES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateDepart">Date</Label>
                  <Input
                    id="dateDepart"
                    type="date"
                    value={formData.dateDepart}
                    onChange={(e) => handleInputChange('dateDepart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heureDepart">HEURE</Label>
                  <Input
                    id="heureDepart"
                    type="time"
                    value={formData.heureDepart}
                    onChange={(e) => handleInputChange('heureDepart', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Informations sur le frigo</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ancienFrigoDepart"
                      checked={formData.ancienFrigoDepart}
                      onCheckedChange={(checked) => handleInputChange('ancienFrigoDepart', checked)}
                    />
                    <Label htmlFor="ancienFrigoDepart">Ancien Frigo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nouveauFrigoDepart"
                      checked={formData.nouveauFrigoDepart}
                      onCheckedChange={(checked) => handleInputChange('nouveauFrigoDepart', checked)}
                    />
                    <Label htmlFor="nouveauFrigoDepart">Nouveau Frigo</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="snDepart">S.N</Label>
                    <Input
                      id="snDepart"
                      value={formData.snDepart}
                      onChange={(e) => handleInputChange('snDepart', e.target.value)}
                      placeholder="Numéro de série"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagNumberDepart">TAG NUMBER</Label>
                    <Input
                      id="tagNumberDepart"
                      value={formData.tagNumberDepart}
                      onChange={(e) => handleInputChange('tagNumberDepart', e.target.value)}
                      placeholder="Numéro de tag"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Type de frigo</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fv400Depart"
                      checked={formData.fv400Depart}
                      onCheckedChange={(checked) => handleInputChange('fv400Depart', checked)}
                    />
                    <Label htmlFor="fv400Depart">FV400</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fv420Depart"
                      checked={formData.fv420Depart}
                      onCheckedChange={(checked) => handleInputChange('fv420Depart', checked)}
                    />
                    <Label htmlFor="fv420Depart">FV420</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sdm500Depart"
                      checked={formData.sdm500Depart}
                      onCheckedChange={(checked) => handleInputChange('sdm500Depart', checked)}
                    />
                    <Label htmlFor="sdm500Depart">SDM500</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sdm650Depart"
                      checked={formData.sdm650Depart}
                      onCheckedChange={(checked) => handleInputChange('sdm650Depart', checked)}
                    />
                    <Label htmlFor="sdm650Depart">SDM650</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extroDepart"
                      checked={formData.extroDepart}
                      onCheckedChange={(checked) => handleInputChange('extroDepart', checked)}
                    />
                    <Label htmlFor="extroDepart">Extro</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandingDepart">Branding</Label>
                    <Input
                      id="brandingDepart"
                      value={formData.brandingDepart}
                      onChange={(e) => handleInputChange('brandingDepart', e.target.value)}
                      placeholder="Branding"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autresDepart">Autres</Label>
                    <Input
                      id="autresDepart"
                      value={formData.autresDepart}
                      onChange={(e) => handleInputChange('autresDepart', e.target.value)}
                      placeholder="Autres types"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Localisation</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="quartierDepart">Quartier</Label>
                    <Input
                      id="quartierDepart"
                      value={formData.quartierDepart}
                      onChange={(e) => handleInputChange('quartierDepart', e.target.value)}
                      placeholder="Quartier"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emplacementDepart">Emplacement exact</Label>
                    <Input
                      id="emplacementDepart"
                      value={formData.emplacementDepart}
                      onChange={(e) => handleInputChange('emplacementDepart', e.target.value)}
                      placeholder="Emplacement exact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organisationDepart">Organisation</Label>
                    <Input
                      id="organisationDepart"
                      value={formData.organisationDepart}
                      onChange={(e) => handleInputChange('organisationDepart', e.target.value)}
                      placeholder="Organisation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partenaireDepart">Partenaire</Label>
                    <Input
                      id="partenaireDepart"
                      value={formData.partenaireDepart}
                      onChange={(e) => handleInputChange('partenaireDepart', e.target.value)}
                      placeholder="Partenaire"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="villeDivisionDepart">Ville Division</Label>
                    <Input
                      id="villeDivisionDepart"
                      value={formData.villeDivisionDepart}
                      onChange={(e) => handleInputChange('villeDivisionDepart', e.target.value)}
                      placeholder="Ville Division"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Nom, prénom, date, signature, n° de signature</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="gerantDepart">GÉRANT</Label>
                    <Input
                      id="gerantDepart"
                      value={formData.gerantDepart}
                      onChange={(e) => handleInputChange('gerantDepart', e.target.value)}
                      placeholder="Gérant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proprietaireDepart">PROPRIÉTAIRE</Label>
                    <Input
                      id="proprietaireDepart"
                      value={formData.proprietaireDepart}
                      onChange={(e) => handleInputChange('proprietaireDepart', e.target.value)}
                      placeholder="Propriétaire"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seDepart">SE</Label>
                    <Input
                      id="seDepart"
                      value={formData.seDepart}
                      onChange={(e) => handleInputChange('seDepart', e.target.value)}
                      placeholder="SE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abdmDepart">ABDM</Label>
                    <Input
                      id="abdmDepart"
                      value={formData.abdmDepart}
                      onChange={(e) => handleInputChange('abdmDepart', e.target.value)}
                      placeholder="ABDM"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Transmission TAS */}
          <Card>
            <CardHeader>
              <CardTitle>2. TRANSMISSION DU TAS A GULF FROID INDUSTRIEL SARL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tasTransmission">TAS</Label>
                  <Input
                    id="tasTransmission"
                    value={formData.tasTransmission}
                    onChange={(e) => handleInputChange('tasTransmission', e.target.value)}
                    placeholder="Nom, prénom, date, signature TAS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gulfFroidTransmission">GULF FROID INDUSTRIEL SARL</Label>
                  <Input
                    id="gulfFroidTransmission"
                    value={formData.gulfFroidTransmission}
                    onChange={(e) => handleInputChange('gulfFroidTransmission', e.target.value)}
                    placeholder="Gulf Froid Industriel SARL"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Point d'arrivée */}
          <Card>
            <CardHeader>
              <CardTitle>3. POINT D'ARRIVÉE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomClientArrivee">NOM DU CLIENT</Label>
                  <Input
                    id="nomClientArrivee"
                    value={formData.nomClientArrivee}
                    onChange={(e) => handleInputChange('nomClientArrivee', e.target.value)}
                    placeholder="Nom du client à l'arrivée"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomPointVenteArrivee">NOM DU POINT DE VENTE</Label>
                  <Input
                    id="nomPointVenteArrivee"
                    value={formData.nomPointVenteArrivee}
                    onChange={(e) => handleInputChange('nomPointVenteArrivee', e.target.value)}
                    placeholder="Nom du point de vente"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateArrivee">Date</Label>
                  <Input
                    id="dateArrivee"
                    type="date"
                    value={formData.dateArrivee}
                    onChange={(e) => handleInputChange('dateArrivee', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heureArrivee">HEURE</Label>
                  <Input
                    id="heureArrivee"
                    type="time"
                    value={formData.heureArrivee}
                    onChange={(e) => handleInputChange('heureArrivee', e.target.value)}
                  />
                </div>
              </div>

              {/* ... keep existing code (similar structure as departure but for arrival) */}
              
              <div>
                <Label className="text-base font-medium">Informations sur le frigo</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ancienFrigoArrivee"
                      checked={formData.ancienFrigoArrivee}
                      onCheckedChange={(checked) => handleInputChange('ancienFrigoArrivee', checked)}
                    />
                    <Label htmlFor="ancienFrigoArrivee">Ancien Frigo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nouveauFrigoArrivee"
                      checked={formData.nouveauFrigoArrivee}
                      onCheckedChange={(checked) => handleInputChange('nouveauFrigoArrivee', checked)}
                    />
                    <Label htmlFor="nouveauFrigoArrivee">Nouveau Frigo</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="snArrivee">S.N</Label>
                    <Input
                      id="snArrivee"
                      value={formData.snArrivee}
                      onChange={(e) => handleInputChange('snArrivee', e.target.value)}
                      placeholder="Numéro de série"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagNumberArrivee">TAG NUMBER</Label>
                    <Input
                      id="tagNumberArrivee"
                      value={formData.tagNumberArrivee}
                      onChange={(e) => handleInputChange('tagNumberArrivee', e.target.value)}
                      placeholder="Numéro de tag"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Type de frigo</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fv400Arrivee"
                      checked={formData.fv400Arrivee}
                      onCheckedChange={(checked) => handleInputChange('fv400Arrivee', checked)}
                    />
                    <Label htmlFor="fv400Arrivee">FV400</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fv420Arrivee"
                      checked={formData.fv420Arrivee}
                      onCheckedChange={(checked) => handleInputChange('fv420Arrivee', checked)}
                    />
                    <Label htmlFor="fv420Arrivee">FV420</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sdm1500Arrivee"
                      checked={formData.sdm1500Arrivee}
                      onCheckedChange={(checked) => handleInputChange('sdm1500Arrivee', checked)}
                    />
                    <Label htmlFor="sdm1500Arrivee">SDM1500</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sdm650Arrivee"
                      checked={formData.sdm650Arrivee}
                      onCheckedChange={(checked) => handleInputChange('sdm650Arrivee', checked)}
                    />
                    <Label htmlFor="sdm650Arrivee">SDM650</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extroArrivee"
                      checked={formData.extroArrivee}
                      onCheckedChange={(checked) => handleInputChange('extroArrivee', checked)}
                    />
                    <Label htmlFor="extroArrivee">Extro</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="brandingArrivee">Branding</Label>
                    <Input
                      id="brandingArrivee"
                      value={formData.brandingArrivee}
                      onChange={(e) => handleInputChange('brandingArrivee', e.target.value)}
                      placeholder="Branding"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autresArrivee">Autres</Label>
                    <Input
                      id="autresArrivee"
                      value={formData.autresArrivee}
                      onChange={(e) => handleInputChange('autresArrivee', e.target.value)}
                      placeholder="Autres types"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Localisation</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="quartierArrivee">Quartier</Label>
                    <Input
                      id="quartierArrivee"
                      value={formData.quartierArrivee}
                      onChange={(e) => handleInputChange('quartierArrivee', e.target.value)}
                      placeholder="Quartier"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emplacementArrivee">Emplacement exact</Label>
                    <Input
                      id="emplacementArrivee"
                      value={formData.emplacementArrivee}
                      onChange={(e) => handleInputChange('emplacementArrivee', e.target.value)}
                      placeholder="Emplacement exact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organisationArrivee">Organisation</Label>
                    <Input
                      id="organisationArrivee"
                      value={formData.organisationArrivee}
                      onChange={(e) => handleInputChange('organisationArrivee', e.target.value)}
                      placeholder="Organisation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partenaireArrivee">Partenaire</Label>
                    <Input
                      id="partenaireArrivee"
                      value={formData.partenaireArrivee}
                      onChange={(e) => handleInputChange('partenaireArrivee', e.target.value)}
                      placeholder="Partenaire"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="villeDivisionArrivee">Ville Division</Label>
                    <Input
                      id="villeDivisionArrivee"
                      value={formData.villeDivisionArrivee}
                      onChange={(e) => handleInputChange('villeDivisionArrivee', e.target.value)}
                      placeholder="Ville Division"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Nom, prénom, date, signature, n° de signature</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="gerantArrivee">GÉRANT</Label>
                    <Input
                      id="gerantArrivee"
                      value={formData.gerantArrivee}
                      onChange={(e) => handleInputChange('gerantArrivee', e.target.value)}
                      placeholder="Gérant"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proprietaireArrivee">PROPRIÉTAIRE</Label>
                    <Input
                      id="proprietaireArrivee"
                      value={formData.proprietaireArrivee}
                      onChange={(e) => handleInputChange('proprietaireArrivee', e.target.value)}
                      placeholder="Propriétaire"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seArrivee">SE</Label>
                    <Input
                      id="seArrivee"
                      value={formData.seArrivee}
                      onChange={(e) => handleInputChange('seArrivee', e.target.value)}
                      placeholder="SE"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="abdmArrivee">ABDM</Label>
                    <Input
                      id="abdmArrivee"
                      value={formData.abdmArrivee}
                      onChange={(e) => handleInputChange('abdmArrivee', e.target.value)}
                      placeholder="ABDM"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signatures finales */}
          <Card>
            <CardHeader>
              <CardTitle>Signatures finales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signatureGulfFroid">Signature GULF FROID (Nom - Prénom - Signature - N° Téléphone)</Label>
                <Input
                  id="signatureGulfFroid"
                  value={formData.signatureGulfFroid}
                  onChange={(e) => handleInputChange('signatureGulfFroid', e.target.value)}
                  placeholder="Signature Gulf Froid"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tasSignature">TAS</Label>
                  <Input
                    id="tasSignature"
                    value={formData.tasSignature}
                    onChange={(e) => handleInputChange('tasSignature', e.target.value)}
                    placeholder="Nom, prénom, date, signature TAS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpmSignature">CPM</Label>
                  <Input
                    id="cpmSignature"
                    value={formData.cpmSignature}
                    onChange={(e) => handleInputChange('cpmSignature', e.target.value)}
                    placeholder="Nom, prénom, date, signature CPM"
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
