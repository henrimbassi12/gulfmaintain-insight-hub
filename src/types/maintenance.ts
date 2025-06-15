
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
