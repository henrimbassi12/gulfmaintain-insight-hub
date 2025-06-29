
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus } from 'lucide-react';

interface AddEquipmentFormData {
  equipment_id: string;
  type: string;
  brand: string;
  model: string;
  location: string;
  agency: string;
  status: 'operational' | 'maintenance' | 'critical' | 'offline';
  technician?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  temperature?: string;
  serial_number: string;
  
  // Nouveaux champs demandés
  date?: string;
  division?: string;
  secteur?: string;
  partenaire?: string;
  ville?: string;
  nom_client?: string;
  nom_pdv?: string;
  tel_barman?: string;
  tag_number?: string;
  quartier?: string;
  localisation?: string;
  type_frigo?: string;
  af_nf?: string;
  branding?: string;
}

interface AddEquipmentFormProps {
  onSuccess: () => void;
}

export function AddEquipmentForm({ onSuccess }: AddEquipmentFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddEquipmentFormData>({
    defaultValues: {
      equipment_id: '',
      type: '',
      brand: '',
      model: '',
      location: '',
      agency: '',
      status: 'operational',
      technician: '',
      last_maintenance: '',
      next_maintenance: '',
      temperature: '',
      serial_number: '',
      // Nouveaux champs
      date: '',
      division: '',
      secteur: '',
      partenaire: '',
      ville: '',
      nom_client: '',
      nom_pdv: '',
      tel_barman: '',
      tag_number: '',
      quartier: '',
      localisation: '',
      type_frigo: '',
      af_nf: '',
      branding: '',
    },
  });

  const fridgeTypes = [
    'INNOVA 420',
    'INNOVA 1000', 
    'INNOVA 650',
    'SANDEN 500',
    'SUPER-35',
    'FV 400',
    'Autres'
  ];

  const technicians = [
    'Jean Mballa',
    'Pierre Nkomo', 
    'Marie Fouda',
    'Paul Essomba',
    'Catherine Biya'
  ];

  const cities = [
    'Douala',
    'Yaoundé',
    'Bafoussam',
    'Kribi',
    'Maroua',
    'Garoua'
  ];

  const onSubmit = async (data: AddEquipmentFormData) => {
    setIsLoading(true);
    try {
      const equipmentData = {
        equipment_id: data.equipment_id,
        type: data.type || null,
        brand: data.brand || null,
        model: data.model || null,
        location: data.location || null,
        agency: data.agency || null,
        status: data.status,
        technician: data.technician || null,
        last_maintenance: data.last_maintenance || null,
        next_maintenance: data.next_maintenance || null,
        temperature: data.temperature || null,
        serial_number: data.serial_number,
        // Nouveaux champs
        date: data.date || null,
        division: data.division || null,
        secteur: data.secteur || null,
        partenaire: data.partenaire || null,
        ville: data.ville || null,
        nom_client: data.nom_client || null,
        nom_pdv: data.nom_pdv || null,
        tel_barman: data.tel_barman || null,
        tag_number: data.tag_number || null,
        quartier: data.quartier || null,
        localisation: data.localisation || null,
        type_frigo: data.type_frigo || null,
        af_nf: data.af_nf || null,
        branding: data.branding || null,
      };

      const { error } = await supabase
        .from('equipments')
        .insert([equipmentData]);

      if (error) {
        throw error;
      }

      toast.success('Équipement ajouté avec succès');
      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'équipement:', error);
      toast.error('Erreur lors de l\'ajout de l\'équipement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel équipement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel équipement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="equipment_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Équipement *</FormLabel>
                      <FormControl>
                        <Input placeholder="FR-2024-001" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technician" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technicien *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un technicien" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {technicians.map(tech => (
                            <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="operational">Opérationnel</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                          <SelectItem value="offline">Hors ligne</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Organisation */}
            <Card>
              <CardHeader>
                <CardTitle>Organisation</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division *</FormLabel>
                      <FormControl>
                        <Input placeholder="Division commerciale" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secteur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secteur *</FormLabel>
                      <FormControl>
                        <Input placeholder="Secteur d'activité" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="partenaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partenaire *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du partenaire" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ville"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une ville" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Client et Point de vente */}
            <Card>
              <CardHeader>
                <CardTitle>Client & Point de vente</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nom_client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom client *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du client" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nom_pdv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom PDV *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du point de vente" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tel_barman"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tel barman *</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+237 6XX XXX XXX" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quartier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartier *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du quartier" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="localisation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localisation *</FormLabel>
                        <FormControl>
                          <Input placeholder="Adresse complète ou coordonnées GPS" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Équipement technique */}
            <Card>
              <CardHeader>
                <CardTitle>Spécifications techniques</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="serial_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SERIAL NUMBER *</FormLabel>
                      <FormControl>
                        <Input placeholder="SAM789456123" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tag_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TAG NUMBER *</FormLabel>
                      <FormControl>
                        <Input placeholder="Numéro de tag" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type_frigo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Frigo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fridgeTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="af_nf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AF/NF *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AF">AF</SelectItem>
                          <SelectItem value="NF">NF</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branding *</FormLabel>
                      <FormControl>
                        <Input placeholder="Marque/branding" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Température (°C)</FormLabel>
                      <FormControl>
                        <Input placeholder="4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="last_maintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dernière maintenance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="next_maintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prochaine maintenance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
