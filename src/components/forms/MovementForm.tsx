
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface MovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function MovementForm({ isOpen, onClose, onSave }: MovementFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    pdvName: '',
    // 1. Point de départ
    departure: {
        date: '',
        time: '',
        oldFridge: false,
        newFridge: false,
        sn: '',
        tagNumber: '',
        fridgeType: '',
        branding: '',
        others: '',
        localisation: '',
        quartier: '',
        emplacementExact: '',
        organisation: '',
        partenaire: '',
        villeDivision: '',
        signatures: {
            gerant: '',
            proprietaire: '',
            se: '',
            abdm: '',
        }
    },
    // 2. Transmission
    transmission: {
        tas: '',
        gulfFroid: '',
    },
    // 3. Point d'arrivée
    arrival: {
        clientName: '',
        pdvName: '',
        date: '',
        time: '',
        oldFridge: false,
        newFridge: false,
        sn: '',
        tagNumber: '',
        fridgeType: '',
        branding: '',
        others: '',
        localisation: '',
        quartier: '',
        emplacementExact: '',
        organisation: '',
        partenaire: '',
        villeDivision: '',
        gulfFroidSignature: '',
        signatures: {
            gerant: '',
            proprietaire: '',
            se: '',
            abdm: '',
        },
        finalSignatures: {
            tas: '',
            cpm: '',
        }
    }
  });

  const handleSave = () => {
    onSave({
      ...formData,
      type: 'fridge_movement',
      created_at: new Date().toISOString()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gray-100">
          <CardTitle className="flex justify-between items-center">
            <span>Fiche de Suivi de Mouvement des Frigos</span>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* En-tête */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Nom du Client</Label>
              <Input 
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="pdvName">Nom du PDV</Label>
              <Input 
                id="pdvName"
                value={formData.pdvName}
                onChange={(e) => setFormData({...formData, pdvName: e.target.value})}
              />
            </div>
          </div>
          
          <Separator />

          {/* 1. Déclaration de pannes - Point de départ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">1. DÉCLARATION DE PANNES - POINT DE DÉPART</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="departureDate">Date</Label>
                <Input id="departureDate" type="date" value={formData.departure.date} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, date: e.target.value}}))} />
              </div>
              <div>
                <Label htmlFor="departureTime">Heure</Label>
                <Input id="departureTime" type="time" value={formData.departure.time} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, time: e.target.value}}))} />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Informations sur le frigo</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="departureOldFridge" checked={formData.departure.oldFridge} onCheckedChange={(checked) => setFormData(prev => ({...prev, departure: {...prev.departure, oldFridge: !!checked}}))} />
                  <Label htmlFor="departureOldFridge">Ancien Frigo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="departureNewFridge" checked={formData.departure.newFridge} onCheckedChange={(checked) => setFormData(prev => ({...prev, departure: {...prev.departure, newFridge: !!checked}}))} />
                  <Label htmlFor="departureNewFridge">Nouveau Frigo</Label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="departureSN">S.N</Label><Input id="departureSN" value={formData.departure.sn} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, sn: e.target.value}}))} /></div>
                <div><Label htmlFor="departureTagNumber">Tag Number</Label><Input id="departureTagNumber" value={formData.departure.tagNumber} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, tagNumber: e.target.value}}))} /></div>
                <div><Label htmlFor="departureBranding">Branding</Label><Input id="departureBranding" value={formData.departure.branding} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, branding: e.target.value}}))} /></div>
              </div>
              
              <div>
                <Label htmlFor="departureFridgeType">Type de frigo</Label>
                <Select value={formData.departure.fridgeType} onValueChange={(value) => setFormData(prev => ({...prev, departure: {...prev.departure, fridgeType: value}}))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner le type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FV400">FV400</SelectItem><SelectItem value="FV420">FV420</SelectItem><SelectItem value="SDM1500">SDM1500</SelectItem><SelectItem value="SDM650">SDM650</SelectItem><SelectItem value="Extro">Extro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div><Label htmlFor="departureOthers">Autres</Label><Input id="departureOthers" value={formData.departure.others} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, others: e.target.value}}))} /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="departureLocalisation">Localisation</Label><Input id="departureLocalisation" value={formData.departure.localisation} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, localisation: e.target.value}}))} /></div>
                <div><Label htmlFor="departureQuartier">Quartier</Label><Input id="departureQuartier" value={formData.departure.quartier} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, quartier: e.target.value}}))} /></div>
              </div>

              <div><Label htmlFor="departureEmplacementExact">Emplacement exact</Label><Input id="departureEmplacementExact" value={formData.departure.emplacementExact} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, emplacementExact: e.target.value}}))} /></div>

              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="departureOrganisation">Organisation</Label><Input id="departureOrganisation" value={formData.departure.organisation} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, organisation: e.target.value}}))} /></div>
                <div><Label htmlFor="departurePartenaire">Partenaire</Label><Input id="departurePartenaire" value={formData.departure.partenaire} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, partenaire: e.target.value}}))} /></div>
                <div><Label htmlFor="departureVilleDivision">Ville Division</Label><Input id="departureVilleDivision" value={formData.departure.villeDivision} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, villeDivision: e.target.value}}))} /></div>
              </div>

              <div>
                <Label className="text-base font-medium">Nom, prenom, date, signature, n° de signature</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div><Label htmlFor="depSigGerant">GERANT</Label><Textarea rows={3} id="depSigGerant" value={formData.departure.signatures.gerant} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, signatures: {...prev.departure.signatures, gerant: e.target.value}}}))} /></div>
                  <div><Label htmlFor="depSigProprietaire">PROPRIETAIRE</Label><Textarea rows={3} id="depSigProprietaire" value={formData.departure.signatures.proprietaire} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, signatures: {...prev.departure.signatures, proprietaire: e.target.value}}}))} /></div>
                  <div><Label htmlFor="depSigSE">SE</Label><Textarea rows={3} id="depSigSE" value={formData.departure.signatures.se} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, signatures: {...prev.departure.signatures, se: e.target.value}}}))} /></div>
                  <div><Label htmlFor="depSigABDM">ABDM</Label><Textarea rows={3} id="depSigABDM" value={formData.departure.signatures.abdm} onChange={(e) => setFormData(prev => ({...prev, departure: {...prev.departure, signatures: {...prev.departure.signatures, abdm: e.target.value}}}))} /></div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* 2. Transmission du TAS à Gulf Froid Industriel */}
          <div>
            <h3 className="text-lg font-semibold mb-4">2. TRANSMISSION DU TAS À GULF FROID INDUSTRIEL SARL</h3>
            <Label className="text-base font-medium">Nom, prenom, date, signature, n° de signature</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div><Label htmlFor="transTAS">TAS</Label><Textarea rows={3} id="transTAS" value={formData.transmission.tas} onChange={(e) => setFormData(prev => ({...prev, transmission: {...prev.transmission, tas: e.target.value}}))} /></div>
              <div><Label htmlFor="transGulf">GULF FROID INDUSTRIEL SARL</Label><Textarea rows={3} id="transGulf" value={formData.transmission.gulfFroid} onChange={(e) => setFormData(prev => ({...prev, transmission: {...prev.transmission, gulfFroid: e.target.value}}))} /></div>
            </div>
          </div>

          <Separator />

          {/* 3. Point d'arrivée */}
          <div>
            <h3 className="text-lg font-semibold mb-4">3. POINT D'ARRIVÉE</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><Label htmlFor="arrivalClientName">Nom du Client</Label><Input id="arrivalClientName" value={formData.arrival.clientName} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, clientName: e.target.value}}))} /></div>
              <div><Label htmlFor="arrivalPdvName">Nom du Point de Vente</Label><Input id="arrivalPdvName" value={formData.arrival.pdvName} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, pdvName: e.target.value}}))} /></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div><Label htmlFor="arrivalDate">Date</Label><Input id="arrivalDate" type="date" value={formData.arrival.date} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, date: e.target.value}}))} /></div>
              <div><Label htmlFor="arrivalTime">Heure</Label><Input id="arrivalTime" type="time" value={formData.arrival.time} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, time: e.target.value}}))} /></div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Informations sur le frigo</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center space-x-2"><Checkbox id="arrivalOldFridge" checked={formData.arrival.oldFridge} onCheckedChange={(checked) => setFormData(prev => ({...prev, arrival: {...prev.arrival, oldFridge: !!checked}}))} /><Label htmlFor="arrivalOldFridge">Ancien Frigo</Label></div>
                <div className="flex items-center space-x-2"><Checkbox id="arrivalNewFridge" checked={formData.arrival.newFridge} onCheckedChange={(checked) => setFormData(prev => ({...prev, arrival: {...prev.arrival, newFridge: !!checked}}))} /><Label htmlFor="arrivalNewFridge">Nouveau Frigo</Label></div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="arrivalSN">S.N</Label><Input id="arrivalSN" value={formData.arrival.sn} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, sn: e.target.value}}))} /></div>
                <div><Label htmlFor="arrivalTagNumber">Tag Number</Label><Input id="arrivalTagNumber" value={formData.arrival.tagNumber} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, tagNumber: e.target.value}}))} /></div>
                <div><Label htmlFor="arrivalBranding">Branding</Label><Input id="arrivalBranding" value={formData.arrival.branding} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, branding: e.target.value}}))} /></div>
              </div>

              <div>
                <Label htmlFor="arrivalFridgeType">Type de frigo</Label>
                <Select value={formData.arrival.fridgeType} onValueChange={(value) => setFormData(prev => ({...prev, arrival: {...prev.arrival, fridgeType: value}}))}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner le type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FV400">FV400</SelectItem><SelectItem value="FV420">FV420</SelectItem><SelectItem value="SDM1500">SDM1500</SelectItem><SelectItem value="SDM650">SDM650</SelectItem><SelectItem value="Extro">Extro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div><Label htmlFor="arrivalOthers">Autres</Label><Input id="arrivalOthers" value={formData.arrival.others} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, others: e.target.value}}))} /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="arrivalLocalisation">Localisation</Label><Input id="arrivalLocalisation" value={formData.arrival.localisation} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, localisation: e.target.value}}))} /></div>
                <div><Label htmlFor="arrivalQuartier">Quartier</Label><Input id="arrivalQuartier" value={formData.arrival.quartier} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, quartier: e.target.value}}))} /></div>
              </div>

              <div><Label htmlFor="arrivalEmplacementExact">Emplacement exact</Label><Input id="arrivalEmplacementExact" value={formData.arrival.emplacementExact} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, emplacementExact: e.target.value}}))} /></div>

              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="arrivalOrganisation">Organisation</Label><Input id="arrivalOrganisation" value={formData.arrival.organisation} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, organisation: e.target.value}}))} /></div>
                <div><Label htmlFor="arrivalPartenaire">Partenaire</Label><Input id="arrivalPartenaire" value={formData.arrival.partenaire} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, partenaire: e.target.value}}))} /></div>
                <div><Label htmlFor="arrivalVilleDivision">Ville Division</Label><Input id="arrivalVilleDivision" value={formData.arrival.villeDivision} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, villeDivision: e.target.value}}))} /></div>
              </div>

              <div><Label htmlFor="arrivalGulfSig">Signature GULF FROID (Nom - Prenom - Signature - N° Telephone)</Label><Textarea rows={3} id="arrivalGulfSig" value={formData.arrival.gulfFroidSignature} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, gulfFroidSignature: e.target.value}}))} /></div>

              <div>
                <Label className="text-base font-medium">Nom, prenom, date, signature, n° de signature</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div><Label htmlFor="arrSigGerant">GERANT</Label><Textarea rows={3} id="arrSigGerant" value={formData.arrival.signatures.gerant} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, signatures: {...prev.arrival.signatures, gerant: e.target.value}}}))} /></div>
                  <div><Label htmlFor="arrSigProprietaire">PROPRIETAIRE</Label><Textarea rows={3} id="arrSigProprietaire" value={formData.arrival.signatures.proprietaire} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, signatures: {...prev.arrival.signatures, proprietaire: e.target.value}}}))} /></div>
                  <div><Label htmlFor="arrSigSE">SE</Label><Textarea rows={3} id="arrSigSE" value={formData.arrival.signatures.se} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, signatures: {...prev.arrival.signatures, se: e.target.value}}}))} /></div>
                  <div><Label htmlFor="arrSigABDM">ABDM</Label><Textarea rows={3} id="arrSigABDM" value={formData.arrival.signatures.abdm} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, signatures: {...prev.arrival.signatures, abdm: e.target.value}}}))} /></div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Nom, prenom, date, signature, n° de signature</Label>
                 <div className="grid grid-cols-2 gap-4 mt-2">
                   <div><Label htmlFor="finalSigTAS">TAS</Label><Textarea rows={3} id="finalSigTAS" value={formData.arrival.finalSignatures.tas} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, finalSignatures: {...prev.arrival.finalSignatures, tas: e.target.value}}}))} /></div>
                   <div><Label htmlFor="finalSigCPM">CPM</Label><Textarea rows={3} id="finalSigCPM" value={formData.arrival.finalSignatures.cpm} onChange={(e) => setFormData(prev => ({...prev, arrival: {...prev.arrival, finalSignatures: {...prev.arrival.finalSignatures, cpm: e.target.value}}}))} /></div>
                 </div>
              </div>

            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
