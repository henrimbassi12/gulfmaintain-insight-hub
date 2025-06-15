
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RepairFormHeaderProps {
  clientName: string;
  pdvName: string;
  onClientNameChange: (value: string) => void;
  onPdvNameChange: (value: string) => void;
}

export function RepairFormHeader({ clientName, pdvName, onClientNameChange, onPdvNameChange }: RepairFormHeaderProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="clientName">Nom du Client</Label>
        <Input id="clientName" value={clientName} onChange={(e) => onClientNameChange(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="pdvName">Nom du PDV</Label>
        <Input id="pdvName" value={pdvName} onChange={(e) => onPdvNameChange(e.target.value)} />
      </div>
    </div>
  );
}
