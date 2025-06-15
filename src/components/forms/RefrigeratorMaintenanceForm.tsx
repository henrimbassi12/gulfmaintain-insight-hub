
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/ui/form-field";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useOfflineStorage } from "@/hooks/useOfflineStorage";
import { useToast } from "@/hooks/use-toast";

interface RefrigeratorMaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function RefrigeratorMaintenanceForm({ isOpen, onClose, onSave }: RefrigeratorMaintenanceFormProps) {
  const { toast } = useToast();
  const { isOnline, saveOfflineData } = useOfflineStorage('refrigerator_maintenance');
  
  const [formData, setFormData] = useState({
    // Top section
    division: '',
    secteur: '',
    partenaire: '',
    ville: '',
    tazRseGuinness: '',
    technicienGfi: '',
    date: '',

    // Client Info
    nomClient: '',
    nomPdv: '',
    telBarman: '',
    quartier: '',
    localisation: '',
    
    // Fridge Info
    typeFrigo: '',
    afNf: '',
    branding: '',
    sn: '',
    tagNumber: '',

    // Checks
    securiteDmsRegulTerre: '',
    tauxRemplissage: '',
    eclairage: '',
    temperature: '',
    lineaire: '',
    tension: '',
    intensiteAvant: '',
    intensiteApres: '',
    purgeCircuit: '',
    soufflagePartiesActives: '',

    // Comments
    observationCommentaires: '',

    // Signatures
    signatureBarman: '',
    technicoGfiSignature: '',
    taeOuAsm: ''
  });

