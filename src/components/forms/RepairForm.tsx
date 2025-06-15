
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { X } from 'lucide-react';

interface RepairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface ReplacedPart {
  designation: string;
  quantity: string;
}

export function RepairForm({ isOpen, onClose, onSave }: RepairFormProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    pdvName: '',
    // 1. Déclaration de pannes
    declaration: {
      date: '',
      time: '',
      oldFridge: false,
      newFridge: false,
      sn: '',
      tagNumber: '',
      fridgeTypes: {
        fv400: false,
        fv420: false,
        sdm1500: false,
        sdm650: false,
        extro: false,
      },
      others: '',
      branding: '',
      localisation: '',
      quartier: '',
      emplacementExact: '',
      organisation: '',
      partenaire: '',
      villeDivision: '',
      issueDescription: '',
      signatures: {
        se_wse: '',
        abdm: '',
        tas: '',
        gulfFroid: '',
      },
    },
    // 2. Statut de réparation
    repairStatus: {
      date: '',
      detectedFailure: '',
      workPerformed: '',
      replacedParts: [{ designation: '', quantity: '' }] as ReplacedPart[],
      technicianInfo: '',
      auditResult: 'satisfait',
      comments: '',
      approvals: {
        gerant: '',
        se: '',
        abdm: '',
        tas: '',
      },
    },
  });

  const handlePartChange = (index: number, field: keyof ReplacedPart, value: string) => {
    const newParts = [...formData.repairStatus.replacedParts];
    newParts[index][field] = value;
    setFormData(prev => ({
      ...prev,
      repairStatus: { ...prev.repairStatus, replacedParts: newParts },
    }));
  };

  const addPartRow = () => {
    setFormData(prev => ({
      ...prev,
      repairStatus: {
        ...prev.repairStatus,
        replacedParts: [...prev.repairStatus.replacedParts, { designation: '', quantity: '' }],
      },
    }));
  };

  const removePartRow = (index: number) => {
    if (formData.repairStatus.replacedParts.length <= 1) return;
    const newParts = formData.repairStatus.replacedParts.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      repairStatus: { ...prev.repairStatus, replacedParts: newParts },
    }));
  };

  const handleSave = () => {
    onSave({
      ...formData,
      type: 'fridge_repair',
      created_at: new Date().toISOString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [field]: value
        }
    }));
  };

  const handleCheckboxChange = (section: string, field: string, subfield: string, checked: boolean) => {
    setFormData(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [field]: {
                ...prev[section][field],
                [subfield]: checked
            }
        }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
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
              <Input id="clientName" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="pdvName">Nom du PDV</Label>
              <Input id="pdvName" value={formData.pdvName} onChange={(e) => setFormData({...formData, pdvName: e.target.value})} />
            </div>
          </div>
          
          <Separator />

          {/* 1. Déclaration de pannes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">1. DÉCLARATION DE PANNES</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="declDate">Date</Label>
                <Input id="declDate" type="date" value={formData.declaration.date} onChange={(e) => handleNestedChange('declaration', 'date', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="declTime">Heure</Label>
                <Input id="declTime" type="time" value={formData.declaration.time} onChange={(e) => handleNestedChange('declaration', 'time', e.target.value)} />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Informations sur le frigo</Label>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="oldFridge" checked={formData.declaration.oldFridge} onCheckedChange={(checked) => handleNestedChange('declaration', 'oldFridge', !!checked)} />
                  <Label htmlFor="oldFridge">Ancien Frigo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newFridge" checked={formData.declaration.newFridge} onCheckedChange={(checked) => handleNestedChange('declaration', 'newFridge', !!checked)} />
                  <Label htmlFor="newFridge">Nouveau Frigo</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div><Label htmlFor="sn">S.N</Label><Input id="sn" value={formData.declaration.sn} onChange={(e) => handleNestedChange('declaration', 'sn', e.target.value)} /></div>
                <div><Label htmlFor="tagNumber">Tag Number</Label><Input id="tagNumber" value={formData.declaration.tagNumber} onChange={(e) => handleNestedChange('declaration', 'tagNumber', e.target.value)} /></div>
              </div>

              <div>
                <Label>Type de frigo</Label>
                <div className="flex flex-wrap gap-4 mt-2">
                    {Object.keys(formData.declaration.fridgeTypes).map(key => (
                        <div className="flex items-center space-x-2" key={key}>
                            <Checkbox id={`ft_${key}`} checked={formData.declaration.fridgeTypes[key]} onCheckedChange={(checked) => handleCheckboxChange('declaration', 'fridgeTypes', key, !!checked)} />
                            <Label htmlFor={`ft_${key}`}>{key.toUpperCase()}</Label>
                        </div>
                    ))}
                </div>
              </div>

              <div><Label htmlFor="others">Autres</Label><Input id="others" value={formData.declaration.others} onChange={(e) => handleNestedChange('declaration', 'others', e.target.value)} /></div>
              <div><Label htmlFor="branding">Branding</Label><Input id="branding" value={formData.declaration.branding} onChange={(e) => handleNestedChange('declaration', 'branding', e.target.value)} /></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div><Label htmlFor="localisation">Localisation</Label><Input id="localisation" value={formData.declaration.localisation} onChange={(e) => handleNestedChange('declaration', 'localisation', e.target.value)} /></div>
                <div><Label htmlFor="quartier">Quartier</Label><Input id="quartier" value={formData.declaration.quartier} onChange={(e) => handleNestedChange('declaration', 'quartier', e.target.value)} /></div>
              </div>

              <div><Label htmlFor="emplacementExact">Emplacement exact</Label><Input id="emplacementExact" value={formData.declaration.emplacementExact} onChange={(e) => handleNestedChange('declaration', 'emplacementExact', e.target.value)} /></div>

              <div className="grid grid-cols-3 gap-4">
                <div><Label htmlFor="organisation">Organisation</Label><Input id="organisation" value={formData.declaration.organisation} onChange={(e) => handleNestedChange('declaration', 'organisation', e.target.value)} /></div>
                <div><Label htmlFor="partenaire">Partenaire</Label><Input id="partenaire" value={formData.declaration.partenaire} onChange={(e) => handleNestedChange('declaration', 'partenaire', e.target.value)} /></div>
                <div><Label htmlFor="villeDivision">Ville Division</Label><Input id="villeDivision" value={formData.declaration.villeDivision} onChange={(e) => handleNestedChange('declaration', 'villeDivision', e.target.value)} /></div>
              </div>
              
              <div><Label htmlFor="issueDescription">Description de la panne</Label><Textarea id="issueDescription" value={formData.declaration.issueDescription} onChange={(e) => handleNestedChange('declaration', 'issueDescription', e.target.value)} /></div>

              <div>
                <Label className="text-base font-medium">Nom, prenom, date, signature, n° de signature</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <Textarea placeholder="SE/WSE" value={formData.declaration.signatures.se_wse} onChange={(e) => handleNestedChange('declaration', 'signatures', { ...formData.declaration.signatures, se_wse: e.target.value })} />
                  <Textarea placeholder="ABDM" value={formData.declaration.signatures.abdm} onChange={(e) => handleNestedChange('declaration', 'signatures', { ...formData.declaration.signatures, abdm: e.target.value })} />
                  <Textarea placeholder="TAS" value={formData.declaration.signatures.tas} onChange={(e) => handleNestedChange('declaration', 'signatures', { ...formData.declaration.signatures, tas: e.target.value })} />
                  <Textarea placeholder="GULF FROID INDUSTRIEL" value={formData.declaration.signatures.gulfFroid} onChange={(e) => handleNestedChange('declaration', 'signatures', { ...formData.declaration.signatures, gulfFroid: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* 2. Statut de réparation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">2. STATUT DE RÉPARATION</h3>
            <div className="space-y-4">
              <div><Label htmlFor="repairDate">Date</Label><Input id="repairDate" type="date" value={formData.repairStatus.date} onChange={(e) => handleNestedChange('repairStatus', 'date', e.target.value)} /></div>
              <div><Label htmlFor="detectedFailure">Panne détectée(s)</Label><Textarea id="detectedFailure" value={formData.repairStatus.detectedFailure} onChange={(e) => handleNestedChange('repairStatus', 'detectedFailure', e.target.value)} /></div>
              <div><Label htmlFor="workPerformed">Travaux effectué(s)</Label><Textarea id="workPerformed" value={formData.repairStatus.workPerformed} onChange={(e) => handleNestedChange('repairStatus', 'workPerformed', e.target.value)} /></div>

              <div>
                <Label>Pièces remplacée(s)</Label>
                {formData.repairStatus.replacedParts.map((part, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <Input placeholder="Désignation" value={part.designation} onChange={(e) => handlePartChange(index, 'designation', e.target.value)} />
                    <Input placeholder="Quantité" type="number" value={part.quantity} onChange={(e) => handlePartChange(index, 'quantity', e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => removePartRow(index)} disabled={formData.repairStatus.replacedParts.length <= 1}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addPartRow} variant="outline" size="sm" className="mt-2">Ajouter une pièce</Button>
              </div>

              <div><Label htmlFor="technicianInfo">Nom, Prénom, Date, signature, téléphone technicien</Label><Textarea id="technicianInfo" value={formData.repairStatus.technicianInfo} onChange={(e) => handleNestedChange('repairStatus', 'technicianInfo', e.target.value)} /></div>
              
              <div>
                <Label htmlFor="auditResult">Résultat Audit Gcsa Rep</Label>
                <Select value={formData.repairStatus.auditResult} onValueChange={(value) => handleNestedChange('repairStatus', 'auditResult', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satisfait">Satisfait</SelectItem>
                    <SelectItem value="insatisfait">Insatisfait</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div><Label htmlFor="comments">Commentaires</Label><Textarea id="comments" value={formData.repairStatus.comments} onChange={(e) => handleNestedChange('repairStatus', 'comments', e.target.value)} /></div>

              <div>
                <Label className="text-base font-medium">Approbation (Nom, Prenom, Signature, Date)</Label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                   <Textarea placeholder="Gérant" value={formData.repairStatus.approvals.gerant} onChange={(e) => handleNestedChange('repairStatus', 'approvals', { ...formData.repairStatus.approvals, gerant: e.target.value })} />
                   <Textarea placeholder="SE" value={formData.repairStatus.approvals.se} onChange={(e) => handleNestedChange('repairStatus', 'approvals', { ...formData.repairStatus.approvals, se: e.target.value })} />
                   <Textarea placeholder="ABDM" value={formData.repairStatus.approvals.abdm} onChange={(e) => handleNestedChange('repairStatus', 'approvals', { ...formData.repairStatus.approvals, abdm: e.target.value })} />
                   <Textarea placeholder="TAS" value={formData.repairStatus.approvals.tas} onChange={(e) => handleNestedChange('repairStatus', 'approvals', { ...formData.repairStatus.approvals, tas: e.target.value })} />
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
