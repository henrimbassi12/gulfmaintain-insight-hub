
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceReport } from "@/types/maintenance";

export async function fetchReportsFromServer() {
  const { data, error } = await supabase
    .from('maintenance_reports')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;

  return (data || []).map(item => ({
    ...item,
    type: item.type as "Préventive" | "Corrective" | "Urgente",
    status: item.status as "Terminé" | "En cours" | "Planifié"
  })) as MaintenanceReport[];
}

export async function createReportOnServer(reportData: Omit<MaintenanceReport, 'id' | 'created_at' | 'updated_at'>) {
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
}

export async function updateReportOnServer(id: string, updates: Partial<MaintenanceReport>) {
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
}

export async function deleteReportOnServer(id: string) {
  const { error } = await supabase
    .from('maintenance_reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
