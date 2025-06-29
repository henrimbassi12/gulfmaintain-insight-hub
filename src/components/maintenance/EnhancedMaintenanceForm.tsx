import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface MaintenanceFormData {
  date: string;
  technician: string;
  division: string;
  secteur: string;
  partenaire: string;
  ville: string;
  nom_client: string;
  nom_pdv: string;
  tel_barman: string;
  serial_number: string;
  tag_number: string;
  quartier: string;
  localisation: string;
  type_frigo: string;
  af_nf: string;
  branding: string;
  // Champs supplémentaires pour maintenance
  type_maintenance: string;
  priorite: string;
  duree_estimee: string;
  date_programmee: string;
  description?: string;
}

interface EnhancedMaintenanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EnhancedMaintenanceForm({ isOpen, onClose, onSuccess }: EnhancedMaintenanceFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MaintenanceFormData>({
    defaultValues: {
      date: '',
      technician: '',
      division: '',
      secteur: '',
      partenaire: '',
      ville: '',
      nom_client: '',
      nom_pdv: '',
      tel_barman: '',
      serial_number: '',
      tag_number: '',
      quartier: '',
      localisation: '',
      type_frigo: '',
      af_nf: '',
      branding: '',
      type_maintenance: '',
      priorite: '',
      duree_estimee: '',
      date_programmee: '',
      description: '',
    },
  });

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

  const fridgeTypes = [
    'INNOVA 420',
    'INNOVA 1000', 
    'INNOVA 650',
    'SANDEN 500',
    'SUPER-35',
    'FV 400',
    'Autres'
  ];

  const maintenanceTypes = [
    'Maintenance préventive',
    'Maintenance corrective',
    'Surveillance Renforcée',
    'Investigation Défaillance',
    'Entretien Renforcé'
  ];

  const priorities = [
    'Faible',
    'Normale',
    'Haute',
    'Critique',
    'Urgent'
  ];

  const estimatedDurations = [
    '30 minutes',
    '1 heure',
    '2 heures',
    '3 heures',
    '4 heures',
    '1 jour',
    '2 jours',
    'Plus de 2 jours'
  ];

  const onSubmit = async (data: MaintenanceFormData) => {
    setIsLoading(true);
    try {
      // Simuler l'ajout de maintenance (remplacer par l'appel API réel)
      console.log('Données de maintenance:', data);
      
      // Ici vous ajouteriez l'appel à votre API Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Maintenance programmée avec succès');
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la programmation de la maintenance:', error);
      toast.error('Erreur lors de la programmation de la maintenance');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Programmer une nouvelle maintenance</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Informations de planification */}
            <Card>
              <CardHeader>
                <CardTitle>Planification de la maintenance</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type_maintenance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de maintenance *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {maintenanceTypes.map(type => (
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
                  name="priorite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priorité *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la priorité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorities.map(priority => (
                            <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duree_estimee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée estimée *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la durée" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {estimatedDurations.map(duration => (
                            <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_programmee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date programmée *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

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
                      <FormLabel>Date de création *</FormLabel>
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
                      <FormLabel>Technicien assigné *</FormLabel>
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

            {/* Organisation - reprise des champs du formulaire équipement */}
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
              </CardContent>
            </Card>

            {/* Description additionnelle */}
            <Card>
              <CardHeader>
                <CardTitle>Description de la maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description détaillée</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrire les travaux à effectuer, les problèmes identifiés, etc." 
                          rows={4}
                          {...field} 
                        />
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
                onClick={onClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Programmation...' : 'Programmer la maintenance'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
