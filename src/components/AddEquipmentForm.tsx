
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
    },
  });

  const onSubmit = async (data: AddEquipmentFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('equipments')
        .insert([{
          equipment_id: data.equipment_id,
          type: data.type,
          brand: data.brand,
          model: data.model,
          location: data.location,
          agency: data.agency,
          status: data.status,
          technician: data.technician || null,
          last_maintenance: data.last_maintenance || null,
          next_maintenance: data.next_maintenance || null,
          temperature: data.temperature || null,
          serial_number: data.serial_number,
        }]);

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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel équipement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="equipment_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Équipement</FormLabel>
                  <FormControl>
                    <Input placeholder="FR-2024-001" {...field} required />
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
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Réfrigérateur commercial" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input placeholder="Samsung" {...field} required />
                    </FormControl>
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
                      <Input placeholder="RF-450XL" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Agence Casablanca Nord" {...field} required />
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
                  <FormLabel>Agence</FormLabel>
                  <FormControl>
                    <Input placeholder="Casablanca" {...field} required />
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

            <FormField
              control={form.control}
              name="technician"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technicien</FormLabel>
                  <FormControl>
                    <Input placeholder="Ahmed Benali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Température</FormLabel>
                  <FormControl>
                    <Input placeholder="4°C" {...field} />
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
                  <FormLabel>Numéro de série</FormLabel>
                  <FormControl>
                    <Input placeholder="SAM789456123" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
