
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
  testConnection: () => Promise<boolean>;
}

export function useAIPredictions(): UseAIPredictionsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL de votre API Railway
  const API_BASE_URL = 'https://web-production-c2b6a.up.railway.app';

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Test de connexion à l\'API IA...');
      
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const result = await response.text();
      console.log('✅ Connexion API réussie:', result);
      
      toast.success('Connexion à l\'API IA réussie', {
        description: 'L\'API de prédiction de maintenance est opérationnelle'
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue lors du test de connexion';
      console.error('❌ Erreur connexion API:', errorMessage);
      setError(errorMessage);
      
      toast.error('Erreur de connexion à l\'API IA', {
        description: errorMessage
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPrediction = useCallback(async (input: MaintenancePredictionInput): Promise<MaintenancePrediction | null> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🤖 Demande de prédiction IA:', input);

      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
  }, []);

  const getBatchPredictions = useCallback(async (inputs: MaintenancePredictionInput[]): Promise<MaintenancePrediction[]> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`🤖 Demande de ${inputs.length} prédictions IA en lot`);

      // Pour les prédictions en lot, on fait plusieurs appels individuels
      const predictions: MaintenancePrediction[] = [];
      
      for (const input of inputs) {
        const prediction = await getPrediction(input);
        if (prediction) {
          predictions.push(prediction);
        }
      }
      
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
  }, [getPrediction]);

  return {
    isLoading,
    error,
    getPrediction,
    getBatchPredictions,
    testConnection,
  };
}
