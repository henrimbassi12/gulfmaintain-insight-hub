
import { useState } from 'react';
import { toast } from 'sonner';
import { PredictionData } from './types';

interface PredictionApiResult {
  predicted_status: string;
  confidence_score: number;
  risk_level: 'Faible' | 'Moyen' | 'Élevé';
  recommendations: string[];
  probabilities?: Record<string, number>;
}

export function usePredictionApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (formData: PredictionData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🤖 Envoi de la prédiction IA:', formData);

      // Simulation d'appel API - remplacer par votre vraie API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Génération de résultat simulé
      const statuses = ['Maintenance_preventive', 'Surveillance_renforcee', 'Entretien_renforce', 'Investigation_defaillance'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const mockResult: PredictionApiResult = {
        predicted_status: randomStatus,
        confidence_score: Math.floor(Math.random() * 20) + 80,
        risk_level: ['Faible', 'Moyen', 'Élevé'][Math.floor(Math.random() * 3)] as 'Faible' | 'Moyen' | 'Élevé',
        recommendations: [
          'Vérification des composants électriques',
          'Contrôle de la température',
          'Inspection des joints d\'étanchéité',
          'Test des capteurs'
        ],
        probabilities: {
          'Maintenance_preventive': 0.45,
          'Surveillance_renforcee': 0.30,
          'Entretien_renforce': 0.15,
          'Investigation_defaillance': 0.10
        }
      };

      setResult(mockResult);
      toast.success('Prédiction IA générée avec succès !');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la prédiction';
      setError(errorMessage);
      toast.error('Erreur lors de la prédiction IA');
    } finally {
      setIsLoading(false);
    }
  };

  return { predict, isLoading, result, error };
}
