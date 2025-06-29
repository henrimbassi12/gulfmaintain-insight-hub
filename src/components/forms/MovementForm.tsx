
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
    // En-tête
    nomClient: '',
    nomPdv: '',
    
    // Point de départ - Déclaration
    dateDepart: new Date().toISOString().split('T')[0],
    heureDepart: '',
    ancienFrigoDepart: '',
    nouveauFrigoDepart: '',
    snDepart: '',
    tagNumberDepart: '',
    typeFrigoDepart: '',
    quartierDepart: '',
    emplacementDepart: '',
    organisationDepart: '',
    partenaireDepart: '',
    villeDivisionDepart: '',
    signatureDepart: '',
    
    // Transmission TAS
    signatureTas: '',
    signatureGulfFroid: '',
    
    // Point d'arrivée
    nomClientArrivee: '',
    dateArrivee: new Date().toISOString().split('T')[0],
    heureArrivee: '',
    nomPdvArrivee: '',
    ancienFrigoArrivee: '',
    nouveauFrigoArrivee: '',
    snArrivee: '',
    tagNumberArrivee: '',
    typeFrigoArrivee: '',
    quartierArrivee: '',
    emplacementArrivee: '',
    organisationArrivee: '',
    partenaireArrivee: '',
    villeDivisionArrivee: '',
    signatureArrivee: '',
    
    // Bas de page
    signatureGulfFroidBas: '',
    signatureTasBas: '',
    signatureCpm: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Fiche de suivi mouvement des frigos sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-mouvement-frigos-${formData.nomPdv || 'nouveau'}-${formData.dateDepart}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE SUIVI MOUVEMENT DES FRIGOS - POINT DE DEPART ===

GUINNESS.
Nom du client: ${formData.nomClient}
Nom du PDV: ${formData.nomPdv}

=== POINT DE DEPART ===
=== 1. DÉCLARATION DE PANNES ===
Date: ${formData.dateDepart}
Heure: ${formData.heureDepart}

Informations sur le frigo:
- Ancien Frigo: ${formData.ancienFrigoDepart}
- Nouveau Frigo: ${formData.nouveauFrigoDepart}
- S.N: ${formData.snDepart}
- TAG NUMBER: ${formData.tagNumberDepart}

Type de frigo: ${formData.typeFrigoDepart}

Localisation:
- Quartier: ${formData.quartierDepart}
- Emplacement exact: ${formData.emplacementDepart}
- Organisation: ${formData.organisationDepart}
- Partenaire: ${formData.partenaireDepart}
- Ville Division: ${formData.villeDivisionDepart}

Signatures: ${formData.signatureDepart}

=== 2. TRANSMISSION DU TAS A GULF FROID INDUSTRIEL SARL ===
TAS: ${formData.signatureTas}
GULF FROID INDUSTRIEL SARL: ${formData.signatureGulfFroid}

=== 3. POINT D'ARRIVÉE ===
Nom du client: ${formData.nomClientArrivee}
Date: ${formData.dateArrivee}
Heure: ${formData.heureArrivee}
Nom du point de vente: ${formData.nomPdvArrivee}

Informations sur le frigo:
- Ancien Frigo: ${formData.ancienFrigoArrivee}
- Nouveau Frigo: ${formData.nouveauFrigoArrivee}
- S.N: ${formData.snArrivee}
- TAG NUMBER: ${formData.tagNumberArrivee}

Type de frigo: ${formData.typeFrigoArrivee}

Localisation:
- Quartier: ${formData.quartierArrivee}
- Emplacement exact: ${formData.emplacementArrivee}
- Organisation: ${formData.organisationArrivee}
- Partenaire: ${formData.partenaireArrivee}
- Ville Division: ${formData.villeDivisionArrivee}

Signatures: ${formData.signatureArrivee}

