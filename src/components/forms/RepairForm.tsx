
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RepairFormHeader } from './repair/RepairFormHeader';
import { FailureDeclaration } from './repair/FailureDeclaration';
import { RepairStatus } from './repair/RepairStatus';
import { RepairFormData, ReplacedPart } from './repair/types';

interface RepairFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const initialFormData: RepairFormData = {
  clientName: '',
  pdvName: '',
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
  repairStatus: {
    date: '',
    detectedFailure: '',
    workPerformed: '',
    replacedParts: [{ designation: '', quantity: '' }],
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
};

export function RepairForm({ isOpen, onClose, onSave }: RepairFormProps) {
  const [formData, setFormData] = useState<RepairFormData>(initialFormData);

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

  const handleNestedChange = (section: 'declaration' | 'repairStatus', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };
  
  const handleCheckboxChange = (section: 'declaration', field: string, subfield: string, checked: boolean) => {
    setFormData(prev => ({
        ...prev,
        [section]: {
            ...prev[section],
            [field]: {
                ...(prev[section][field] as object),
                [subfield]: checked
            }
        }
    }));
  };

  const handleDeclarationSignatureChange = (signatureField: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      declaration: {
        ...prev.declaration,
        signatures: {
          ...prev.declaration.signatures,
          [signatureField]: value,
        },
      },
    }));
  };
  
  const handleRepairApprovalChange = (approvalField: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      repairStatus: {
        ...prev.repairStatus,
        approvals: {
          ...prev.repairStatus.approvals,
          [approvalField]: value,
        },
      },
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
          <RepairFormHeader
            clientName={formData.clientName}
            pdvName={formData.pdvName}
            onClientNameChange={(value) => setFormData({...formData, clientName: value})}
            onPdvNameChange={(value) => setFormData({...formData, pdvName: value})}
          />
          
          <Separator />

          <FailureDeclaration
            declaration={formData.declaration}
            onDeclarationChange={(field, value) => handleNestedChange('declaration', field, value)}
            onCheckboxChange={(field, subfield, checked) => handleCheckboxChange('declaration', field, subfield, checked)}
            onSignatureChange={handleDeclarationSignatureChange}
          />
          
          <Separator />
          
          <RepairStatus
            repairStatus={formData.repairStatus}
            onRepairStatusChange={(field, value) => handleNestedChange('repairStatus', field, value)}
            onPartChange={handlePartChange}
            onAddPart={addPartRow}
            onRemovePart={removePartRow}
            onApprovalChange={handleRepairApprovalChange}
          />

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
