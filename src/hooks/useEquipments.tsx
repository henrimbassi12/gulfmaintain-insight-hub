
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOfflineStorage } from './useOfflineStorage';
import { v4 as uuidv4 } from 'uuid';

export interface Equipment {
  id: string;
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
  created_at: string;
  updated_at: string;
}

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, saveOfflineData, syncOfflineData, hasOfflineData, clearAllOfflineData } = useOfflineStorage('equipments');

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

      // Type assertion pour assurer que af_nf est correctement typé
      const typedEquipments = (data || []).map(equipment => ({
        ...equipment,
        af_nf: equipment.af_nf as 'AF' | 'NF'
      })) as Equipment[];

      setEquipments(typedEquipments);
      console.log(`✅ Récupération de ${typedEquipments.length} équipements réussie`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des équipements:', error);
      setError('Erreur lors de la récupération des équipements');
      toast.error('Erreur lors de la récupération des équipments', {
        description: 'Vérifiez votre connexion et réessayez'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEquipment = useCallback(async (equipmentData: Omit<Equipment, 'id' | 'created_at' | 'updated_at'>) => {
    if (isOnline) {
      try {
        const { data, error } = await supabase
          .from('equipments')
          .insert([equipmentData])
          .select()
          .single();

        if (error) {
          throw error;
        }

        const typedEquipment = {
          ...data,
          af_nf: data.af_nf as 'AF' | 'NF'
        } as Equipment;

        setEquipments(prev => [typedEquipment, ...prev]);
        toast.success('Équipement créé avec succès');
        return typedEquipment;
      } catch (error) {
        console.error('❌ Erreur lors de la création de l\'équipement:', error);
        toast.error('Erreur lors de la création de l\'équipement');
        throw error;
      }
    } else {
      const tempId = uuidv4();
      const newEquipment: Equipment = {
        ...equipmentData,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setEquipments(prev => [newEquipment, ...prev]);
      saveOfflineData({ action: 'CREATE', payload: equipmentData, tempId }, tempId);
      toast.info('Mode hors ligne: Équipement sauvegardé', {
        description: 'Il sera synchronisé une fois la connexion rétablie.'
      });
      return newEquipment;
    }
  }, [isOnline, saveOfflineData]);

  const updateEquipment = useCallback(async (id: string, updates: Partial<Equipment>) => {
    if (isOnline) {
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

        const typedEquipment = {
          ...data,
          af_nf: data.af_nf as 'AF' | 'NF'
        } as Equipment;

        setEquipments(prev => prev.map(equipment => 
          equipment.id === id ? typedEquipment : equipment
        ));
        return typedEquipment;
      } catch (error) {
        console.error('❌ Erreur lors de la mise à jour de l\'équipement:', error);
        toast.error('Erreur lors de la mise à jour de l\'équipement');
        throw error;
      }
    } else {
      const updatedEquipment = equipments.find(e => e.id === id);
      if(updatedEquipment) {
        const newEquipmentState = {...updatedEquipment, ...updates, updated_at: new Date().toISOString()};
         setEquipments(prev => prev.map(equipment => 
          equipment.id === id ? newEquipmentState as Equipment : equipment
        ));
      }
      saveOfflineData({ action: 'UPDATE', payload: updates, id }, id);
      toast.info('Mode hors ligne: Mise à jour sauvegardée', {
        description: 'Elle sera synchronisée une fois la connexion rétablie.'
      });
      return updatedEquipment;
    }
  }, [isOnline, saveOfflineData, equipments]);

  const deleteEquipment = useCallback(async (id: string) => {
    if (isOnline) {
      try {
        const { error } = await supabase
          .from('equipments')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        setEquipments(prev => prev.filter(equipment => equipment.id !== id));
        toast.success('Équipment supprimé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de la suppression de l\'équipement:', error);
        toast.error('Erreur lors de la suppression de l\'équipement');
        throw error;
      }
    } else {
      setEquipments(prev => prev.filter(equipment => equipment.id !== id));
      saveOfflineData({ action: 'DELETE', id }, id);
      toast.info('Mode hors ligne: Suppression enregistrée', {
        description: 'Elle sera synchronisée une fois la connexion rétablie.'
      });
    }
  }, [isOnline, saveOfflineData]);

  // Sync effect
  useEffect(() => {
    if (isOnline && hasOfflineData) {
      toast.loading('Synchronisation des équipements en cours...');
      
      syncOfflineData(async (item) => {
        try {
          const { action, payload, id, tempId } = item;
          console.log(`📡 Synchronisation de l'action ${action} pour l'équipement ${id || tempId}`);

          if (action === 'CREATE') {
            const { data, error } = await supabase
              .from('equipments')
              .insert([payload])
              .select()
              .single();
            
            if (error) throw error;
            
            const typedEquipment = {
              ...data,
              af_nf: data.af_nf as 'AF' | 'NF'
            } as Equipment;
            
            setEquipments(prev => {
              const filteredPrev = prev.filter(e => e.id !== tempId);
              return [typedEquipment, ...filteredPrev];
            });
          } else if (action === 'UPDATE') {
            const { data, error } = await supabase
              .from('equipments')
              .update({ ...payload, updated_at: new Date().toISOString() })
              .eq('id', id)
              .select()
              .single();
            
            if (error) throw error;
            
            const typedEquipment = {
              ...data,
              af_nf: data.af_nf as 'AF' | 'NF'
            } as Equipment;
            
            setEquipments(prev => prev.map(equipment => 
              equipment.id === id ? typedEquipment : equipment
            ));
          } else if (action === 'DELETE') {
            const { error } = await supabase
              .from('equipments')
              .delete()
              .eq('id', id);
            
            if (error) throw error;
          }
          
          return true; // Succès -> retire de la file d'attente
        } catch (error) {
          console.error(`❌ Erreur de synchronisation pour ${item.id || item.tempId}:`, error);
          return false; // Échec -> reste dans la file
        }
      }).then(results => {
        const successes = Object.values(results).filter(r => r).length;
        const failures = Object.values(results).length - successes;
        
        toast.dismiss();

        if (successes > 0) {
          toast.success(`${successes} équipement(s) synchronisé(s) avec succès !`);
          refetch(); // Re-fetch all data to ensure consistency
        }
        if (failures > 0) {
          toast.error(`${failures} équipement(s) n'ont pas pu être synchronisés.`);
        }
      });
    }
  }, [isOnline, hasOfflineData, syncOfflineData]);

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
              af_nf: payload.new.af_nf as 'AF' | 'NF'
            } as Equipment;
            setEquipments(prev => [newEquipment, ...prev]);
            toast.info('Nouvel équipement ajouté');
          } else if (payload.eventType === 'UPDATE') {
            const updatedEquipment = {
              ...payload.new,
              af_nf: payload.new.af_nf as 'AF' | 'NF'
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
