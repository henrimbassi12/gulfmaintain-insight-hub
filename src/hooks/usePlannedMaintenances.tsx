
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlannedMaintenance {
  id: string;
  type_maintenance: string;
  priorite: string;
  duree_estimee: string;
  date_programmee: string;
  date_creation: string;
  technician_assigne: string;
  division: string;
  secteur: string;
  partenaire: string;
  ville: string;
  nom_client: string;
  nom_pdv: string;
  tel_barman: string;
  quartier: string;
  localisation: string;
  serial_number: string;
  tag_number: string;
  type_frigo: string;
  af_nf: string;
  branding: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export function usePlannedMaintenances() {
  const [maintenances, setMaintenances] = useState<PlannedMaintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenances = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('planned_maintenances')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMaintenances(data || []);
      console.log(`✅ Récupération de ${data?.length || 0} maintenances planifiées réussie`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des maintenances planifiées:', error);
      setError('Erreur lors de la récupération des maintenances planifiées');
      toast.error('Erreur lors de la récupération des maintenances planifiées', {
        description: 'Vérifiez votre connexion et réessayez'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMaintenance = useCallback(async (maintenanceData: Omit<PlannedMaintenance, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('planned_maintenances')
        .insert([maintenanceData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMaintenances(prev => [data, ...prev]);
      toast.success('Maintenance planifiée créée avec succès');
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la maintenance planifiée:', error);
      toast.error('Erreur lors de la création de la maintenance planifiée');
      throw error;
    }
  }, []);

  const updateMaintenance = useCallback(async (id: string, updates: Partial<PlannedMaintenance>) => {
    try {
      const { data, error } = await supabase
        .from('planned_maintenances')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMaintenances(prev => prev.map(maintenance => 
        maintenance.id === id ? data : maintenance
      ));
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la maintenance:', error);
      toast.error('Erreur lors de la mise à jour de la maintenance');
      throw error;
    }
  }, []);

  const updateMaintenanceStatus = useCallback(async (id: string, status: string) => {
    try {
      // Pour les maintenances planifiées, on peut ajouter un champ status si nécessaire
      // Pour l'instant, on met à jour la description pour indiquer le statut
      const statusText = status === 'in-progress' ? 'En cours' : 
                        status === 'completed' ? 'Terminé' : 'Planifié';
      
      const { data, error } = await supabase
        .from('planned_maintenances')
        .update({ 
          description: `Statut: ${statusText}`,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setMaintenances(prev => prev.map(maintenance => 
        maintenance.id === id ? data : maintenance
      ));
      
      toast.success(`Maintenance ${statusText.toLowerCase()}`);
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchMaintenances();

    // Configuration temps réel
    const channel = supabase
      .channel('planned_maintenances_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'planned_maintenances'
        },
        (payload) => {
          console.log('📡 Changement détecté dans planned_maintenances:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMaintenance = payload.new as PlannedMaintenance;
            setMaintenances(prev => [newMaintenance, ...prev]);
            toast.info('Nouvelle maintenance planifiée ajoutée');
          } else if (payload.eventType === 'UPDATE') {
            const updatedMaintenance = payload.new as PlannedMaintenance;
            setMaintenances(prev => prev.map(maintenance => 
              maintenance.id === updatedMaintenance.id ? updatedMaintenance : maintenance
            ));
            toast.info('Maintenance planifiée mise à jour');
          } else if (payload.eventType === 'DELETE') {
            setMaintenances(prev => prev.filter(maintenance => maintenance.id !== payload.old.id));
            toast.info('Maintenance planifiée supprimée');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMaintenances]);

  const refetch = useCallback(() => {
    return fetchMaintenances();
  }, [fetchMaintenances]);

  return {
    maintenances,
    isLoading,
    error,
    refetch,
    createMaintenance,
    updateMaintenance,
    updateMaintenanceStatus,
  };
}
