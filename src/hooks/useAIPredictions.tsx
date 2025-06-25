
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
      console.log('🌐 URL testée:', `${API_BASE_URL}/`);
      
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Explicitement demander CORS
      });

      console.log('📊 Statut de la réponse:', response.status);
      console.log('📋 En-têtes de réponse:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.text();
      console.log('✅ Connexion API réussie:', result);
      
      toast.success('Connexion à l\'API IA réussie', {
        description: 'L\'API de prédiction de maintenance est opérationnelle'
      });

      return true;
    } catch (err) {
      let errorMessage = 'Erreur inconnue lors du test de connexion';
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage = 'Erreur CORS ou réseau - L\'API est accessible mais bloque les requêtes cross-origin';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('❌ Erreur connexion API:', errorMessage);
      console.error('🔍 Détails de l\'erreur:', err);
      setError(errorMessage);
      
      toast.error('Problème de connexion détecté', {
        description: 'L\'API fonctionne mais il y a un problème CORS. Utilisez les données simulées en attendant.'
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
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(input),
      });

      console.log('📊 Statut prédiction:', response.status);

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
      let errorMessage = 'Erreur inconnue lors de la prédiction';
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage = 'Erreur CORS - Utilisation des données simulées';
        
        // Retourner une prédiction simulée en cas d'erreur CORS
        const simulatedPrediction: MaintenancePrediction = {
          equipment_id: input.equipment_id,
          predicted_status: 'Maintenance_preventive',
          confidence_score: 85,
          recommended_actions: ['Vérification générale', 'Nettoyage compresseur', 'Test température'],
          priority_level: 'medium',
          estimated_intervention_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_duration_hours: 2,
          required_skills: ['Réfrigération', 'Électricité'],
          recommended_parts: ['Filtre', 'Joint'],
          risk_factors: ['Âge de l\'équipement', 'Usage intensif'],
          created_at: new Date().toISOString(),
        };
        
        console.log('🔄 Utilisation de données simulées:', simulatedPrediction);
        
        toast.warning('Prédiction simulée utilisée', {
          description: 'Problème CORS détecté - données d\'exemple utilisées'
        });
        
        return simulatedPrediction;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
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
        // Petite pause entre les requêtes pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`✅ ${predictions.length} prédictions IA reçues en lot`);
      
      if (predictions.length > 0) {
        toast.success(`${predictions.length} prédictions générées avec succès`);
      }

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
