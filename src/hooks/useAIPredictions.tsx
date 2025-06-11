
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface MaintenancePredictionInput {
  equipment_id: string;
  equipment_type: string;
  last_maintenance_date: string;
  failure_history: string[];
  sensor_data?: {
    temperature?: number;
    pressure?: number;
    vibration?: number;
    humidity?: number;
  };
  location: string;
  usage_intensity: 'low' | 'medium' | 'high';
}

export interface MaintenancePrediction {
  equipment_id: string;
  predicted_status: 'Entretien_renforce' | 'Investigation_defaillance' | 'Maintenance_preventive' | 'Surveillance_renforcee';
  confidence_score: number;
  recommended_actions: string[];
  priority_level: 'low' | 'medium' | 'high' | 'critical';
  estimated_intervention_date: string;
  estimated_duration_hours: number;
  required_skills: string[];
  recommended_parts: string[];
  risk_factors: string[];
  created_at: string;
}

interface UseAIPredictionsReturn {
  isLoading: boolean;
  error: string | null;
  getPrediction: (input: MaintenancePredictionInput) => Promise<MaintenancePrediction | null>;
  getBatchPredictions: (inputs: MaintenancePredictionInput[]) => Promise<MaintenancePrediction[]>;
}

export function useAIPredictions(): UseAIPredictionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL de votre API - à configurer selon votre déploiement
  const API_BASE_URL = process.env.REACT_APP_AI_API_URL || 'http://localhost:8000';

  const getPrediction = useCallback(async (input: MaintenancePredictionInput): Promise<MaintenancePrediction | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/predict/maintenance-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AI_API_KEY || ''}`,
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const prediction = await response.json();
      
      console.log('✅ Prédiction IA reçue:', prediction);
      
      toast.success('Prédiction IA générée avec succès', {
        description: `Statut prédit: ${prediction.predicted_status} (${prediction.confidence_score}% de confiance)`
      });

      return prediction;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors de la prédiction';
      console.error('❌ Erreur prédiction IA:', errorMessage);
      setError(errorMessage);
      
      toast.error('Erreur lors de la prédiction IA', {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  const getBatchPredictions = useCallback(async (inputs: MaintenancePredictionInput[]): Promise<MaintenancePrediction[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/predict/batch-maintenance-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AI_API_KEY || ''}`,
        },
        body: JSON.stringify({ predictions: inputs }),
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const predictions = await response.json();
      
      console.log(`✅ ${predictions.length} prédictions IA reçues en lot`);
      
      toast.success(`${predictions.length} prédictions générées avec succès`);

      return predictions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors des prédictions en lot';
      console.error('❌ Erreur prédictions IA en lot:', errorMessage);
      setError(errorMessage);
      
      toast.error('Erreur lors des prédictions IA en lot', {
        description: errorMessage
      });
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  return {
    isLoading,
    error,
    getPrediction,
    getBatchPredictions,
  };
}
