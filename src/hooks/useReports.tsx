
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MaintenanceReport {
  id: string;
  report_id: string;
  date: string;
  technician: string;
  equipment: string;
  location: string;
  region: string;
  type: "Préventive" | "Corrective" | "Urgente";
  status: "Terminé" | "En cours" | "Planifié";
  duration: string;
  description: string;
  parts_used: string[];
  cost: number;
  created_at: string;
  updated_at: string;
}

export function useReports() {
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('maintenance_reports')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Type assertions to ensure proper typing
      const typedReports = (data || []).map(item => ({
        ...item,
        type: item.type as "Préventive" | "Corrective" | "Urgente",
        status: item.status as "Terminé" | "En cours" | "Planifié"
      })) as MaintenanceReport[];

      setReports(typedReports);
      console.log(`✅ Récupération de ${typedReports.length} rapports réussie`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des rapports:', error);
      setError('Erreur lors de la récupération des rapports');
      toast.error('Erreur lors de la récupération des rapports', {
        description: 'Vérifiez votre connexion et réessayez'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReport = useCallback(async (reportData: Omit<MaintenanceReport, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_reports')
        .insert([reportData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newReport = {
        ...data,
        type: data.type as "Préventive" | "Corrective" | "Urgente",
        status: data.status as "Terminé" | "En cours" | "Planifié"
      } as MaintenanceReport;

      setReports(prev => [newReport, ...prev]);
      toast.success('Rapport créé avec succès');
      return newReport;
    } catch (error) {
      console.error('❌ Erreur lors de la création du rapport:', error);
      toast.error('Erreur lors de la création du rapport');
      throw error;
    }
  }, []);

  const updateReport = useCallback(async (id: string, updates: Partial<MaintenanceReport>) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const updatedReport = {
        ...data,
        type: data.type as "Préventive" | "Corrective" | "Urgente",
        status: data.status as "Terminé" | "En cours" | "Planifié"
      } as MaintenanceReport;

      setReports(prev => prev.map(report => 
        report.id === id ? updatedReport : report
      ));
      toast.success('Rapport mis à jour avec succès');
      return updatedReport;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du rapport:', error);
      toast.error('Erreur lors de la mise à jour du rapport');
      throw error;
    }
  }, []);

  const deleteReport = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_reports')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setReports(prev => prev.filter(report => report.id !== id));
      toast.success('Rapport supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du rapport:', error);
      toast.error('Erreur lors de la suppression du rapport');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchReports();

    // Set up real-time subscription
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
            const newReport = {
              ...payload.new,
              type: payload.new.type as "Préventive" | "Corrective" | "Urgente",
              status: payload.new.status as "Terminé" | "En cours" | "Planifié"
            } as MaintenanceReport;
            
            setReports(prev => [newReport, ...prev]);
            toast.info('Nouveau rapport ajouté');
          } else if (payload.eventType === 'UPDATE') {
            const updatedReport = {
              ...payload.new,
              type: payload.new.type as "Préventive" | "Corrective" | "Urgente",
              status: payload.new.status as "Terminé" | "En cours" | "Planifié"
            } as MaintenanceReport;
            
            setReports(prev => prev.map(report => 
              report.id === updatedReport.id ? updatedReport : report
            ));
            toast.info('Rapport mis à jour');
          } else if (payload.eventType === 'DELETE') {
            setReports(prev => prev.filter(report => report.id !== payload.old.id));
            toast.info('Rapport supprimé');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchReports]);

  const refetch = useCallback(() => {
    return fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    error,
    refetch,
    createReport,
    updateReport,
    deleteReport,
  };
}
