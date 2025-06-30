
import { TechnicianLocation, EquipmentLocation, InterventionLocation } from '@/types/geolocation';

export const sampleTechnicians: TechnicianLocation[] = [
  { 
    id: '1', 
    name: 'CÉDRIC', 
    lat: 4.0511, 
    lng: 9.7679, 
    status: 'available', 
    sectors: 'JAPOMA, VILLAGE, NGODI BAKOKO',
    phone: '+237 650 123 456',
    avatar: '/avatars/cedric.jpg',
    distance: '2.3 km'
  },
  { 
    id: '2', 
    name: 'MBAPBOU GRÉGOIRE', 
    lat: 4.0383, 
    lng: 9.7792, 
    status: 'busy', 
    currentTask: 'FR-2024-012',
    sectors: 'AKWA, MBOPPI',
    phone: '+237 650 234 567',
    distance: '5.1 km'
  },
  { 
    id: '3', 
    name: 'VOUKENG', 
    lat: 4.0469, 
    lng: 9.7585, 
    status: 'available', 
    sectors: 'BONABERI',
    phone: '+237 650 345 678',
    distance: '3.7 km'
  },
  { 
    id: '4', 
    name: 'TCHINDA CONSTANT', 
    lat: 4.0600, 
    lng: 9.7700, 
    status: 'available', 
    sectors: 'ANGE RAPHAEL',
    phone: '+237 650 456 789',
    distance: '1.9 km'
  },
  { 
    id: '5', 
    name: 'NDJOKO IV', 
    lat: 4.0300, 
    lng: 9.7500, 
    status: 'offline', 
    sectors: 'DEÏDO, MAKEPE',
    phone: '+237 650 567 890',
    distance: '7.2 km'
  },
  { 
    id: '6', 
    name: 'NDOUMBE ETIA', 
    lat: 4.0450, 
    lng: 9.7620, 
    status: 'available', 
    sectors: 'AKWA, BALI',
    phone: '+237 650 678 901',
    distance: '4.1 km'
  }
];

export const sampleEquipments: EquipmentLocation[] = [
  {
    id: 'FR-2024-089',
    name: 'Réfrigérateur AKWA-01',
    type: 'Réfrigérateur',
    lat: 4.0511,
    lng: 9.7679,
    status: 'operational',
    address: 'Agence AKWA Centre',
    lastMaintenance: '15/12/2024'
  },
  {
    id: 'FR-2024-012',
    name: 'Réfrigérateur BONABERI-02',
    type: 'Réfrigérateur',
    lat: 4.0383,
    lng: 9.7792,
    status: 'maintenance',
    address: 'Agence BONABERI Port',
    lastMaintenance: '20/12/2024'
  },
  {
    id: 'FR-2024-145',
    name: 'Climatiseur DEIDO-01',
    type: 'Climatiseur',
    lat: 4.0320,
    lng: 9.7550,
    status: 'operational',
    address: 'Agence DEIDO Centre',
    lastMaintenance: '18/12/2024'
  }
];

export const sampleInterventions: InterventionLocation[] = [
  {
    id: 'INT-001',
    equipment: 'FR-2024-012',
    address: 'Agence BONABERI Port',
    lat: 4.0383,
    lng: 9.7792,
    priority: 'high',
    estimatedDuration: '1h 15min',
    scheduledDate: '2024-12-30 14:00',
    assignedTechnician: 'MBAPBOU GRÉGOIRE'
  },
  {
    id: 'INT-002',
    equipment: 'FR-2024-089',
    address: 'Agence AKWA Centre',
    lat: 4.0511,
    lng: 9.7679,
    priority: 'medium',
    estimatedDuration: '2h 30min',
    scheduledDate: '2024-12-30 16:00',
    assignedTechnician: 'CÉDRIC'
  }
];
