
export interface FailurePrediction {
  id: string;
  equipment_id: string;
  equipment_name: string;
  failure_risk: number;
  predicted_date: string;
  type: 'AF' | 'NF';
  location: string;
  recommended_action: string;
  created_at: string;
  updated_at: string;
}

export interface TechnicianRecommendation {
  id: string;
  equipment_id: string;
  equipment_name: string;
  technician: string;
  match_score: number;
  expertise: string[];
  availability: string;
  location: string;
  experience: string;
  success_rate: number;
  created_at: string;
  updated_at: string;
}
