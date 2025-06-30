
export interface FailurePrediction {
  id: string;
  equipment_id: string;
  equipment_name: string;
  equipment_brand?: string;
  equipment_model?: string;
  equipment_serial_number?: string;
  failure_risk: number;
  predicted_date: string;
  type: 'AF' | 'NF';
  location: string;
  recommended_action: string;
  maintenance_history?: any;
  environmental_factors?: any;
  usage_pattern?: string;
  confidence_score?: number;
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
  phone?: string;
  email?: string;
  certification_level?: string;
  specialization?: string[];
  current_workload?: number;
  rating?: number;
  last_assignment_date?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  agency?: string;
  specialization?: string[];
  certification_level?: string;
  experience_years?: number;
  current_location?: string;
  availability_status?: string;
  last_login?: string;
  notification_preferences?: any;
  phone?: string;
  avatar_url?: string;
  account_status?: string;
  created_at: string;
  updated_at: string;
}
