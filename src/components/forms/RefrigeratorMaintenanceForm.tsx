
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface RefrigeratorMaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function RefrigeratorMaintenanceForm({ isOpen, onClose, onSave }: RefrigeratorMaintenanceFormProps) {
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

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex justify-between items-center">
            <span>Fiche d'Entretien des Réfrigérateurs</span>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* En-tête */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="refrigeratorId">ID Réfrigérateur</Label>
              <Input 
                id="refrigeratorId"
                value={formData.refrigeratorId}
                onChange={(e) => setFormData({...formData, refrigeratorId: e.target.value})}
              />
            </div>
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
              <Label htmlFor="technician">Technicien</Label>
              <Input 
                id="technician"
                value={formData.technician}
                onChange={(e) => setFormData({...formData, technician: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agency">Agence</Label>
              <Input 
                id="agency"
                value={formData.agency}
                onChange={(e) => setFormData({...formData, agency: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location">Emplacement</Label>
              <Input 
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <Separator />

          {/* Contrôles visuels */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contrôles Visuels</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exteriorCleaning">Nettoyage Extérieur</Label>
                <Input 
                  id="exteriorCleaning"
                  value={formData.exteriorCleaning}
                  onChange={(e) => setFormData({...formData, exteriorCleaning: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="interiorCleaning">Nettoyage Intérieur</Label>
                <Input 
                  id="interiorCleaning"
                  value={formData.interiorCleaning}
                  onChange={(e) => setFormData({...formData, interiorCleaning: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="doorSeals">Joints de Porte</Label>
                <Input 
                  id="doorSeals"
                  value={formData.doorSeals}
                  onChange={(e) => setFormData({...formData, doorSeals: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lighting">Éclairage</Label>
                <Input 
                  id="lighting"
                  value={formData.lighting}
                  onChange={(e) => setFormData({...formData, lighting: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contrôles techniques */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contrôles Techniques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="temperature">Température (°C)</Label>
                <Input 
                  id="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="compressor">Compresseur</Label>
                <Input 
                  id="compressor"
                  value={formData.compressor}
                  onChange={(e) => setFormData({...formData, compressor: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="condenserCleaning">Nettoyage Condenseur</Label>
                <Input 
                  id="condenserCleaning"
                  value={formData.condenserCleaning}
                  onChange={(e) => setFormData({...formData, condenserCleaning: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="evaporatorCleaning">Nettoyage Évaporateur</Label>
                <Input 
                  id="evaporatorCleaning"
                  value={formData.evaporatorCleaning}
                  onChange={(e) => setFormData({...formData, evaporatorCleaning: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="refrigerantLevel">Niveau Réfrigérant</Label>
                <Input 
                  id="refrigerantLevel"
                  value={formData.refrigerantLevel}
                  onChange={(e) => setFormData({...formData, refrigerantLevel: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="electricalConnections">Connexions Électriques</Label>
                <Input 
                  id="electricalConnections"
                  value={formData.electricalConnections}
                  onChange={(e) => setFormData({...formData, electricalConnections: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Observations et recommandations */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="observations">Observations</Label>
              <Textarea 
                id="observations"
                rows={3}
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="recommendations">Recommandations</Label>
              <Textarea 
                id="recommendations"
                rows={3}
                value={formData.recommendations}
                onChange={(e) => setFormData({...formData, recommendations: e.target.value})}
              />
            </div>
          </div>

          <Separator />

          {/* Signatures et date de prochain entretien */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nextMaintenanceDate">Prochain Entretien</Label>
              <Input 
                id="nextMaintenanceDate"
                type="date"
                value={formData.nextMaintenanceDate}
                onChange={(e) => setFormData({...formData, nextMaintenanceDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="technicianSignature">Signature Technicien</Label>
              <Input 
                id="technicianSignature"
                value={formData.technicianSignature}
                onChange={(e) => setFormData({...formData, technicianSignature: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="clientSignature">Signature Client</Label>
              <Input 
                id="clientSignature"
                value={formData.clientSignature}
                onChange={(e) => setFormData({...formData, clientSignature: e.target.value})}
              />
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
