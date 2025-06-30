
export interface TechnicianLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  currentTask?: string;
  sectors: string;
  phone?: string;
  avatar?: string;
  distance?: string;
}

export interface EquipmentLocation {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  status: 'operational' | 'maintenance' | 'down';
  address: string;
  lastMaintenance?: string;
}

export interface InterventionLocation {
  id: string;
  equipment: string;
  address: string;
  lat: number;
  lng: number;
  priority: 'high' | 'medium' | 'low';
  estimatedDuration: string;
  scheduledDate: string;
  assignedTechnician?: string;
}
