
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
    departureInfo: {
      date: '',
      time: '',
      oldFridge: false,
      newFridge: false,
      serialNumber: '',
      fridgeType: '',
      tagNumber: '',
      branding: '',
      location: '',
      district: '',
      exactLocation: '',
      organization: '',
      partnership: '',
      divisionCity: ''
    },
    departureSignatures: {
      manager: '',
      owner: '',
      se: '',
      abdm: ''
    },
    transmission: {
      name: '',
      date: '',
      signature: '',
      phone: '',
      tas: '',
      gulfFroidIndustrial: ''
    },
    arrivalInfo: {
      clientName: '',
      pdvName: '',
      date: '',
      time: '',
      oldFridge: false,
      newFridge: false,
      serialNumber: '',
      fridgeType: '',
      tagNumber: '',
      branding: '',
      location: '',
      district: '',
      exactLocation: '',
      organization: '',
      partnership: '',
      divisionCity: ''
    },
    arrivalSignatures: {
      manager: '',
      owner: '',
      se: '',
      abdm: '',
      gulfFroidSignature: ''
    },
    finalSignatures: {
      tas: '',
      cfm: ''
    }
  });

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gray-100">
          <CardTitle className="flex justify-between items-center">
            <span>Fiche de Suivi de Mouvement des Frigos - Point de Départ</span>
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

          {/* 1. Déclaration de pannes - Point de départ */}
          <div>
            <h3 className="text-lg font-semibold mb-4">1. DÉCLARATION DE PANNES - POINT DE DÉPART</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="departureDate">Date</Label>
                <Input 
                  id="departureDate"
                  type="date"
                  value={formData.departureInfo.date}
                  onChange={(e) => setFormData({
                    ...formData, 
                    departureInfo: {...formData.departureInfo, date: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="departureTime">Heure</Label>
                <Input 
                  id="departureTime"
                  type="time"
                  value={formData.departureInfo.time}
                  onChange={(e) => setFormData({
                    ...formData, 
                    departureInfo: {...formData.departureInfo, time: e.target.value}
                  })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Informations sur le frigo</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="departureOldFridge"
                      checked={formData.departureInfo.oldFridge}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        departureInfo: {...formData.departureInfo, oldFridge: !!checked}
                      })}
                    />
                    <Label htmlFor="departureOldFridge">Ancien Frigo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="departureNewFridge"
                      checked={formData.departureInfo.newFridge}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        departureInfo: {...formData.departureInfo, newFridge: !!checked}
                      })}
                    />
                    <Label htmlFor="departureNewFridge">Nouveau Frigo</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureFridgeType">Type de frigo</Label>
                  <Select 
                    value={formData.departureInfo.fridgeType} 
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      departureInfo: {...formData.departureInfo, fridgeType: value}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FV400">FV400</SelectItem>
                      <SelectItem value="FV420">FV420</SelectItem>
                      <SelectItem value="SDM1500">SDM1500</SelectItem>
                      <SelectItem value="SDM650">SDM650</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="departureTagNumber">Tag Number</Label>
                  <Input 
                    id="departureTagNumber"
                    value={formData.departureInfo.tagNumber}
                    onChange={(e) => setFormData({
                      ...formData, 
                      departureInfo: {...formData.departureInfo, tagNumber: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="departureBranding">Branding</Label>
                <Input 
                  id="departureBranding"
                  value={formData.departureInfo.branding}
                  onChange={(e) => setFormData({
                    ...formData, 
                    departureInfo: {...formData.departureInfo, branding: e.target.value}
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureLocation">Localisation</Label>
                  <Input 
                    id="departureLocation"
                    value={formData.departureInfo.location}
                    onChange={(e) => setFormData({
                      ...formData, 
                      departureInfo: {...formData.departureInfo, location: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="departureDistrict">Quartier</Label>
                  <Input 
                    id="departureDistrict"
                    value={formData.departureInfo.district}
                    onChange={(e) => setFormData({
                      ...formData, 
                      departureInfo: {...formData.departureInfo, district: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 2. Transmission du TAS à Gulf Froid Industriel */}
          <div>
            <h3 className="text-lg font-semibold mb-4">2. TRANSMISSION DU TAS À GULF FROID INDUSTRIEL SARL</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transmissionTas">TAS</Label>
                <Input 
                  id="transmissionTas"
                  value={formData.transmission.tas}
                  onChange={(e) => setFormData({
                    ...formData, 
                    transmission: {...formData.transmission, tas: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="transmissionGulfFroid">Gulf Froid Industriel SARL</Label>
                <Input 
                  id="transmissionGulfFroid"
                  value={formData.transmission.gulfFroidIndustrial}
                  onChange={(e) => setFormData({
                    ...formData, 
                    transmission: {...formData.transmission, gulfFroidIndustrial: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 3. Point d'arrivée */}
          <div>
            <h3 className="text-lg font-semibold mb-4">3. POINT D'ARRIVÉE</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="arrivalClientName">Nom du Client</Label>
                <Input 
                  id="arrivalClientName"
                  value={formData.arrivalInfo.clientName}
                  onChange={(e) => setFormData({
                    ...formData, 
                    arrivalInfo: {...formData.arrivalInfo, clientName: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="arrivalPdvName">Nom du Point de Vente</Label>
                <Input 
                  id="arrivalPdvName"
                  value={formData.arrivalInfo.pdvName}
                  onChange={(e) => setFormData({
                    ...formData, 
                    arrivalInfo: {...formData.arrivalInfo, pdvName: e.target.value}
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="arrivalDate">Date</Label>
                <Input 
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalInfo.date}
                  onChange={(e) => setFormData({
                    ...formData, 
                    arrivalInfo: {...formData.arrivalInfo, date: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="arrivalTime">Heure</Label>
                <Input 
                  id="arrivalTime"
                  type="time"
                  value={formData.arrivalInfo.time}
                  onChange={(e) => setFormData({
                    ...formData, 
                    arrivalInfo: {...formData.arrivalInfo, time: e.target.value}
                  })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Informations sur le frigo</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="arrivalOldFridge"
                      checked={formData.arrivalInfo.oldFridge}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        arrivalInfo: {...formData.arrivalInfo, oldFridge: !!checked}
                      })}
                    />
                    <Label htmlFor="arrivalOldFridge">Ancien Frigo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="arrivalNewFridge"
                      checked={formData.arrivalInfo.newFridge}
                      onCheckedChange={(checked) => setFormData({
                        ...formData, 
                        arrivalInfo: {...formData.arrivalInfo, newFridge: !!checked}
                      })}
                    />
                    <Label htmlFor="arrivalNewFridge">Nouveau Frigo</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrivalFridgeType">Type de frigo</Label>
                  <Select 
                    value={formData.arrivalInfo.fridgeType} 
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      arrivalInfo: {...formData.arrivalInfo, fridgeType: value}
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FV400">FV400</SelectItem>
                      <SelectItem value="FV420">FV420</SelectItem>
                      <SelectItem value="SDM1500">SDM1500</SelectItem>
                      <SelectItem value="SDM650">SDM650</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="arrivalTagNumber">Tag Number</Label>
                  <Input 
                    id="arrivalTagNumber"
                    value={formData.arrivalInfo.tagNumber}
                    onChange={(e) => setFormData({
                      ...formData, 
                      arrivalInfo: {...formData.arrivalInfo, tagNumber: e.target.value}
                    })}
                  />
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
