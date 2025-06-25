
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

  const API_BASE_URL = 'https://web-production-c2b6a.up.railway.app';

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Test de connexion à l\'API IA...');
      console.log('🌐 URL testée:', `${API_BASE_URL}/`);
      
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
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
        errorMessage = 'Erreur réseau - Impossible de joindre l\'API';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.error('❌ Erreur connexion API:', errorMessage);
      console.error('🔍 Détails de l\'erreur:', err);
      setError(errorMessage);
      
      toast.error('Problème de connexion détecté', {
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

      // Format des données pour l'API
      const apiPayload = {
        equipment_id: input.equipment_id,
        equipment_type: input.equipment_type,
        last_maintenance_date: input.last_maintenance_date,
        failure_history: input.failure_history.join(', '),
        sensor_data: input.sensor_data || {},
        location: input.location,
        usage_intensity: input.usage_intensity
      };

      console.log('📤 Payload envoyé à l\'API:', apiPayload);

      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      console.log('📊 Statut prédiction:', response.status);
      console.log('📋 En-têtes réponse:', Object.fromEntries(response.headers.entries()));

      if (response.status === 422) {
        // Erreur de validation - récupérer les détails
        const errorDetails = await response.json();
        console.error('❌ Erreur 422 - Format de données invalide:', errorDetails);
        
        toast.error('Format de données invalide', {
          description: 'L\'API a rejeté les données. Utilisation de données simulées.'
        });
        
        // Générer une prédiction simulée
        return generateSimulatedPrediction(input);
      }

      if (!response.ok) {
        throw new Error(`Erreur API ${response.status}: ${response.statusText}`);
      }

      const prediction = await response.json();
      
      console.log('✅ Prédiction IA reçue:', prediction);
      
      toast.success('Prédiction IA générée avec succès', {
        description: `Statut prédit: ${prediction.predicted_status} (${prediction.confidence_score}% de confiance)`
      });

      return prediction;
    } catch (err) {
      let errorMessage = 'Erreur lors de la prédiction';
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        errorMessage = 'Erreur réseau - Utilisation des données simulées';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      console.log('🔄 Génération de prédiction simulée suite à l\'erreur:', errorMessage);
      
      toast.warning('Prédiction simulée utilisée', {
        description: 'Impossible de contacter l\'API - Données d\'exemple utilisées'
      });
      
      return generateSimulatedPrediction(input);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateSimulatedPrediction = (input: MaintenancePredictionInput): MaintenancePrediction => {
    const statuses: MaintenancePrediction['predicted_status'][] = [
      'Maintenance_preventive', 'Surveillance_renforcee', 'Entretien_renforce', 'Investigation_defaillance'
    ];
    
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      equipment_id: input.equipment_id,
      predicted_status: randomStatus,
      confidence_score: Math.floor(Math.random() * 20) + 75, // 75-95%
      recommended_actions: [
        'Vérification générale des composants',
        `Inspection ${input.equipment_type.toLowerCase()}`,
        'Test des capteurs de température',
        'Nettoyage des filtres',
        'Contrôle de l\'étanchéité'
      ],
      priority_level: input.usage_intensity === 'high' ? 'medium' : 'low',
      estimated_intervention_date: new Date(Date.now() + (Math.random() * 14 + 1) * 24 * 60 * 60 * 1000).toISOString(),
      estimated_duration_hours: Math.floor(Math.random() * 4) + 1,
      required_skills: ['Réfrigération', 'Électricité', 'Diagnostic', 'Maintenance préventive'],
      recommended_parts: ['Filtre à air', 'Joint d\'étanchéité', 'Capteur température', 'Fluide réfrigérant'],
      risk_factors: [
        `Localisation: ${input.location}`,
        `Usage ${input.usage_intensity}`,
        'Historique de pannes',
        'Conditions environnementales'
      ],
      created_at: new Date().toISOString(),
    };
  };

  const getBatchPredictions = useCallback(async (inputs: MaintenancePredictionInput[]): Promise<MaintenancePrediction[]> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`🤖 Demande de ${inputs.length} prédictions IA en lot`);

      const predictions: MaintenancePrediction[] = [];
      
      for (const input of inputs) {
        const prediction = await getPrediction(input);
        if (prediction) {
          predictions.push(prediction);
        }
        // Petite pause entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 200));
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
