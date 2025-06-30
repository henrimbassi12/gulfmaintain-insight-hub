
export interface MaintenanceReport {
  id: string;
  report_id: string;
  date: string;
  technician: string;
  assigned_technician?: string;
  equipment: string;
  equipment_brand?: string;
  equipment_model?: string;
  equipment_serial_number?: string;
  location: string;
  region: string;
  type: "Préventive" | "Corrective" | "Urgente";
  status: "Terminé" | "En cours" | "Planifié";
  priority: "low" | "medium" | "high";
  duration: string;
  description: string;
  notes?: string;
  parts_used: string[];
  cost: number;
  completion_percentage: number;
  next_maintenance_date?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceFormData {
  report_id: string;
  equipment: string;
  equipment_brand?: string;
  equipment_model?: string;
  equipment_serial_number?: string;
  technician: string;
  assigned_technician?: string;
  type: string;
  priority: string;
  date: Date;
  duration: string;
  description: string;
  location: string;
  region: string;
  status: string;
  cost: number;
  parts_used: string[];
  notes?: string;
  completion_percentage: number;
  next_maintenance_date?: string;
  images?: string[];
}
