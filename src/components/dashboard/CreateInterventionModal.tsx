
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { toast } from 'sonner';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { usePlannedMaintenances } from '@/hooks/usePlannedMaintenances';

interface CreateInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateInterventionModal({ isOpen, onClose, onSuccess }: CreateInterventionModalProps) {
  const [taskDate, setTaskDate] = useState<Date>();
  const [formData, setFormData] = useState({
    names: '',
    barmanNumber: '',
    serialNumber: '',
    tagNumber: '',
    type: '',
    technician: '',
    priority: 'medium',
    location: '',
    description: '',
    estimatedDuration: '',
    timeSlot: '',
    division: '',
    sector: '',
    partner: '',
    city: '',
    afnf: '',
    nomClient: '',
    nomPdv: '',
    telBarman: '',
    quartier: '',
    typefrigo: '',
    branding: ''
  });

  const { createMaintenance } = usePlannedMaintenances();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serialNumber || !formData.type || !formData.technician || !taskDate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      console.log('📝 Création de la maintenance avec les données:', {
        ...formData,
        taskDate
      });

      // Créer la maintenance planifiée
      await createMaintenance({
        type_maintenance: formData.type,
        priorite: formData.priority,
        duree_estimee: formData.estimatedDuration || '2h',
        date_programmee: format(taskDate, 'yyyy-MM-dd'),
        date_creation: format(new Date(), 'yyyy-MM-dd'),
        technician_assigne: formData.technician,
        division: formData.division,
        secteur: formData.sector,
        partenaire: formData.partner,
        ville: formData.city,
        nom_client: formData.nomClient || 'Client non spécifié',
        nom_pdv: formData.nomPdv || 'PDV non spécifié',
        tel_barman: formData.telBarman || formData.barmanNumber || '',
        quartier: formData.quartier || 'Non spécifié',
        localisation: formData.location || 'Non spécifié',
        serial_number: formData.serialNumber,
        tag_number: formData.tagNumber || '',
        type_frigo: formData.typefrigo || 'Standard',
        af_nf: formData.afnf || 'NF',
        branding: formData.branding || 'Standard',
        description: formData.description
      });

      toast.success('Tâche programmée avec succès dans le planning');
      onClose();
      
      // Réinitialiser le formulaire
      setFormData({
        names: '',
        barmanNumber: '',
        serialNumber: '',
        tagNumber: '',
        type: '',
        technician: '',
        priority: 'medium',
        location: '',
        description: '',
        estimatedDuration: '',
        timeSlot: '',
        division: '',
        sector: '',
        partner: '',
        city: '',
        afnf: '',
        nomClient: '',
        nomPdv: '',
        telBarman: '',
        quartier: '',
        typefrigo: '',
        branding: ''
      });
      setTaskDate(undefined);
      
      onSuccess?.();
    } catch (error) {
      console.error('❌ Erreur lors de la création de la maintenance:', error);
      toast.error('Erreur lors de la programmation de la tâche');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Nouvelle tâche
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Première ligne - Noms et Numéro Barman */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="names">Noms</Label>
              <Input
                id="names"
                value={formData.names}
                onChange={(e) => setFormData({...formData, names: e.target.value})}
                placeholder="Nom du responsable"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barmanNumber">Numéro Barman</Label>
              <Input
                id="barmanNumber"
                value={formData.barmanNumber}
                onChange={(e) => setFormData({...formData, barmanNumber: e.target.value})}
                placeholder="Ex: BM-001"
              />
            </div>
          </div>

          {/* Deuxième ligne - SERIAL NUMBER et TAG NUMBER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">SERIAL NUMBER *</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                placeholder="Ex: SN-2024-089"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagNumber">TAG NUMBER</Label>
              <Input
                id="tagNumber"
                value={formData.tagNumber}
                onChange={(e) => setFormData({...formData, tagNumber: e.target.value})}
                placeholder="Ex: TAG-089"
              />
            </div>
          </div>

          {/* Informations client */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomClient">Nom Client</Label>
              <Input
                id="nomClient"
                value={formData.nomClient}
                onChange={(e) => setFormData({...formData, nomClient: e.target.value})}
                placeholder="Nom du client"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomPdv">Nom PDV</Label>
              <Input
                id="nomPdv"
                value={formData.nomPdv}
                onChange={(e) => setFormData({...formData, nomPdv: e.target.value})}
                placeholder="Nom du point de vente"
              />
            </div>
          </div>

          {/* Troisième ligne - Type et technicien */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maintenance préventive">Maintenance préventive</SelectItem>
                  <SelectItem value="Maintenance corrective">Maintenance corrective</SelectItem>
                  <SelectItem value="Installation">Installation</SelectItem>
                  <SelectItem value="Déplacement">Déplacement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="technician">Technicien assigné *</Label>
              <Select value={formData.technician} onValueChange={(value) => setFormData({...formData, technician: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un technicien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CÉDRIC">CÉDRIC - JAPOMA, VILLAGE, NGODI BAKOKO</SelectItem>
                  <SelectItem value="MBAPBOU GRÉGOIRE">MBAPBOU GRÉGOIRE - AKWA, MBOPPI</SelectItem>
                  <SelectItem value="VOUKENG">VOUKENG - BONABERI</SelectItem>
                  <SelectItem value="TCHINDA CONSTANT">TCHINDA CONSTANT - ANGE RAPHAEL</SelectItem>
                  <SelectItem value="NDJOKO IV">NDJOKO IV - DEÏDO, MAKEPE</SelectItem>
                  <SelectItem value="NDOUMBE ETIA">NDOUMBE ETIA - AKWA, BALI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quatrième ligne - Localisation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="division">Division</Label>
              <Input
                id="division"
                value={formData.division}
                onChange={(e) => setFormData({...formData, division: e.target.value})}
                placeholder="Ex: Division Centre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Secteur</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => setFormData({...formData, sector: e.target.value})}
                placeholder="Ex: Akwa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner">Partenaire</Label>
              <Input
                id="partner"
                value={formData.partner}
                onChange={(e) => setFormData({...formData, partner: e.target.value})}
                placeholder="Ex: Partner XYZ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Ex: Douala"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quartier">Quartier</Label>
            <Input
              id="quartier"
              value={formData.quartier}
              onChange={(e) => setFormData({...formData, quartier: e.target.value})}
              placeholder="Ex: Bonanjo"
            />
          </div>

          {/* Cinquième ligne - Date et détails */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {taskDate ? (
                      format(taskDate, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={taskDate}
                    onSelect={setTaskDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Créneau horaire</Label>
              <Select value={formData.timeSlot} onValueChange={(value) => setFormData({...formData, timeSlot: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un créneau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00-10:00">08:00 - 10:00</SelectItem>
                  <SelectItem value="10:00-12:00">10:00 - 12:00</SelectItem>
                  <SelectItem value="14:00-16:00">14:00 - 16:00</SelectItem>
                  <SelectItem value="16:00-18:00">16:00 - 18:00</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Durée estimée</Label>
              <Input
                id="estimatedDuration"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
                placeholder="Ex: 2h 30min"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="afnf">AF/NF</Label>
              <Select value={formData.afnf} onValueChange={(value) => setFormData({...formData, afnf: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AF">AF (Ancien Frigo)</SelectItem>
                  <SelectItem value="NF">NF (Nouveau Frigo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Adresse ou point de vente spécifique"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Détails de la tâche, problème signalé, instructions spéciales..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Programmer la tâche
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