=== BAS DE PAGE ===
Signature GULF FROID: ${formData.signatureGulfFroidBas}
TAS: ${formData.signatureTasBas}
CPM: ${formData.signatureCpm}

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
              <DialogTitle className="text-xl font-bold">FICHE DE SUIVI MOUVEMENT DES FRIGOS - POINT DE DEPART</DialogTitle>
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

          {/* Point de départ */}
          <Card>
            <CardHeader>
              <CardTitle>POINT DE DEPART</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">1. DÉCLARATION DE PANNES</h4>
                <div className="space-y-4">
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

                  <div className="space-y-4">
                    <h5 className="font-medium">Informations sur le frigo:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ancienFrigoDepart">Ancien Frigo</Label>
                        <Input
                          id="ancienFrigoDepart"
                          value={formData.ancienFrigoDepart}
                          onChange={(e) => handleInputChange('ancienFrigoDepart', e.target.value)}
                          placeholder="Ancien frigo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nouveauFrigoDepart">Nouveau Frigo</Label>
                        <Input
                          id="nouveauFrigoDepart"
                          value={formData.nouveauFrigoDepart}
                          onChange={(e) => handleInputChange('nouveauFrigoDepart', e.target.value)}
                          placeholder="Nouveau frigo"
                        />
                      </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="typeFrigoDepart">Type de frigo</Label>
                    <Select value={formData.typeFrigoDepart} onValueChange={(value) => handleInputChange('typeFrigoDepart', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FV400">FV400</SelectItem>
                        <SelectItem value="FV420">FV420</SelectItem>
                        <SelectItem value="SDM500">SDM500</SelectItem>
                        <SelectItem value="SDM650">SDM650</SelectItem>
                        <SelectItem value="Extro">Extro</SelectItem>
                        <SelectItem value="Branding">Branding</SelectItem>
                        <SelectItem value="Autres">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium">Localisation:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="signatureDepart">Nom, prénom, date, signature, n° de signature (GÉRANT, PROPRIÉTAIRE, SE, ABDM)</Label>
                    <Textarea
                      id="signatureDepart"
                      value={formData.signatureDepart}
                      onChange={(e) => handleInputChange('signatureDepart', e.target.value)}
                      placeholder="Signatures multiples..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">2. TRANSMISSION DU TAS A GULF FROID INDUSTRIEL SARL</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signatureTas">TAS (Nom, prénom, date, signature, n° de signature)</Label>
                    <Input
                      id="signatureTas"
                      value={formData.signatureTas}
                      onChange={(e) => handleInputChange('signatureTas', e.target.value)}
                      placeholder="Signature TAS"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signatureGulfFroid">GULF FROID INDUSTRIEL SARL</Label>
                    <Input
                      id="signatureGulfFroid"
                      value={formData.signatureGulfFroid}
                      onChange={(e) => handleInputChange('signatureGulfFroid', e.target.value)}
                      placeholder="Signature Gulf Froid"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Point d'arrivée */}
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
                    placeholder="Nom du client"
                  />
                </div>
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
                <div className="space-y-2">
                  <Label htmlFor="nomPdvArrivee">NOM DU POINT DE VENTE</Label>
                  <Input
                    id="nomPdvArrivee"
                    value={formData.nomPdvArrivee}
                    onChange={(e) => handleInputChange('nomPdvArrivee', e.target.value)}
                    placeholder="Nom du point de vente"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Informations sur le frigo:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ancienFrigoArrivee">Ancien Frigo</Label>
                    <Input
                      id="ancienFrigoArrivee"
                      value={formData.ancienFrigoArrivee}
                      onChange={(e) => handleInputChange('ancienFrigoArrivee', e.target.value)}
                      placeholder="Ancien frigo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nouveauFrigoArrivee">Nouveau Frigo</Label>
                    <Input
                      id="nouveauFrigoArrivee"
                      value={formData.nouveauFrigoArrivee}
                      onChange={(e) => handleInputChange('nouveauFrigoArrivee', e.target.value)}
                      placeholder="Nouveau frigo"
                    />
                  </div>
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

              <div className="space-y-2">
                <Label htmlFor="typeFrigoArrivee">Type de frigo</Label>
                <Select value={formData.typeFrigoArrivee} onValueChange={(value) => handleInputChange('typeFrigoArrivee', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FV400">FV400</SelectItem>
                    <SelectItem value="FV420">FV420</SelectItem>
                    <SelectItem value="SDM1500">SDM1500</SelectItem>
                    <SelectItem value="SDM650">SDM650</SelectItem>
                    <SelectItem value="Extro">Extro</SelectItem>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h5 className="font-medium">Localisation:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="signatureArrivee">Nom, prénom, date, signature, n° de signature (GÉRANT, PROPRIÉTAIRE, SE, ABDM)</Label>
                <Textarea
                  id="signatureArrivee"
                  value={formData.signatureArrivee}
                  onChange={(e) => handleInputChange('signatureArrivee', e.target.value)}
                  placeholder="Signatures multiples..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bas de page */}
          <Card>
            <CardHeader>
              <CardTitle>Bas de page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signatureGulfFroidBas">Signature GULF FROID (Nom - Prénom - Signature - N° Téléphone)</Label>
                <Input
                  id="signatureGulfFroidBas"
                  value={formData.signatureGulfFroidBas}
                  onChange={(e) => handleInputChange('signatureGulfFroidBas', e.target.value)}
                  placeholder="Gulf Froid - Nom, prénom, signature, téléphone"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signatureTasBas">TAS (Nom, prénom, date, signature, n° de signature)</Label>
                  <Input
                    id="signatureTasBas"
                    value={formData.signatureTasBas}
                    onChange={(e) => handleInputChange('signatureTasBas', e.target.value)}
                    placeholder="Signature TAS"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signatureCpm">CPM</Label>
                  <Input
                    id="signatureCpm"
                    value={formData.signatureCpm}
                    onChange={(e) => handleInputChange('signatureCpm', e.target.value)}
                    placeholder="Signature CPM"
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
