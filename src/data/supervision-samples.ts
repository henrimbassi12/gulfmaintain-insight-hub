
import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';

// Données d'exemple avec les nouvelles régions
export const generateSamplePredictions = (): FailurePrediction[] => {
  return [
    {
      id: '1',
      equipment_id: 'FR-2024-089',
      equipment_name: 'Réfrigérateur Commercial A1',
      failure_risk: 85,
      type: 'AF',
      location: 'JAPOMA',
      predicted_date: '2024-02-15',
      recommended_action: 'Maintenance préventive immédiate du compresseur. Vérifier le circuit de gaz.',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      equipment_id: 'FR-2024-012',
      equipment_name: 'Climatiseur Bureau B2',
      failure_risk: 72,
      type: 'NF',
      location: 'AKWA',
      predicted_date: '2024-02-22',
      recommended_action: 'Inspection programmée du ventilateur et nettoyage des filtres.',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      equipment_id: 'FR-2024-134',
      equipment_name: 'Système HVAC C3',
      failure_risk: 68,
      type: 'AF',
      location: 'BONABERI',
      predicted_date: '2024-03-01',
      recommended_action: 'Surveillance renforcée du moteur principal.',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '4',
      equipment_id: 'FR-2024-156',
      equipment_name: 'Réfrigérateur Vitrine D4',
      failure_risk: 79,
      type: 'AF',
      location: 'ANGE RAPHAEL',
      predicted_date: '2024-02-18',
      recommended_action: 'Remplacement du compresseur et vérification de l\'isolation.',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '5',
      equipment_id: 'FR-2024-167',
      equipment_name: 'Climatiseur Central E5',
      failure_risk: 63,
      type: 'NF',
      location: 'DEÏDO',
      predicted_date: '2024-03-05',
      recommended_action: 'Nettoyage des filtres et vérification de la charge de réfrigérant.',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];
};

export const generateSampleRecommendations = (): TechnicianRecommendation[] => {
  return [
    {
      id: '1',
      technician: 'Emmanuel Fotso',
      equipment_id: 'FR-2024-089',
      equipment_name: 'Réfrigérateur Commercial A1',
      location: 'JAPOMA',
      match_score: 92,
      availability: 'Disponible demain',
      experience: '8 ans en réfrigération',
      success_rate: 96,
      expertise: ['Réfrigération', 'Climatisation', 'Électrique'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      technician: 'Serge Talla',
      equipment_id: 'FR-2024-012',
      equipment_name: 'Climatiseur Bureau B2',
      location: 'AKWA',
      match_score: 87,
      availability: 'Disponible aujourd\'hui',
      experience: '6 ans en HVAC',
      success_rate: 94,
      expertise: ['Climatisation', 'Ventilation', 'Maintenance'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      technician: 'Patrick Wamba',
      equipment_id: 'FR-2024-134',
      equipment_name: 'Système HVAC C3',
      location: 'BONABERI',
      match_score: 89,
      availability: 'Disponible demain matin',
      experience: '7 ans en HVAC',
      success_rate: 93,
      expertise: ['HVAC', 'Électrique', 'Diagnostic'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '4',
      technician: 'Olivier Kenne',
      equipment_id: 'FR-2024-156',
      equipment_name: 'Réfrigérateur Vitrine D4',
      location: 'ANGE RAPHAEL',
      match_score: 95,
      availability: 'Disponible immédiatement',
      experience: '10 ans en réfrigération',
      success_rate: 98,
      expertise: ['Réfrigération', 'Électrique', 'Mécanique'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '5',
      technician: 'Thierry Njoya',
      equipment_id: 'FR-2024-167',
      equipment_name: 'Climatiseur Central E5',
      location: 'DEÏDO',
      match_score: 91,
      availability: 'Disponible après-demain',
      experience: '7 ans en climatisation',
      success_rate: 95,
      expertise: ['Climatisation', 'Maintenance', 'Diagnostic'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];
};
