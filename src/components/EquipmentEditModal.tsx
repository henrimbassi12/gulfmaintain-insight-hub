import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Equipment, useEquipments } from '@/hooks/useEquipments';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

interface EquipmentEditModalProps {
  equipment: Equipment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EquipmentEditModal({ equipment, isOpen, onClose }: EquipmentEditModalProps) {
  const { updateEquipment } = useEquipments();
  const [formData, setFormData] = useState<Partial<Equipment>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (equipment && isOpen) {
      setFormData({ ...equipment });
    }
  }, [equipment, isOpen]);

  if (!equipment) return null;

  const handleInputChange = (field: keyof Equipment, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.technician || !formData.type_frigo || !formData.branding) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateEquipment(equipment.id, formData);
      toast.success('Équipement mis à jour avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'équipement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Modifier l'équipement - {equipment.type_frigo}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type_frigo">Type de frigo *</Label>
              <Input
                id="type_frigo"
                value={formData.type_frigo || ''}
                onChange={(e) => handleInputChange('type_frigo', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="af_nf">AF/NF *</Label>
              <Select 
                value={formData.af_nf || ''} 
                onValueChange={(value) => handleInputChange('af_nf', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner AF/NF" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AF">AF</SelectItem>
                  <SelectItem value="NF">NF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branding">Branding *</Label>
              <Input
                id="branding"
                value={formData.branding || ''}
                onChange={(e) => handleInputChange('branding', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serial_number">Numéro de série</Label>
              <Input
                id="serial_number"
                value={formData.serial_number || ''}
                onChange={(e) => handleInputChange('serial_number', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag_number">Numéro de tag</Label>
              <Input
                id="tag_number"
                value={formData.tag_number || ''}
                onChange={(e) => handleInputChange('tag_number', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Technicien *</Label>
              <Input
                id="technician"
                value={formData.technician || ''}
                onChange={(e) => handleInputChange('technician', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Localisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="division">Division</Label>
                <Input
                  id="division"
                  value={formData.division || ''}
                  onChange={(e) => handleInputChange('division', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secteur">Secteur</Label>
                <Input
                  id="secteur"
                  value={formData.secteur || ''}
                  onChange={(e) => handleInputChange('secteur', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={formData.ville || ''}
                  onChange={(e) => handleInputChange('ville', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quartier">Quartier</Label>
                <Input
                  id="quartier"
                  value={formData.quartier || ''}
                  onChange={(e) => handleInputChange('quartier', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation</Label>
                <Input
                  id="localisation"
                  value={formData.localisation || ''}
                  onChange={(e) => handleInputChange('localisation', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="partenaire">Partenaire</Label>
                <Input
                  id="partenaire"
                  value={formData.partenaire || ''}
                  onChange={(e) => handleInputChange('partenaire', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Contact et Client */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact et Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom_client">Nom du client</Label>
                <Input
                  id="nom_client"
                  value={formData.nom_client || ''}
                  onChange={(e) => handleInputChange('nom_client', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nom_pdv">Nom du point de vente</Label>
                <Input
                  id="nom_pdv"
                  value={formData.nom_pdv || ''}
                  onChange={(e) => handleInputChange('nom_pdv', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tel_barman">Téléphone</Label>
                <Input
                  id="tel_barman"
                  value={formData.tel_barman || ''}
                  onChange={(e) => handleInputChange('tel_barman', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}