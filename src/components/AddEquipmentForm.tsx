
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
  serial_number: string;
  location: string;
  agency: string;
  technician: string;
  status: 'operational' | 'maintenance' | 'critical' | 'offline';
  temperature: string;
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
      serial_number: '',
      location: '',
      agency: '',
      technician: '',
      status: 'operational',
      temperature: '',
    },
  });

  const fridgeTypes = [
    'INNOVA 420',
    'INNOVA 1000', 
    'INNOVA 650',
    'SANDEN 500',
    'SUPER-35',
    'FV 400',
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

  const technicians = [
    'VOUKENG',
    'MBAPBOU Grégoire', 
    'TCHINDA Constant',
    'Cédric',
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
    'Garoua',
    'Douala Centre'
  ];

  const statusOptions = [
    { value: 'operational', label: 'Opérationnel' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'critical', label: 'Critique' },
    { value: 'offline', label: 'Hors service' }
  ];

  const onSubmit = async (data: AddEquipmentFormData) => {
    setIsLoading(true);
    console.log('🚀 Tentative d\'ajout d\'équipement:', data);
    
    try {
      // Générer un ID d'équipement automatique si vide
      const equipmentId = data.equipment_id || `EQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      const equipmentData = {
        equipment_id: equipmentId,
        type: data.type,
        brand: data.brand,
        model: data.model || data.type, // Utiliser le type comme modèle si pas de modèle spécifié
        serial_number: data.serial_number,
        location: data.location,
        agency: data.agency,
        status: data.status,
        technician: data.technician || null,
        temperature: data.temperature || null,
        last_maintenance: null,
        next_maintenance: null
      };

      console.log('📝 Données à insérer:', equipmentData);

      const { data: insertedData, error } = await supabase
        .from('equipments')
        .insert(equipmentData)
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
      
      // Messages d'erreur détaillés
      let errorMessage = 'Erreur lors de l\'ajout de l\'équipement';
      
      if (error.code === '23505') {
        errorMessage = 'Un équipement avec cet ID existe déjà';
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
                  name="equipment_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Équipement</FormLabel>
                      <FormControl>
                        <Input placeholder="Laissez vide pour génération automatique" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
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
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner la marque" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map(brand => (
                            <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: FV800" {...field} />
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
                      <FormLabel>Numéro de série *</FormLabel>
                      <FormControl>
                        <Input placeholder="SAM789456123" {...field} required />
                      </FormControl>
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
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Localisation */}
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emplacement *</FormLabel>
                      <FormControl>
                        <Input placeholder="Adresse ou localisation" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agence *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'agence" />
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

            {/* Maintenance */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="technician"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technicien assigné</FormLabel>
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
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Température (°C)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: -5" {...field} />
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
