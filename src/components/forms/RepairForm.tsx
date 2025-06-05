
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface RepairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function RepairForm({ isOpen, onClose, onSave }: RepairFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    pdvName: '',
    date: '',
    time: '',
    oldFridge: false,
    newFridge: false,
    fridgeType: '',
    serialNumbers: {
      sdm1500: '',
      sdm650: '',
      extra: ''
    },
    branding: '',
    location: '',
    district: '',
    exactLocation: '',
    organization: '',
    partnership: '',
    divisionCity: '',
    issueDescription: '',
    signatures: {
      seVise: '',
      abdm: '',
      tas: '',
      gulfFroid: ''
    },
    repairStatus: {
      date: '',
      detectedFailure: '',
      workPerformed: '',
      replacedParts: []
    },
    technicianInfo: '',
    auditResult: 'satisfait',
    comments: '',
    approvals: {
      manager: '',
      se: '',
      abdm: '',
      tas: ''
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
            <span>Fiche de Suivi des Réparations des Frigos</span>
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

          {/* 1. Déclaration de pannes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">1. DÉCLARATION DE PANNES</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="time">Heure</Label>
                <Input 
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Informations sur le frigo</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="oldFridge"
                      checked={formData.oldFridge}
                      onCheckedChange={(checked) => setFormData({...formData, oldFridge: !!checked})}
                    />
                    <Label htmlFor="oldFridge">Ancien Frigo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="newFridge"
                      checked={formData.newFridge}
                      onCheckedChange={(checked) => setFormData({...formData, newFridge: !!checked})}
                    />
                    <Label htmlFor="newFridge">Nouveau Frigo</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="fridgeType">Type de frigo</Label>
                <Select value={formData.fridgeType} onValueChange={(value) => setFormData({...formData, fridgeType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FV400">FV400</SelectItem>
                    <SelectItem value="FV420">FV420</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sdm1500">SDM1500</Label>
                  <Input 
                    id="sdm1500"
                    value={formData.serialNumbers.sdm1500}
                    onChange={(e) => setFormData({
                      ...formData, 
                      serialNumbers: {...formData.serialNumbers, sdm1500: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="sdm650">SDM650</Label>
                  <Input 
                    id="sdm650"
                    value={formData.serialNumbers.sdm650}
                    onChange={(e) => setFormData({
                      ...formData, 
                      serialNumbers: {...formData.serialNumbers, sdm650: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="extra">Extra</Label>
                  <Input 
                    id="extra"
                    value={formData.serialNumbers.extra}
                    onChange={(e) => setFormData({
                      ...formData, 
                      serialNumbers: {...formData.serialNumbers, extra: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="branding">Branding</Label>
                <Input 
                  id="branding"
                  value={formData.branding}
                  onChange={(e) => setFormData({...formData, branding: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Localisation */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input 
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="district">Quartier</Label>
              <Input 
                id="district"
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="exactLocation">Emplacement exact</Label>
              <Input 
                id="exactLocation"
                value={formData.exactLocation}
                onChange={(e) => setFormData({...formData, exactLocation: e.target.value})}
              />
            </div>
          </div>

          <Separator />

          {/* Description de la panne */}
          <div>
            <Label htmlFor="issueDescription">Description de la panne</Label>
            <Textarea 
              id="issueDescription"
              rows={4}
              value={formData.issueDescription}
              onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
            />
          </div>

          <Separator />

          {/* 2. Statut de réparation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">2. STATUT DE RÉPARATION</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="repairDate">Date</Label>
                <Input 
                  id="repairDate"
                  type="date"
                  value={formData.repairStatus.date}
                  onChange={(e) => setFormData({
                    ...formData, 
                    repairStatus: {...formData.repairStatus, date: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="detectedFailure">Panne détectée(s)</Label>
                <Textarea 
                  id="detectedFailure"
                  value={formData.repairStatus.detectedFailure}
                  onChange={(e) => setFormData({
                    ...formData, 
                    repairStatus: {...formData.repairStatus, detectedFailure: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label htmlFor="workPerformed">Travaux effectué(s)</Label>
                <Textarea 
                  id="workPerformed"
                  value={formData.repairStatus.workPerformed}
                  onChange={(e) => setFormData({
                    ...formData, 
                    repairStatus: {...formData.repairStatus, workPerformed: e.target.value}
                  })}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Commentaires et approbations */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="comments">Commentaires</Label>
              <Textarea 
                id="comments"
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="auditResult">Résultat Audit Gcsa Rep</Label>
              <Select value={formData.auditResult} onValueChange={(value) => setFormData({...formData, auditResult: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satisfait">Satisfait</SelectItem>
                  <SelectItem value="insatisfait">Insatisfait</SelectItem>
                </SelectContent>
              </Select>
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
