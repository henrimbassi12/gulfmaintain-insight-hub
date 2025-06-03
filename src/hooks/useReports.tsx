
import { useState, useEffect } from 'react';
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

  const fetchReports = async () => {
    try {
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
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      toast.error('Erreur lors de la récupération des rapports');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const refetch = () => {
    fetchReports();
  };

  return {
    reports,
    isLoading,
    refetch,
  };
}
