import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';

// Données d'exemple avec les nouvelles régions et équipements
export const failurePredictionSamples: FailurePrediction[] = [
  {
    id: '1',
    equipment_id: 'FR-SAN-300-01',
    equipment_name: 'SANDEN 300',
    failure_risk: 85,
    type: 'AF',
    location: 'AKWA',
    predicted_date: '2025-06-20',
    recommended_action: 'Maintenance préventive immédiate du compresseur. Vérifier le circuit de gaz.',
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '2',
    equipment_id: 'FR-SAN-500-01',
    equipment_name: 'SANDEN 500',
    failure_risk: 72,
    type: 'NF',
    location: 'DEÏDO',
    predicted_date: '2025-06-22',
    recommended_action: 'Inspection programmée du thermostat et nettoyage des condenseurs.',
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '3',
    equipment_id: 'FR-INN-420-01',
    equipment_name: 'INNOVA 420',
    failure_risk: 68,
    type: 'AF',
    location: 'ANGE RAPHAEL',
    predicted_date: '2025-07-01',
    recommended_action: 'Surveillance renforcée du moteur de ventilateur.',
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '4',
    equipment_id: 'FR-INN-650-01',
    equipment_name: 'INNOVA 650',
    failure_risk: 79,
    type: 'AF',
    location: 'BONABERI',
    predicted_date: '2025-06-18',
    recommended_action: 'Remplacement du compresseur et vérification de l\'isolation de la porte.',
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '5',
    equipment_id: 'FR-INN-1000-01',
    equipment_name: 'INNOVA 1000',
    failure_risk: 63,
    type: 'NF',
    location: 'JAPOMA',
    predicted_date: '2025-07-05',
    recommended_action: 'Nettoyage des serpentins et vérification de la charge de réfrigérant.',
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '6',
    equipment_id: 'FR-SAN-300-02',
    equipment_name: 'SANDEN 300',
    failure_risk: 75,
    type: 'NF',
    location: 'MBOPPI',
    predicted_date: '2025-06-25',
    recommended_action: 'Vérification du système de dégivrage.',
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  }
];

export const technicianRecommendationSamples: TechnicianRecommendation[] = [
  {
    id: '1',
    technician: 'NDOUMBE ETIA',
    equipment_id: 'FR-SAN-300-01',
    equipment_name: 'SANDEN 300',
    location: 'AKWA',
    match_score: 92,
    availability: 'Disponible demain',
    experience: '8 ans en réfrigération',
    success_rate: 96,
    expertise: ['Réfrigération', 'SANDEN', 'Électrique'],
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '2',
    technician: 'NDJOKO IV',
    equipment_id: 'FR-SAN-500-01',
    equipment_name: 'SANDEN 500',
    location: 'DEÏDO',
    match_score: 87,
    availability: 'Disponible aujourd\'hui',
    experience: '6 ans en maintenance frigo',
    success_rate: 94,
    expertise: ['Réfrigération', 'Maintenance préventive'],
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '3',
    technician: 'TCHINDA CONSTANT',
    equipment_id: 'FR-INN-420-01',
    equipment_name: 'INNOVA 420',
    location: 'ANGE RAPHAEL',
    match_score: 89,
    availability: 'Disponible demain matin',
    experience: '7 ans sur modèles INNOVA',
    success_rate: 93,
    expertise: ['INNOVA', 'Électrique', 'Diagnostic'],
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '4',
    technician: 'VOUKENG',
    equipment_id: 'FR-INN-650-01',
    equipment_name: 'INNOVA 650',
    location: 'BONABERI',
    match_score: 95,
    availability: 'Disponible immédiatement',
    experience: '10 ans en réfrigération commerciale',
    success_rate: 98,
    expertise: ['Réfrigération', 'Électrique', 'Mécanique'],
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '5',
    technician: 'CEDRIC',
    equipment_id: 'FR-INN-1000-01',
    equipment_name: 'INNOVA 1000',
    location: 'JAPOMA',
    match_score: 91,
    availability: 'Après-demain',
    experience: '7 ans en maintenance',
    success_rate: 95,
    expertise: ['Réfrigération', 'Maintenance', 'Diagnostic'],
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: '6',
    technician: 'MBAPBOU',
    equipment_id: 'FR-SAN-300-02',
    equipment_name: 'SANDEN 300',
    location: 'MBOPPI',
    match_score: 90,
    availability: 'Disponible',
    experience: '5 ans, spécialiste SANDEN',
    success_rate: 92,
    expertise: ['Réfrigération', 'SANDEN', 'Dépannage'],
    created_at: '2025-06-15T10:00:00Z',
    updated_at: '2025-06-15T10:00:00Z'
  }
];
