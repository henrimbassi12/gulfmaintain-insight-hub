
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface MaintenanceTrackingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

interface MaintenanceEntry {
  id: string;
  date: string;
  action: string;
  observation: string;
  nomSignature: string;
}

interface Contact {
  id: string;
  nomPrenom: string;
  telephone: string;
  status: string;
}

export function MaintenanceTrackingForm({ isOpen, onClose, onSave, onBack }: MaintenanceTrackingFormProps) {
  const [formData, setFormData] = useState({
    // En-tête
    dateCreation: new Date().toISOString().split('T')[0],
    dateCloture: '',
    
    // Informations générales
    region: '',
    partenaire: '',
    tae: '',
    typeFrigo: '',
    snTagNumber: '',
    pvd1: '',
    pvd2: '',
    pvd3: ''
  });

  const [maintenanceEntries, setMaintenanceEntries] = useState<MaintenanceEntry[]>([
    { id: '1', date: '', action: '', observation: '', nomSignature: '' }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', nomPrenom: '', telephone: '', status: 'TECHNICIEN 1' },
    { id: '2', nomPrenom: '', telephone: '', status: 'TECHNICIEN 2' },
    { id: '3', nomPrenom: '', telephone: '', status: 'CHEF DE REGION' },
    { id: '4', nomPrenom: '', telephone: '', status: 'HEAD QUARTER' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMaintenanceEntry = () => {
    const newEntry: MaintenanceEntry = {
      id: Date.now().toString(),
      date: '',
      action: '',
      observation: '',
      nomSignature: ''
    };
    setMaintenanceEntries(prev => [...prev, newEntry]);
  };

  const removeMaintenanceEntry = (id: string) => {
    setMaintenanceEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const updateMaintenanceEntry = (id: string, field: string, value: string) => {
    setMaintenanceEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const updateContact = (id: string, field: string, value: string) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  const handleSave = () => {
    const completeData = {
      ...formData,
      maintenanceEntries,
      contacts
    };
    onSave(completeData);
    toast.success('Fiche de suivi et maintenance sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-suivi-maintenance-${formData.snTagNumber || 'nouveau'}-${formData.dateCreation}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE SUIVI ET DE MAINTENANCE DU RÉFRIGÉRATEUR GUINNESS ===

Gulf Froid Industriel, le partenaire de la qualité
GUINNESS.

Date de création: ${formData.dateCreation}
Date de clôture: ${formData.dateCloture}

=== INFORMATIONS GÉNÉRALES ===
Région: ${formData.region}
Partenaire: ${formData.partenaire}
TAE: ${formData.tae}
Type de frigo: ${formData.typeFrigo}
SN ou TAG NUMBER: ${formData.snTagNumber}
PVD1: ${formData.pvd1}
PVD2: ${formData.pvd2}
PVD3: ${formData.pvd3}

=== SUIVI ET MAINTENANCE ===
${maintenanceEntries.map(entry => `
Date: ${entry.date}
Action: ${entry.action}
Observation: ${entry.observation}
Nom et Signature: ${entry.nomSignature}
`).join('\n')}

=== CONTACTS UTILES ===
${contacts.map(contact => `
${contact.nomPrenom} - ${contact.telephone} - ${contact.status}
`).join('\n')}

Généré le: ${new Date().toLocaleString('fr-FR')}
`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="text-center w-full">
              <div className="text-sm text-gray-600 mb-1">Gulf Froid Industriel, le partenaire de la qualité</div>
              <DialogTitle className="text-xl font-bold">FICHE DE SUIVI ET DE MAINTENANCE DU RÉFRIGÉRATEUR GUINNESS</DialogTitle>
              <div className="text-lg font-semibold text-gray-800 mt-1">GUINNESS.</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dates */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateCreation">Date de création</Label>
                  <Input
                    id="dateCreation"
                    type="date"
                    value={formData.dateCreation}
                    onChange={(e) => handleInputChange('dateCreation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateCloture">Date de clôture</Label>
                  <Input
                    id="dateCloture"
                    type="date"
                    value={formData.dateCloture}
                    onChange={(e) => handleInputChange('dateCloture', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">RÉGION</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    placeholder="Région"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partenaire">PARTENAIRE</Label>
                  <Input
                    id="partenaire"
                    value={formData.partenaire}
                    onChange={(e) => handleInputChange('partenaire', e.target.value)}
                    placeholder="Partenaire"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tae">TAE</Label>
                  <Input
                    id="tae"
                    value={formData.tae}
                    onChange={(e) => handleInputChange('tae', e.target.value)}
                    placeholder="TAE"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeFrigo">TYPE DE FRIGO</Label>
                  <Input
                    id="typeFrigo"
                    value={formData.typeFrigo}
                    onChange={(e) => handleInputChange('typeFrigo', e.target.value)}
                    placeholder="Type de frigo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="snTagNumber">SN OU TAG NUMBER</Label>
                  <Input
                    id="snTagNumber"
                    value={formData.snTagNumber}
                    onChange={(e) => handleInputChange('snTagNumber', e.target.value)}
                    placeholder="Numéro de série ou tag"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pvd1">PVD1</Label>
                  <Input
                    id="pvd1"
                    value={formData.pvd1}
                    onChange={(e) => handleInputChange('pvd1', e.target.value)}
                    placeholder="PVD1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pvd2">PVD2</Label>
                  <Input
                    id="pvd2"
                    value={formData.pvd2}
                    onChange={(e) => handleInputChange('pvd2', e.target.value)}
                    placeholder="PVD2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pvd3">PVD3</Label>
                  <Input
                    id="pvd3"
                    value={formData.pvd3}
                    onChange={(e) => handleInputChange('pvd3', e.target.value)}
                    placeholder="PVD3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau de suivi et maintenance */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Suivi et Maintenance</CardTitle>
                <Button onClick={addMaintenanceEntry} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une entrée
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {maintenanceEntries.map((entry, index) => (
                <div key={entry.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Entrée {index + 1}</h4>
                    {maintenanceEntries.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeMaintenanceEntry(entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>DATES (suivi, retrait, visite)</Label>
                      <Input
                        type="date"
                        value={entry.date}
                        onChange={(e) => updateMaintenanceEntry(entry.id, 'date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ACTIONS</Label>
                      <Input
                        value={entry.action}
                        onChange={(e) => updateMaintenanceEntry(entry.id, 'action', e.target.value)}
                        placeholder="Actions effectuées"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>OBSERVATIONS</Label>
                      <Textarea
                        value={entry.observation}
                        onChange={(e) => updateMaintenanceEntry(entry.id, 'observation', e.target.value)}
                        placeholder="Observations..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>NOMS ET SIGNATURES</Label>
                      <Input
                        value={entry.nomSignature}
                        onChange={(e) => updateMaintenanceEntry(entry.id, 'nomSignature', e.target.value)}
                        placeholder="Nom et signature"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contacts utiles */}
          <Card>
            <CardHeader>
              <CardTitle>CONTACTS UTILES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Nom(s) et Prénom(s)</Label>
                    <Input
                      value={contact.nomPrenom}
                      onChange={(e) => updateContact(contact.id, 'nomPrenom', e.target.value)}
                      placeholder="Nom et prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numéro(s) de téléphone</Label>
                    <Input
                      value={contact.telephone}
                      onChange={(e) => updateContact(contact.id, 'telephone', e.target.value)}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="p-2 bg-gray-100 rounded text-sm font-medium">
                      {contact.status}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
