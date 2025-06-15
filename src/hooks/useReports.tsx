import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOfflineStorage } from './useOfflineStorage';
import { v4 as uuidv4 } from 'uuid';

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
  const { isOnline, saveOfflineData, syncOfflineData, hasOfflineData, clearAllOfflineData } = useOfflineStorage('reports');

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

  // --- Internal server functions ---
  const _createReportOnServer = useCallback(async (reportData: Omit<MaintenanceReport, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('maintenance_reports')
      .insert([reportData])
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      type: data.type as "Préventive" | "Corrective" | "Urgente",
      status: data.status as "Terminé" | "En cours" | "Planifié"
    } as MaintenanceReport;
  }, []);

  const _updateReportOnServer = useCallback(async (id: string, updates: Partial<MaintenanceReport>) => {
    const { data, error } = await supabase
      .from('maintenance_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      ...data,
      type: data.type as "Préventive" | "Corrective" | "Urgente",
      status: data.status as "Terminé" | "En cours" | "Planifié"
    } as MaintenanceReport;
  }, []);

  const _deleteReportOnServer = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('maintenance_reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }, []);


  // --- Public functions with offline handling ---
  const createReport = useCallback(async (reportData: Omit<MaintenanceReport, 'id' | 'created_at' | 'updated_at'>) => {
    if (isOnline) {
      try {
        const newReport = await _createReportOnServer(reportData);
        setReports(prev => [newReport, ...prev]);
        toast.success('Rapport créé avec succès');
        return newReport;
      } catch (error) {
        console.error('❌ Erreur lors de la création du rapport:', error);
        toast.error('Erreur lors de la création du rapport');
        throw error;
      }
    } else {
      const tempId = uuidv4();
      const newReport: MaintenanceReport = {
        ...reportData,
        id: tempId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setReports(prev => [newReport, ...prev]);
      saveOfflineData({ action: 'CREATE', payload: reportData, tempId }, tempId);
      toast.info('Mode hors ligne: Rapport sauvegardé', {
        description: 'Il sera synchronisé une fois la connexion rétablie.'
      });
      return newReport;
    }
  }, [isOnline, saveOfflineData, _createReportOnServer]);

  const updateReport = useCallback(async (id: string, updates: Partial<MaintenanceReport>) => {
    if (isOnline) {
      try {
        const updatedReport = await _updateReportOnServer(id, updates);
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
    } else {
      const updatedReport = reports.find(r => r.id === id);
      if(updatedReport) {
        const newReportState = {...updatedReport, ...updates, updated_at: new Date().toISOString()};
         setReports(prev => prev.map(report => 
          report.id === id ? newReportState as MaintenanceReport : report
        ));
      }
      saveOfflineData({ action: 'UPDATE', payload: updates, id }, id);
      toast.info('Mode hors ligne: Mise à jour sauvegardée', {
        description: 'Elle sera synchronisée une fois la connexion rétablie.'
      });
      return updatedReport;
    }
  }, [isOnline, saveOfflineData, _updateReportOnServer, reports]);

  const deleteReport = useCallback(async (id: string) => {
    if (isOnline) {
      try {
        await _deleteReportOnServer(id);
        setReports(prev => prev.filter(report => report.id !== id));
        toast.success('Rapport supprimé avec succès');
      } catch (error) {
        console.error('❌ Erreur lors de la suppression du rapport:', error);
        toast.error('Erreur lors de la suppression du rapport');
        throw error;
      }
    } else {
      setReports(prev => prev.filter(report => report.id !== id));
      saveOfflineData({ action: 'DELETE', id }, id);
      toast.info('Mode hors ligne: Suppression enregistrée', {
        description: 'Elle sera synchronisée une fois la connexion rétablie.'
      });
    }
  }, [isOnline, saveOfflineData, _deleteReportOnServer]);

  // --- Sync effect ---
  useEffect(() => {
    if (isOnline && hasOfflineData) {
      toast.loading('Synchronisation des données en cours...');
      
      syncOfflineData(async (item) => {
        try {
          const { action, payload, id, tempId } = item;
          console.log(`📡 Synchronisation de l'action ${action} pour l'id ${id || tempId}`);

          if (action === 'CREATE') {
            const newReport = await _createReportOnServer(payload);
            setReports(prev => [newReport, ...prev.filter(r => r.id !== tempId)]);
          } else if (action === 'UPDATE') {
            await _updateReportOnServer(id, payload);
          } else if (action === 'DELETE') {
            await _deleteReportOnServer(id);
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
          toast.success(`${successes} action(s) synchronisée(s) avec succès !`);
        }
        if (failures > 0) {
          toast.error(`${failures} action(s) n'ont pas pu être synchronisées.`);
        }
      });
    }
  }, [isOnline, hasOfflineData, syncOfflineData, _createReportOnServer, _updateReportOnServer, _deleteReportOnServer]);


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
