
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Equipment {
  id: string;
  equipment_id: string;
  type: string;
  brand: string;
  model: string;
  location: string;
  agency: string;
  status: 'operational' | 'maintenance' | 'critical' | 'offline';
  technician: string | null;
  last_maintenance: string | null;
  next_maintenance: string | null;
  temperature: string | null;
  serial_number: string;
  created_at: string;
  updated_at: string;
}

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('equipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Type assertion pour s'assurer que les données correspondent au type Equipment
      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'operational' | 'maintenance' | 'critical' | 'offline'
      }));

      setEquipments(typedData);
      console.log(`✅ Récupération de ${typedData.length} équipements réussie`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des équipements:', error);
      setError('Erreur lors de la récupération des équipements');
      toast.error('Erreur lors de la récupération des équipements', {
        description: 'Vérifiez votre connexion et réessayez'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEquipment = useCallback(async (equipmentData: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .insert([equipmentData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newEquipment = {
        ...data,
        status: data.status as 'operational' | 'maintenance' | 'critical' | 'offline'
      } as Equipment;

      setEquipments(prev => [newEquipment, ...prev]);
      toast.success('Équipement créé avec succès');
      return newEquipment;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'équipement:', error);
      toast.error('Erreur lors de la création de l\'équipement');
      throw error;
    }
  }, []);

  const updateEquipment = useCallback(async (id: string, updates: Partial<Equipment>) => {
    try {
      const { data, error } = await supabase
        .from('equipments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedEquipment = {
        ...data,
        status: data.status as 'operational' | 'maintenance' | 'critical' | 'offline'
      } as Equipment;

      setEquipments(prev => prev.map(equipment => 
        equipment.id === id ? updatedEquipment : equipment
      ));
      toast.success('Équipement mis à jour avec succès');
      return updatedEquipment;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'équipement:', error);
      toast.error('Erreur lors de la mise à jour de l\'équipement');
      throw error;
    }
  }, []);

  const deleteEquipment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipments')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setEquipments(prev => prev.filter(equipment => equipment.id !== id));
      toast.success('Équipement supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'équipement:', error);
      toast.error('Erreur lors de la suppression de l\'équipement');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchEquipments();

    // Set up real-time subscription
    const channel = supabase
      .channel('equipments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipments'
        },
        (payload) => {
          console.log('📡 Changement détecté dans equipments:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newEquipment = {
              ...payload.new,
              status: payload.new.status as 'operational' | 'maintenance' | 'critical' | 'offline'
            } as Equipment;
            
            setEquipments(prev => [newEquipment, ...prev]);
            toast.info('Nouvel équipement ajouté');
          } else if (payload.eventType === 'UPDATE') {
            const updatedEquipment = {
              ...payload.new,
              status: payload.new.status as 'operational' | 'maintenance' | 'critical' | 'offline'
            } as Equipment;
            
            setEquipments(prev => prev.map(equipment => 
              equipment.id === updatedEquipment.id ? updatedEquipment : equipment
            ));
            toast.info('Équipement mis à jour');
          } else if (payload.eventType === 'DELETE') {
            setEquipments(prev => prev.filter(equipment => equipment.id !== payload.old.id));
            toast.info('Équipement supprimé');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEquipments]);

  const refetch = useCallback(() => {
    return fetchEquipments();
  }, [fetchEquipments]);

  return {
    equipments,
    isLoading,
    error,
    refetch,
    createEquipment,
    updateEquipment,
    deleteEquipment,
  };
}
