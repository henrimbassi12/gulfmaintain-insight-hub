
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Declaration } from './types';

interface FailureDeclarationProps {
  declaration: Declaration;
  onDeclarationChange: (field: string, value: any) => void;
  onCheckboxChange: (field: string, subfield: string, checked: boolean) => void;
  onSignatureChange: (signatureField: string, value: string) => void;
}

export function FailureDeclaration({ declaration, onDeclarationChange, onCheckboxChange, onSignatureChange }: FailureDeclarationProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">1. DÉCLARATION DE PANNES</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="declDate">Date</Label>
          <Input id="declDate" type="date" value={declaration.date} onChange={(e) => onDeclarationChange('date', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="declTime">Heure</Label>
          <Input id="declTime" type="time" value={declaration.time} onChange={(e) => onDeclarationChange('time', e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-medium">Informations sur le frigo</Label>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="oldFridge" checked={declaration.oldFridge} onCheckedChange={(checked) => onDeclarationChange('oldFridge', !!checked)} />
            <Label htmlFor="oldFridge">Ancien Frigo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="newFridge" checked={declaration.newFridge} onCheckedChange={(checked) => onDeclarationChange('newFridge', !!checked)} />
            <Label htmlFor="newFridge">Nouveau Frigo</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><Label htmlFor="sn">S.N</Label><Input id="sn" value={declaration.sn} onChange={(e) => onDeclarationChange('sn', e.target.value)} /></div>
          <div><Label htmlFor="tagNumber">Tag Number</Label><Input id="tagNumber" value={declaration.tagNumber} onChange={(e) => onDeclarationChange('tagNumber', e.target.value)} /></div>
        </div>

        <div>
          <Label>Type de frigo</Label>
          <div className="flex flex-wrap gap-4 mt-2">
              {Object.keys(declaration.fridgeTypes).map(key => (
                  <div className="flex items-center space-x-2" key={key}>
                      <Checkbox id={`ft_${key}`} checked={declaration.fridgeTypes[key]} onCheckedChange={(checked) => onCheckboxChange('fridgeTypes', key, !!checked)} />
                      <Label htmlFor={`ft_${key}`}>{key.toUpperCase()}</Label>
                  </div>
              ))}
          </div>
        </div>

        <div><Label htmlFor="others">Autres</Label><Input id="others" value={declaration.others} onChange={(e) => onDeclarationChange('others', e.target.value)} /></div>
        <div><Label htmlFor="branding">Branding</Label><Input id="branding" value={declaration.branding} onChange={(e) => onDeclarationChange('branding', e.target.value)} /></div>
        
        <div className="grid grid-cols-2 gap-4">
          <div><Label htmlFor="localisation">Localisation</Label><Input id="localisation" value={declaration.localisation} onChange={(e) => onDeclarationChange('localisation', e.target.value)} /></div>
          <div><Label htmlFor="quartier">Quartier</Label><Input id="quartier" value={declaration.quartier} onChange={(e) => onDeclarationChange('quartier', e.target.value)} /></div>
        </div>

        <div><Label htmlFor="emplacementExact">Emplacement exact</Label><Input id="emplacementExact" value={declaration.emplacementExact} onChange={(e) => onDeclarationChange('emplacementExact', e.target.value)} /></div>

        <div className="grid grid-cols-3 gap-4">
          <div><Label htmlFor="organisation">Organisation</Label><Input id="organisation" value={declaration.organisation} onChange={(e) => onDeclarationChange('organisation', e.target.value)} /></div>
          <div><Label htmlFor="partenaire">Partenaire</Label><Input id="partenaire" value={declaration.partenaire} onChange={(e) => onDeclarationChange('partenaire', e.target.value)} /></div>
          <div><Label htmlFor="villeDivision">Ville Division</Label><Input id="villeDivision" value={declaration.villeDivision} onChange={(e) => onDeclarationChange('villeDivision', e.target.value)} /></div>
        </div>
        
        <div><Label htmlFor="issueDescription">Description de la panne</Label><Textarea id="issueDescription" value={declaration.issueDescription} onChange={(e) => onDeclarationChange('issueDescription', e.target.value)} /></div>

        <div>
          <Label className="text-base font-medium">Nom, prenom, date, signature, n° de signature</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <Textarea placeholder="SE/WSE" value={declaration.signatures.se_wse} onChange={(e) => onSignatureChange('se_wse', e.target.value)} />
            <Textarea placeholder="ABDM" value={declaration.signatures.abdm} onChange={(e) => onSignatureChange('abdm', e.target.value)} />
            <Textarea placeholder="TAS" value={declaration.signatures.tas} onChange={(e) => onSignatureChange('tas', e.target.value)} />
            <Textarea placeholder="GULF FROID INDUSTRIEL" value={declaration.signatures.gulfFroid} onChange={(e) => onSignatureChange('gulfFroid', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
