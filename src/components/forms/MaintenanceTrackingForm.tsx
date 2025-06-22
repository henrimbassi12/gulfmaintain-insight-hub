import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ArrowLeft, Save, Download } from 'lucide-react';
import { toast } from "sonner";

interface MaintenanceEntry {
  date: string;
  action: string;
  observations: string;
  signature: string;
}

interface Contact {
  name: string;
  phone: string;
  status: string;
}

interface MaintenanceTrackingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

export function MaintenanceTrackingForm({ isOpen, onClose, onSave, onBack }: MaintenanceTrackingFormProps) {
  const [formData, setFormData] = useState({
    creationDate: '',
    closureDate: '',
    region: '',
    partnership: '',
    tae: '',
    fridgeType: '',
    serialNumber: '',
    pvd1: '',
    pvd2: '',
    pvd3: '',
    maintenanceEntries: [] as MaintenanceEntry[],
    contacts: [
      { name: '', phone: '', status: 'TECHNICIEN 1' },
      { name: '', phone: '', status: 'TECHNICIEN 2' },
      { name: '', phone: '', status: 'CHEF DE REGION' },
      { name: '', phone: '', status: 'HEAD QUATER' }
    ] as Contact[]
  });

  const addMaintenanceEntry = () => {
    setFormData({
      ...formData,
      maintenanceEntries: [
        ...formData.maintenanceEntries,
        { date: '', action: '', observations: '', signature: '' }
      ]
    });
  };

  const removeMaintenanceEntry = (index: number) => {
    const newEntries = formData.maintenanceEntries.filter((_, i) => i !== index);
    setFormData({ ...formData, maintenanceEntries: newEntries });
  };

  const updateMaintenanceEntry = (index: number, field: keyof MaintenanceEntry, value: string) => {
    const newEntries = [...formData.maintenanceEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData({ ...formData, maintenanceEntries: newEntries });
  };

  const updateContact = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData({ ...formData, contacts: newContacts });
  };

  const handleSave = () => {
    onSave(formData);
    toast.success('Fiche de suivi sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-suivi-${formData.serialNumber || 'nouveau'}-${formData.creationDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE SUIVI ET DE MAINTENANCE DU RÉFRIGÉRATEUR GUINNESS ===

Date de création: ${formData.creationDate}
Date de clôture: ${formData.closureDate}
Région: ${formData.region}
Partenaire: ${formData.partnership}
TAE: ${formData.tae}
Type de Frigo: ${formData.fridgeType}
SN ou TAG NUMBER: ${formData.serialNumber}
PVD1: ${formData.pvd1}
PVD2: ${formData.pvd2}
PVD3: ${formData.pvd3}

=== HISTORIQUE DE MAINTENANCE ===
${formData.maintenanceEntries.map((entry, index) => `
Entrée ${index + 1}:
Date: ${entry.date}
Action: ${entry.action}
Observations: ${entry.observations}
Signature: ${entry.signature}
`).join('\n')}

=== CONTACTS UTILES ===
${formData.contacts.map(contact => `
${contact.status}: ${contact.name} - ${contact.phone}
`).join('\n')}

Généré le: ${new Date().toLocaleString('fr-FR')}
`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <DialogTitle>Fiche de Suivi et de Maintenance du Réfrigérateur Guinness</DialogTitle>
              <DialogDescription>
                Suivi détaillé et historique de la maintenance par réfrigérateur
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creationDate">Date de création</Label>
              <Input 
                id="creationDate"
                type="date"
                value={formData.creationDate}
                onChange={(e) => setFormData({...formData, creationDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="closureDate">Date de clôture</Label>
              <Input 
                id="closureDate"
                type="date"
                value={formData.closureDate}
                onChange={(e) => setFormData({...formData, closureDate: e.target.value})}
              />
            </div>
          </div>

          {/* Informations du réfrigérateur */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="region">Région</Label>
              <Input 
                id="region"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="partnership">Partenaire</Label>
              <Input 
                id="partnership"
                value={formData.partnership}
                onChange={(e) => setFormData({...formData, partnership: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tae">TAE</Label>
              <Input 
                id="tae"
                value={formData.tae}
                onChange={(e) => setFormData({...formData, tae: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="fridgeType">Type de Frigo</Label>
              <Select value={formData.fridgeType} onValueChange={(value) => setFormData({...formData, fridgeType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FV400">FV400</SelectItem>
                  <SelectItem value="FV420">FV420</SelectItem>
                  <SelectItem value="SDM1500">SDM1500</SelectItem>
                  <SelectItem value="SDM650">SDM650</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="serialNumber">SN ou TAG NUMBER</Label>
              <Input 
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="pvd1">PVD1</Label>
              <Input 
                id="pvd1"
                value={formData.pvd1}
                onChange={(e) => setFormData({...formData, pvd1: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="pvd2">PVD2</Label>
              <Input 
                id="pvd2"
                value={formData.pvd2}
                onChange={(e) => setFormData({...formData, pvd2: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="pvd3">PVD3</Label>
              <Input 
                id="pvd3"
                value={formData.pvd3}
                onChange={(e) => setFormData({...formData, pvd3: e.target.value})}
              />
            </div>
          </div>

          <Separator />

          {/* Entrées de maintenance */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Historique de Maintenance</h3>
              <Button onClick={addMaintenanceEntry} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une entrée
              </Button>
            </div>

            <div className="space-y-4">
              {formData.maintenanceEntries.map((entry, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium">Entrée {index + 1}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMaintenanceEntry(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`date-${index}`}>Date</Label>
                      <Input 
                        id={`date-${index}`}
                        type="date"
                        value={entry.date}
                        onChange={(e) => updateMaintenanceEntry(index, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`action-${index}`}>Actions (suivi, retrait, visite)</Label>
                      <Select 
                        value={entry.action} 
                        onValueChange={(value) => updateMaintenanceEntry(index, 'action', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner l'action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suivi">Suivi</SelectItem>
                          <SelectItem value="retrait">Retrait</SelectItem>
                          <SelectItem value="visite">Visite</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="reparation">Réparation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`observations-${index}`}>Observations</Label>
                      <Textarea 
                        id={`observations-${index}`}
                        value={entry.observations}
                        onChange={(e) => updateMaintenanceEntry(index, 'observations', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`signature-${index}`}>Noms et Signatures</Label>
                      <Input 
                        id={`signature-${index}`}
                        value={entry.signature}
                        onChange={(e) => updateMaintenanceEntry(index, 'signature', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contacts utiles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacts Utiles</h3>
            <div className="space-y-4">
              {formData.contacts.map((contact, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`contact-name-${index}`}>Nom(s) et Prénom(s)</Label>
                    <Input 
                      id={`contact-name-${index}`}
                      value={contact.name}
                      onChange={(e) => updateContact(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`contact-phone-${index}`}>Numéro(s) de téléphone</Label>
                    <Input 
                      id={`contact-phone-${index}`}
                      value={contact.phone}
                      onChange={(e) => updateContact(index, 'phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`contact-status-${index}`}>Status</Label>
                    <Input 
                      id={`contact-status-${index}`}
                      value={contact.status}
                      onChange={(e) => updateContact(index, 'status', e.target.value)}
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