  const validationRules = {
    date: { required: true },
    technicienGfi: { required: true, minLength: 2 },
    tagNumber: { required: true, minLength: 3 },
    ville: { required: true },
    localisation: { required: true },
    temperature: {
      required: true,
      custom: (value: string) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Température invalide';
        if (num < -50 || num > 50) return 'Température hors limites (-50°C à 50°C)';
        return null;
      }
    },
    tension: {
      required: true,
      custom: (value: string) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Tension invalide';
        return null;
      }
    },
    intensiteAvant: {
      required: true,
      custom: (value: string) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Intensité invalide';
        return null;
      }
    },
    intensiteApres: {
      required: true,
      custom: (value: string) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Intensité invalide';
        return null;
      }
    },
  };

  const { errors, validateForm, clearFieldError } = useFormValidation(validationRules);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleSave = async () => {
    if (!validateForm(formData)) {
      toast({
        title: "Erreurs de validation",
        description: "Veuillez corriger les erreurs avant de sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const dataToSave = {
      ...formData,
      type: 'refrigerator_maintenance',
      created_at: new Date().toISOString()
    };

    if (!isOnline) {
      const offlineId = saveOfflineData(dataToSave);
      toast({
        title: "Sauvegardé hors-ligne",
        description: "Les données seront synchronisées lors de la reconnexion",
        variant: "default"
      });
    } else {
      onSave(dataToSave);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex justify-between items-center">
            <span>Fiche d'Entretien des Réfrigérateurs</span>
            <div className="flex items-center gap-2">
              {!isOnline && (
                <span className="text-orange-600 text-sm">Mode hors-ligne</span>
              )}
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* En-tête */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <FormField label="Division" name="division" value={formData.division} onChange={(value) => handleInputChange('division', value)} />
               <FormField label="Secteur" name="secteur" value={formData.secteur} onChange={(value) => handleInputChange('secteur', value)} />
               <FormField label="Partenaire" name="partenaire" value={formData.partenaire} onChange={(value) => handleInputChange('partenaire', value)} />
               <FormField label="Ville" name="ville" value={formData.ville} onChange={(value) => handleInputChange('ville', value)} error={errors.ville} required />
            </div>
             <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="TAZ/RSE Guinness" name="tazRseGuinness" value={formData.tazRseGuinness} onChange={(value) => handleInputChange('tazRseGuinness', value)} />
                <FormField label="Technicien GFI" name="technicienGfi" value={formData.technicienGfi} onChange={(value) => handleInputChange('technicienGfi', value)} error={errors.technicienGfi} required/>
                <FormField label="Date" name="date" type="date" value={formData.date} onChange={(value) => handleInputChange('date', value)} error={errors.date} required/>
             </div>
          </div>
          <Separator />
          {/* Informations sur le client */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Information sur le Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Nom Client" name="nomClient" value={formData.nomClient} onChange={(value) => handleInputChange('nomClient', value)} />
                <FormField label="Nom PDV" name="nomPdv" value={formData.nomPdv} onChange={(value) => handleInputChange('nomPdv', value)} />
                <FormField label="Tél. Barman" name="telBarman" value={formData.telBarman} onChange={(value) => handleInputChange('telBarman', value)} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Quartier" name="quartier" value={formData.quartier} onChange={(value) => handleInputChange('quartier', value)} />
                <FormField label="Localisation" name="localisation" value={formData.localisation} onChange={(value) => handleInputChange('localisation', value)} error={errors.localisation} required/>
            </div>
          </div>
          <Separator />
          {/* Informations sur le frigo */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations sur le Frigo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Type Frigo" name="typeFrigo" value={formData.typeFrigo} onChange={(value) => handleInputChange('typeFrigo', value)} />
              <FormField label="AF/NF" name="afNf" value={formData.afNf} onChange={(value) => handleInputChange('afNf', value)} />
              <FormField label="Branding" name="branding" value={formData.branding} onChange={(value) => handleInputChange('branding', value)} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="SN (Serial Number)" name="sn" value={formData.sn} onChange={(value) => handleInputChange('sn', value)} />
                <FormField label="Tag Number" name="tagNumber" value={formData.tagNumber} onChange={(value) => handleInputChange('tagNumber', value)} error={errors.tagNumber} required/>
            </div>
          </div>
          <Separator />
          {/* Contrôles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contrôles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Sécurité (DMS), Regul.Terre" name="securiteDmsRegulTerre" value={formData.securiteDmsRegulTerre} onChange={(value) => handleInputChange('securiteDmsRegulTerre', value)} />
                <FormField label="Taux Remplissage (%)" name="tauxRemplissage" type="number" value={formData.tauxRemplissage} onChange={(value) => handleInputChange('tauxRemplissage', value)} />
                <FormField label="Eclairage (O/N)" name="eclairage" value={formData.eclairage} onChange={(value) => handleInputChange('eclairage', value)} />
                <FormField label="Température (°C)" name="temperature" type="number" value={formData.temperature} onChange={(value) => handleInputChange('temperature', value)} error={errors.temperature} required/>
                <FormField label="Linéaire (L/D)" name="lineaire" value={formData.lineaire} onChange={(value) => handleInputChange('lineaire', value)} />
                <FormField label="Tension (Volt)" name="tension" type="number" value={formData.tension} onChange={(value) => handleInputChange('tension', value)} error={errors.tension} required/>
                <FormField label="Intensité avant entretien (A)" name="intensiteAvant" type="number" value={formData.intensiteAvant} onChange={(value) => handleInputChange('intensiteAvant', value)} error={errors.intensiteAvant} required/>
                <FormField label="Intensité après entretien (A)" name="intensiteApres" type="number" value={formData.intensiteApres} onChange={(value) => handleInputChange('intensiteApres', value)} error={errors.intensiteApres} required/>
                <FormField label="Purge du circuit d'évaluation des eaux" name="purgeCircuit" value={formData.purgeCircuit} onChange={(value) => handleInputChange('purgeCircuit', value)} />
                <FormField label="Soufflage des parties actives à l'air" name="soufflagePartiesActives" value={formData.soufflagePartiesActives} onChange={(value) => handleInputChange('soufflagePartiesActives', value)} />
            </div>
          </div>
          <Separator />
          {/* Observations et recommandations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Observation / Commentaires</h3>
            <FormField
              label=""
              name="observationCommentaires"
              type="textarea"
              value={formData.observationCommentaires}
              onChange={(value) => handleInputChange('observationCommentaires', value)}
            />
          </div>
          <Separator />
          {/* Signatures et date de prochain entretien */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Signatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Signature Barman" name="signatureBarman" value={formData.signatureBarman} onChange={(value) => handleInputChange('signatureBarman', value)} />
              <FormField label="Technico GFI (Nom, Date, Signature)" name="technicoGfiSignature" value={formData.technicoGfiSignature} onChange={(value) => handleInputChange('technicoGfiSignature', value)} />
              <FormField label="TAE ou ASM" name="taeOuAsm" value={formData.taeOuAsm} onChange={(value) => handleInputChange('taeOuAsm', value)} />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button onClick={handleSave}>
              {isOnline ? 'Enregistrer' : 'Sauvegarder hors-ligne'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
