
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DepotScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onBack?: () => void;
}

interface DepotEntry {
  id: string;
  depot: string;
  semaine: string;
  date: string;
  heureArrivee: string;
  heureDepart: string;
  sigChefSecteur: string;
  sigTechnicien: string;
}

export function DepotScheduleForm({ isOpen, onClose, onSave, onBack }: DepotScheduleFormProps) {
  const [formData, setFormData] = useState({
    nomTechnicien: ''
  });

  const [depotEntries, setDepotEntries] = useState<DepotEntry[]>([
    { 
      id: '1', 
      depot: '', 
      semaine: 'SEMAINE 1', 
      date: '', 
      heureArrivee: '', 
      heureDepart: '', 
      sigChefSecteur: '', 
      sigTechnicien: '' 
    },
    { 
      id: '2', 
      depot: '', 
      semaine: 'SEMAINE 2', 
      date: '', 
      heureArrivee: '', 
      heureDepart: '', 
      sigChefSecteur: '', 
      sigTechnicien: '' 
    },
    { 
      id: '3', 
      depot: '', 
      semaine: 'SEMAINE 3', 
      date: '', 
      heureArrivee: '', 
      heureDepart: '', 
      sigChefSecteur: '', 
      sigTechnicien: '' 
    },
    { 
      id: '4', 
      depot: '', 
      semaine: 'SEMAINE 4', 
      date: '', 
      heureArrivee: '', 
      heureDepart: '', 
      sigChefSecteur: '', 
      sigTechnicien: '' 
    }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateDepotEntry = (id: string, field: string, value: string) => {
    setDepotEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addDepotEntry = () => {
    const newEntry: DepotEntry = {
      id: Date.now().toString(),
      depot: '',
      semaine: `SEMAINE ${depotEntries.length + 1}`,
      date: '',
      heureArrivee: '',
      heureDepart: '',
      sigChefSecteur: '',
      sigTechnicien: ''
    };
    setDepotEntries(prev => [...prev, newEntry]);
  };

  const removeDepotEntry = (id: string) => {
    if (depotEntries.length > 1) {
      setDepotEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const handleSave = () => {
    const completeData = {
      ...formData,
      depotEntries
    };
    onSave(completeData);
    toast.success('Fiche de passage au dépôt sauvegardée avec succès !');
    onClose();
  };

  const handleDownload = () => {
    const content = generateFormContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fiche-passage-depot-${formData.nomTechnicien || 'technicien'}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Fiche téléchargée avec succès !');
  };

  const generateFormContent = () => {
    return `=== FICHE DE PASSAGE AU DEPOT ===

NOM DU TECHNICIEN: ${formData.nomTechnicien}

=== PASSAGES AU DEPOT ===
${depotEntries.map((entry, index) => `
=== TABLEAU ${index + 1} ===
Dépôt: ${entry.depot}
${entry.semaine}
Date: ${entry.date}
Heure d'arrivée: ${entry.heureArrivee}
Heure de départ: ${entry.heureDepart}
Signature chef secteur: ${entry.sigChefSecteur}
Signature technicien: ${entry.sigTechnicien}
`).join('\n')}

Généré le: ${new Date().toLocaleString('fr-FR')}
`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="text-center w-full">
              <DialogTitle className="text-xl font-bold">FICHE DE PASSAGE AU DEPOT</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <Label htmlFor="nomTechnicien">NOM DU TECHNICIEN</Label>
                <Input
                  id="nomTechnicien"
                  value={formData.nomTechnicien}
                  onChange={(e) => handleInputChange('nomTechnicien', e.target.value)}
                  placeholder="Nom du technicien"
                  className="text-center font-medium"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tableaux de passage */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fiche de passage au dépôt</CardTitle>
                <Button onClick={addDepotEntry} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une semaine
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {depotEntries.map((entry, index) => (
                <div key={entry.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-lg">Tableau {index + 1} - {entry.semaine}</h4>
                    {depotEntries.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeDepotEntry(entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>DEPOT</Label>
                      <Input
                        value={entry.depot}
                        onChange={(e) => updateDepotEntry(entry.id, 'depot', e.target.value)}
                        placeholder="Nom du dépôt"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SEMAINE</Label>
                      <Input
                        value={entry.semaine}
                        onChange={(e) => updateDepotEntry(entry.id, 'semaine', e.target.value)}
                        placeholder="Ex: SEMAINE 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>DATE</Label>
                      <Input
                        type="date"
                        value={entry.date}
                        onChange={(e) => updateDepotEntry(entry.id, 'date', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HEURE D'ARRIVEE</Label>
                      <Input
                        type="time"
                        value={entry.heureArrivee}
                        onChange={(e) => updateDepotEntry(entry.id, 'heureArrivee', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>HEURE DE DEPART</Label>
                      <Input
                        type="time"
                        value={entry.heureDepart}
                        onChange={(e) => updateDepotEntry(entry.id, 'heureDepart', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SIG CHEF SECTEUR</Label>
                      <Input
                        value={entry.sigChefSecteur}
                        onChange={(e) => updateDepotEntry(entry.id, 'sigChefSecteur', e.target.value)}
                        placeholder="Signature chef de secteur"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SIG TECHNICIEN</Label>
                      <Input
                        value={entry.sigTechnicien}
                        onChange={(e) => updateDepotEntry(entry.id, 'sigTechnicien', e.target.value)}
                        placeholder="Signature technicien"
                      />
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
