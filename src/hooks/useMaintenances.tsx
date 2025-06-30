
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Maintenance {
  id: string;
  report_id: string;
  equipment: string;
  technician: string;
  type: string;
  status: string;
  date: string;
  location: string;
  region: string;
  description: string;
  priority: string;
  duration: string;
  cost: number;
  parts_used: string[];
  notes: string;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export function useMaintenances() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenances = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('maintenance_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const typedMaintenances = (data || []).map(maintenance => ({
        ...maintenance,
        parts_used: maintenance.parts_used || []
      })) as Maintenance[];

      setMaintenances(typedMaintenances);
      console.log(`✅ Récupération de ${typedMaintenances.length} maintenances réussie`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des maintenances:', error);
      setError('Erreur lors de la récupération des maintenances');
      toast.error('Erreur lors de la récupération des maintenances', {
        description: 'Vérifiez votre connexion et réessayez'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMaintenance = useCallback(async (maintenanceData: Omit<Maintenance, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_reports')
        .insert([maintenanceData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const typedMaintenance = {
        ...data,
        parts_used: data.parts_used || []
      } as Maintenance;

      setMaintenances(prev => [typedMaintenance, ...prev]);
      toast.success('Maintenance créée avec succès');
      return typedMaintenance;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la maintenance:', error);
      toast.error('Erreur lors de la création de la maintenance');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchMaintenances();

    // Configuration temps réel
    const channel = supabase
      .channel('maintenance_reports_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_reports'
        },
        (payload) => {
          console.log('📡 Changement détecté dans maintenance_reports:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newMaintenance = {
              ...payload.new,
              parts_used: payload.new.parts_used || []
            } as Maintenance;
            setMaintenances(prev => [newMaintenance, ...prev]);
            toast.info('Nouvelle maintenance ajoutée');
          } else if (payload.eventType === 'UPDATE') {
            const updatedMaintenance = {
              ...payload.new,
              parts_used: payload.new.parts_used || []
            } as Maintenance;
            setMaintenances(prev => prev.map(maintenance => 
              maintenance.id === updatedMaintenance.id ? updatedMaintenance : maintenance
            ));
            toast.info('Maintenance mise à jour');
          } else if (payload.eventType === 'DELETE') {
            setMaintenances(prev => prev.filter(maintenance => maintenance.id !== payload.old.id));
            toast.info('Maintenance supprimée');
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
  };
}
