
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Save, X } from "lucide-react";
import { toast } from 'sonner';

interface EquipmentFormData {
  equipment_id: string;
  type: string;
  brand: string;
  model: string;
  serial_number: string;
  location: string;
  agency: string;
  technician: string;
  status: string;
  temperature: string;
  last_maintenance: string;
  next_maintenance: string;
}

interface EquipmentFormModalProps {
  onSuccess?: () => void;
}

export function EquipmentFormModal({ onSuccess }: EquipmentFormModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<EquipmentFormData>({
    equipment_id: '',
    type: '',
    brand: '',
    model: '',
    serial_number: '',
    location: '',
    agency: '',
    technician: '',
    status: 'Opérationnel',
    temperature: '',
    last_maintenance: '',
    next_maintenance: ''
  });

  const equipmentTypes = [
    'Réfrigérateur',
    'Congélateur',
    'Climatiseur',
    'Frigo vitrine',
    'Armoire réfrigérée'
  ];

  const brands = [
    'GUINNESS',
    'Samsung',
    'LG',
    'Whirlpool',
    'Bosch',
    'Electrolux'
  ];

  const agencies = [
    'Douala Centre',
    'Yaoundé',
    'Bafoussam',
    'Kribi',
    'Maroua',
    'Garoua'
  ];

  const technicians = [
    'Jean Mballa',
    'Pierre Nkomo',
    'Marie Fouda',
    'Paul Essomba',
    'Catherine Biya'
  ];

  const statusOptions = [
    'Opérationnel',
    'En panne',
    'En maintenance',
    'Hors service'
  ];

  const handleInputChange = (field: keyof EquipmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.equipment_id || !formData.type || !formData.brand) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      toast.promise(
        new Promise(resolve => setTimeout(resolve, 2000)),
        {
          loading: 'Ajout de l\'équipement en cours...',
          success: 'Équipement ajouté avec succès !',
          error: 'Erreur lors de l\'ajout de l\'équipement'
        }
      );

      // Simuler l'ajout
      setTimeout(() => {
        setIsOpen(false);
        setFormData({
          equipment_id: '',
          type: '',
          brand: '',
          model: '',
          serial_number: '',
          location: '',
          agency: '',
          technician: '',
          status: 'Opérationnel',
          temperature: '',
          last_maintenance: '',
          next_maintenance: ''
        });
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'ajout de l\'équipement');
    }
  };

  const handleReset = () => {
    setFormData({
      equipment_id: '',
      type: '',
      brand: '',
      model: '',
      serial_number: '',
      location: '',
      agency: '',
      technician: '',
      status: 'Opérationnel',
      temperature: '',
      last_maintenance: '',
      next_maintenance: ''
    });
    toast.success('Formulaire réinitialisé');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Équipement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ajouter un nouvel équipement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipment_id">ID Équipement *</Label>
                  <Input
                    id="equipment_id"
                    value={formData.equipment_id}
                    onChange={(e) => handleInputChange('equipment_id', e.target.value)}
                    placeholder="Ex: EQP-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marque *</Label>
                  <Select onValueChange={(value) => handleInputChange('brand', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la marque" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modèle</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="Ex: FV800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serial_number">Numéro de série</Label>
                  <Input
                    id="serial_number"
                    value={formData.serial_number}
                    onChange={(e) => handleInputChange('serial_number', e.target.value)}
                    placeholder="Numéro de série"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Localisation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Emplacement</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Adresse ou localisation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agency">Agence</Label>
                  <Select onValueChange={(value) => handleInputChange('agency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'agence" />
                    </SelectTrigger>
                    <SelectContent>
                      {agencies.map(agency => (
                        <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Maintenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technician">Technicien assigné</Label>
                  <Select onValueChange={(value) => handleInputChange('technician', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un technicien" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map(tech => (
                        <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_maintenance">Dernière maintenance</Label>
                  <Input
                    id="last_maintenance"
                    type="date"
                    value={formData.last_maintenance}
                    onChange={(e) => handleInputChange('last_maintenance', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="next_maintenance">Prochaine maintenance</Label>
                  <Input
                    id="next_maintenance"
                    type="date"
                    value={formData.next_maintenance}
                    onChange={(e) => handleInputChange('next_maintenance', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Température (°C)</Label>
                  <Input
                    id="temperature"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    placeholder="Ex: -5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleReset}>
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
