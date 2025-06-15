
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RepairStatus as RepairStatusType, ReplacedPart } from './types';
import { ReplacedParts } from './ReplacedParts';

interface RepairStatusProps {
  repairStatus: RepairStatusType;
  onRepairStatusChange: (field: string, value: any) => void;
  onPartChange: (index: number, field: keyof ReplacedPart, value: string) => void;
  onAddPart: () => void;
  onRemovePart: (index: number) => void;
  onApprovalChange: (approvalField: string, value: string) => void;
}

export function RepairStatus({
  repairStatus,
  onRepairStatusChange,
  onPartChange,
  onAddPart,
  onRemovePart,
  onApprovalChange
}: RepairStatusProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">2. STATUT DE RÉPARATION</h3>
      <div className="space-y-4">
        <div><Label htmlFor="repairDate">Date</Label><Input id="repairDate" type="date" value={repairStatus.date} onChange={(e) => onRepairStatusChange('date', e.target.value)} /></div>
        <div><Label htmlFor="detectedFailure">Panne détectée(s)</Label><Textarea id="detectedFailure" value={repairStatus.detectedFailure} onChange={(e) => onRepairStatusChange('detectedFailure', e.target.value)} /></div>
        <div><Label htmlFor="workPerformed">Travaux effectué(s)</Label><Textarea id="workPerformed" value={repairStatus.workPerformed} onChange={(e) => onRepairStatusChange('workPerformed', e.target.value)} /></div>

        <ReplacedParts
          parts={repairStatus.replacedParts}
          onPartChange={onPartChange}
          onAddPart={onAddPart}
          onRemovePart={onRemovePart}
        />

        <div><Label htmlFor="technicianInfo">Nom, Prénom, Date, signature, téléphone technicien</Label><Textarea id="technicianInfo" value={repairStatus.technicianInfo} onChange={(e) => onRepairStatusChange('technicianInfo', e.target.value)} /></div>
        
        <div>
          <Label htmlFor="auditResult">Résultat Audit Gcsa Rep</Label>
          <Select value={repairStatus.auditResult} onValueChange={(value) => onRepairStatusChange('auditResult', value)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="satisfait">Satisfait</SelectItem>
              <SelectItem value="insatisfait">Insatisfait</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div><Label htmlFor="comments">Commentaires</Label><Textarea id="comments" value={repairStatus.comments} onChange={(e) => onRepairStatusChange('comments', e.target.value)} /></div>

        <div>
          <Label className="text-base font-medium">Approbation (Nom, Prenom, Signature, Date)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <Textarea placeholder="Gérant" value={repairStatus.approvals.gerant} onChange={(e) => onApprovalChange('gerant', e.target.value)} />
              <Textarea placeholder="SE" value={repairStatus.approvals.se} onChange={(e) => onApprovalChange('se', e.target.value)} />
              <Textarea placeholder="ABDM" value={repairStatus.approvals.abdm} onChange={(e) => onApprovalChange('abdm', e.target.value)} />
              <Textarea placeholder="TAS" value={repairStatus.approvals.tas} onChange={(e) => onApprovalChange('tas', e.target.value)} />
            </div>
        </div>
      </div>
    </div>
  );
}
