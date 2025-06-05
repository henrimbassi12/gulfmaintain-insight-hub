
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
    refrigeratorId: '',
    date: '',
    technician: '',
    agency: '',
    location: '',
    // Contrôles visuels
    exteriorCleaning: '',
    interiorCleaning: '',
    doorSeals: '',
    lighting: '',
    // Contrôles techniques
    temperature: '',
    compressor: '',
    condenserCleaning: '',
    evaporatorCleaning: '',
    refrigerantLevel: '',
    electricalConnections: '',
    // Observations
    observations: '',
    recommendations: '',
    nextMaintenanceDate: '',
    technicianSignature: '',
    clientSignature: ''
  });

  const validationRules = {
    refrigeratorId: { required: true, minLength: 3 },
    date: { required: true },
    technician: { required: true, minLength: 2 },
    agency: { required: true },
    location: { required: true },
    temperature: { 
      required: true, 
      custom: (value: string) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Température invalide';
        if (num < -50 || num > 50) return 'Température hors limites (-50°C à 50°C)';
        return null;
      }
    },
    nextMaintenanceDate: { required: true }
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
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="ID Réfrigérateur"
              name="refrigeratorId"
              value={formData.refrigeratorId}
              onChange={(value) => handleInputChange('refrigeratorId', value)}
              error={errors.refrigeratorId}
              required
            />
            <FormField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={(value) => handleInputChange('date', value)}
              error={errors.date}
              required
            />
            <FormField
              label="Technicien"
              name="technician"
              value={formData.technician}
              onChange={(value) => handleInputChange('technician', value)}
              error={errors.technician}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Agence"
              name="agency"
              value={formData.agency}
              onChange={(value) => handleInputChange('agency', value)}
              error={errors.agency}
              required
            />
            <FormField
              label="Emplacement"
              name="location"
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              error={errors.location}
              required
            />
          </div>

          <Separator />

          {/* Contrôles visuels */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contrôles Visuels</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Nettoyage Extérieur"
                name="exteriorCleaning"
                value={formData.exteriorCleaning}
                onChange={(value) => handleInputChange('exteriorCleaning', value)}
              />
              <FormField
                label="Nettoyage Intérieur"
                name="interiorCleaning"
                value={formData.interiorCleaning}
                onChange={(value) => handleInputChange('interiorCleaning', value)}
              />
              <FormField
                label="Joints de Porte"
                name="doorSeals"
                value={formData.doorSeals}
                onChange={(value) => handleInputChange('doorSeals', value)}
              />
              <FormField
                label="Éclairage"
                name="lighting"
                value={formData.lighting}
                onChange={(value) => handleInputChange('lighting', value)}
              />
            </div>
          </div>

          <Separator />

          {/* Contrôles techniques */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contrôles Techniques</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Température (°C)"
                name="temperature"
                type="number"
                value={formData.temperature}
                onChange={(value) => handleInputChange('temperature', value)}
                error={errors.temperature}
                required
              />
              <FormField
                label="Compresseur"
                name="compressor"
                value={formData.compressor}
                onChange={(value) => handleInputChange('compressor', value)}
              />
              <FormField
                label="Nettoyage Condenseur"
                name="condenserCleaning"
                value={formData.condenserCleaning}
                onChange={(value) => handleInputChange('condenserCleaning', value)}
              />
              <FormField
                label="Nettoyage Évaporateur"
                name="evaporatorCleaning"
                value={formData.evaporatorCleaning}
                onChange={(value) => handleInputChange('evaporatorCleaning', value)}
              />
              <FormField
                label="Niveau Réfrigérant"
                name="refrigerantLevel"
                value={formData.refrigerantLevel}
                onChange={(value) => handleInputChange('refrigerantLevel', value)}
              />
              <FormField
                label="Connexions Électriques"
                name="electricalConnections"
                value={formData.electricalConnections}
                onChange={(value) => handleInputChange('electricalConnections', value)}
              />
            </div>
          </div>

          <Separator />

          {/* Observations et recommandations */}
          <div className="space-y-4">
            <FormField
              label="Observations"
              name="observations"
              type="textarea"
              value={formData.observations}
              onChange={(value) => handleInputChange('observations', value)}
            />
            <FormField
              label="Recommandations"
              name="recommendations"
              type="textarea"
              value={formData.recommendations}
              onChange={(value) => handleInputChange('recommendations', value)}
            />
          </div>

          <Separator />

          {/* Signatures et date de prochain entretien */}
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Prochain Entretien"
              name="nextMaintenanceDate"
              type="date"
              value={formData.nextMaintenanceDate}
              onChange={(value) => handleInputChange('nextMaintenanceDate', value)}
              error={errors.nextMaintenanceDate}
              required
            />
            <FormField
              label="Signature Technicien"
              name="technicianSignature"
              value={formData.technicianSignature}
              onChange={(value) => handleInputChange('technicianSignature', value)}
            />
            <FormField
              label="Signature Client"
              name="clientSignature"
              value={formData.clientSignature}
              onChange={(value) => handleInputChange('clientSignature', value)}
            />
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
