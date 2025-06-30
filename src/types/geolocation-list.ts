
export interface GeolocationListItem {
  id: string;
  name?: string;
  equipment?: string;
  lat: number;
  lng: number;
  type: 'technician' | 'equipment' | 'intervention';
  status?: 'available' | 'busy' | 'offline' | 'operational' | 'maintenance' | 'down';
  priority?: 'high' | 'medium' | 'low';
  address?: string;
  sectors?: string;
  distance?: string;
  lastMaintenance?: string;
  scheduledDate?: string;
  estimatedDuration?: string;
  assignedTechnician?: string;
  currentTask?: string;
  phone?: string;
}

export interface GeolocationListProps {
  items: GeolocationListItem[];
  onCenterOnMap: (lat: number, lng: number, itemId: string) => void;
  selectedItem: string | null;
}
