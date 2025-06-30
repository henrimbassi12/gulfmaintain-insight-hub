
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus } from 'lucide-react';

interface AddEquipmentFormData {
  date: string;
  technician: string;
  division: string;
  secteur: string;
  partenaire: string;
  ville: string;
  nom_client: string;
  nom_pdv: string;
  tel_barman: string;
  quartier: string;
  localisation: string;
  type_frigo: string;
  af_nf: 'AF' | 'NF';
  branding: string;
  serial_number: string;
  tag_number: string;
}

interface AddEquipmentFormProps {
  onSuccess: () => void;
}

export function AddEquipmentForm({ onSuccess }: AddEquipmentFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddEquipmentFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      technician: '',
      division: '',
      secteur: '',
      partenaire: '',
      ville: '',
      nom_client: '',
      nom_pdv: '',
      tel_barman: '',
      quartier: '',
      localisation: '',
      type_frigo: '',
      af_nf: 'NF',
      branding: '',
      serial_number: '',
      tag_number: '',
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
    'VOUKENG',
    'MBAPBOU Grégoire', 
    'TCHINDA Constant',
    'Cédric'
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
    console.log('🚀 Tentative d\'ajout d\'équipement:', data);
    
    try {
      const { data: insertedData, error } = await supabase
        .from('equipments')
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur Supabase:', error);
        throw error;
      }

      console.log('✅ Équipement créé avec succès:', insertedData);
      toast.success('Équipement ajouté avec succès');
      form.reset();
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'ajout de l\'équipement:', error);
      
      let errorMessage = 'Erreur lors de l\'ajout de l\'équipement';
      
      if (error.code === '23505') {
        errorMessage = 'Un équipement avec ce numéro de série existe déjà';
      } else if (error.code === '23502') {
        errorMessage = 'Certains champs obligatoires sont manquants';
      } else if (error.message) {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      toast.error(errorMessage);
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
