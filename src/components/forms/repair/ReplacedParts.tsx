
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';
import { ReplacedPart } from './types';

interface ReplacedPartsProps {
  parts: ReplacedPart[];
  onPartChange: (index: number, field: keyof ReplacedPart, value: string) => void;
  onAddPart: () => void;
  onRemovePart: (index: number) => void;
}

export function ReplacedParts({ parts, onPartChange, onAddPart, onRemovePart }: ReplacedPartsProps) {
  return (
    <div>
      <Label>Pièces remplacée(s)</Label>
      {parts.map((part, index) => (
        <div key={index} className="flex items-center gap-2 mt-2">
          <Input placeholder="Désignation" value={part.designation} onChange={(e) => onPartChange(index, 'designation', e.target.value)} />
          <Input placeholder="Quantité" type="number" value={part.quantity} onChange={(e) => onPartChange(index, 'quantity', e.target.value)} />
          <Button variant="ghost" size="icon" onClick={() => onRemovePart(index)} disabled={parts.length <= 1}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button onClick={onAddPart} variant="outline" size="sm" className="mt-2">Ajouter une pièce</Button>
    </div>
  );
}
