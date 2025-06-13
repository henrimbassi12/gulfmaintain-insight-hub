
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MaintenanceEvent {
  id: string;
  title: string;
  equipment: string;
  technician: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'preventive' | 'corrective' | 'inspection';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
  location: string;
}

export function useMaintenanceCalendar() {
  const [events, setEvents] = useState<MaintenanceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Récupération des rapports de maintenance pour créer les événements
      const { data: maintenanceReports, error: reportsError } = await supabase
        .from('maintenance_reports')
        .select('*')
        .order('date', { ascending: true });

      if (reportsError) {
        throw reportsError;
      }

      // Transformation des rapports en événements de calendrier
      const calendarEvents: MaintenanceEvent[] = (maintenanceReports || []).map(report => ({
        id: report.id,
        title: `${report.type} - ${report.equipment}`,
        equipment: report.equipment,
        technician: report.technician,
        date: new Date(report.date),
        startTime: '09:00', // Valeur par défaut
        endTime: '17:00', // Valeur par défaut
        type: report.type === 'Préventive' ? 'preventive' : 
              report.type === 'Corrective' ? 'corrective' : 'inspection',
        priority: report.status === 'Terminé' ? 'low' : 
                 report.status === 'En cours' ? 'high' : 'medium',
        status: report.status === 'Terminé' ? 'completed' :
               report.status === 'En cours' ? 'in-progress' : 'planned',
        location: report.location
      }));

      setEvents(calendarEvents);
      
      console.log(`✅ Récupération planning: ${calendarEvents.length} événements`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du planning:', error);
      setError('Erreur lors de la récupération du planning');
      toast.error('Erreur lors de la récupération du planning', {
        description: 'Vérifiez votre connexion et réessayez'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: Partial<MaintenanceEvent>) => {
    try {
      // Créer un nouveau rapport de maintenance
      const { data, error } = await supabase
        .from('maintenance_reports')
        .insert({
          report_id: `RPT-${Date.now()}`,
          equipment: eventData.equipment || '',
          technician: eventData.technician || '',
          location: eventData.location || '',
          region: 'Non spécifiée',
          type: eventData.type === 'preventive' ? 'Préventive' :
                eventData.type === 'corrective' ? 'Corrective' : 'Inspection',
          status: eventData.status === 'completed' ? 'Terminé' :
                 eventData.status === 'in-progress' ? 'En cours' : 'Planifié',
          date: eventData.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          duration: '2h',
          description: eventData.title || '',
          cost: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Événement créé avec succès');
      fetchEvents(); // Actualiser la liste
      
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'événement:', error);
      toast.error('Erreur lors de la création de l\'événement');
      throw error;
    }
  }, [fetchEvents]);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<MaintenanceEvent>) => {
    try {
      const { error } = await supabase
        .from('maintenance_reports')
        .update({
          equipment: updates.equipment,
          technician: updates.technician,
          location: updates.location,
          type: updates.type === 'preventive' ? 'Préventive' :
                updates.type === 'corrective' ? 'Corrective' : 'Inspection',
          status: updates.status === 'completed' ? 'Terminé' :
                 updates.status === 'in-progress' ? 'En cours' : 'Planifié',
          date: updates.date?.toISOString().split('T')[0],
          description: updates.title
        })
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Événement mis à jour');
      fetchEvents(); // Actualiser la liste
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'événement:', error);
      toast.error('Erreur lors de la mise à jour de l\'événement');
      throw error;
    }
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();

    // Mise en place de l'écoute en temps réel
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
          fetchEvents(); // Actualiser les données
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEvents]);

  const refetch = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    createEvent,
    updateEvent,
    refetch,
  };
}
