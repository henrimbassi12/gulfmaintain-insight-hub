
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
      
      console.log('🔄 Récupération des maintenances planifiées...');
      
      // Récupération des maintenances planifiées
      const { data: plannedMaintenances, error: plannedError } = await supabase
        .from('planned_maintenances')
        .select('*')
        .order('date_programmee', { ascending: true });

      if (plannedError) {
        throw plannedError;
      }

      console.log('📋 Maintenances planifiées récupérées:', plannedMaintenances?.length || 0);

      // Transformation des maintenances planifiées en événements de calendrier
      const plannedEvents: MaintenanceEvent[] = (plannedMaintenances || []).map(maintenance => ({
        id: maintenance.id,
        title: `${maintenance.type_maintenance} - ${maintenance.serial_number}`,
        equipment: `${maintenance.type_frigo} - ${maintenance.serial_number}`,
        technician: maintenance.technician_assigne,
        date: new Date(maintenance.date_programmee),
        startTime: '09:00', // Valeur par défaut
        endTime: '17:00', // Valeur par défaut
        type: maintenance.type_maintenance.toLowerCase().includes('préventive') ? 'preventive' : 
              maintenance.type_maintenance.toLowerCase().includes('corrective') ? 'corrective' : 'inspection',
        priority: maintenance.priorite === 'high' ? 'high' : 
                 maintenance.priorite === 'medium' ? 'medium' : 'low',
        status: 'planned',
        location: `${maintenance.ville} - ${maintenance.quartier}`
      }));

      // Récupération des rapports de maintenance pour créer les événements historiques
      const { data: maintenanceReports, error: reportsError } = await supabase
        .from('maintenance_reports')
        .select('*')
        .order('date', { ascending: true });

      if (reportsError) {
        console.warn('⚠️ Erreur lors de la récupération des rapports:', reportsError);
      }

      // Transformation des rapports en événements de calendrier
      const reportEvents: MaintenanceEvent[] = (maintenanceReports || []).map(report => ({
        id: `report-${report.id}`,
        title: `${report.type} - ${report.equipment}`,
        equipment: report.equipment,
        technician: report.technician,
        date: new Date(report.date),
        startTime: '09:00',
        endTime: '17:00',
        type: report.type === 'Préventive' ? 'preventive' : 
              report.type === 'Corrective' ? 'corrective' : 'inspection',
        priority: report.status === 'Terminé' ? 'low' : 
                 report.status === 'En cours' ? 'high' : 'medium',
        status: report.status === 'Terminé' ? 'completed' :
               report.status === 'En cours' ? 'in-progress' : 'planned',
        location: report.location
      }));

      // Combiner les événements planifiés et les rapports
      const allEvents = [...plannedEvents, ...reportEvents];
      
      setEvents(allEvents);
      
      console.log(`✅ Récupération planning: ${allEvents.length} événements (${plannedEvents.length} planifiés, ${reportEvents.length} rapports)`);
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
      if (eventId.startsWith('report-')) {
        // Mise à jour d'un rapport de maintenance
        const realId = eventId.replace('report-', '');
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
          .eq('id', realId);

        if (error) throw error;
      } else {
        // Mise à jour d'une maintenance planifiée
        const { error } = await supabase
          .from('planned_maintenances')
          .update({
            date_programmee: updates.date?.toISOString().split('T')[0],
            technician_assigne: updates.technician,
            type_maintenance: updates.type === 'preventive' ? 'Maintenance préventive' :
                            updates.type === 'corrective' ? 'Maintenance corrective' : 'Inspection',
            priorite: updates.priority
          })
          .eq('id', eventId);

        if (error) throw error;
      }

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

    // Mise en place de l'écoute en temps réel pour les maintenances planifiées
    const plannedChannel = supabase
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
          fetchEvents(); // Actualiser les données
        }
      )
      .subscribe();

    // Mise en place de l'écoute en temps réel pour les rapports de maintenance
    const reportsChannel = supabase
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
      supabase.removeChannel(plannedChannel);
      supabase.removeChannel(reportsChannel);
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
