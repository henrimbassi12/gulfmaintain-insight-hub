
import { useState } from 'react';
import { toast } from 'sonner';
import { PredictionData, PredictionResult } from './types';

export function usePredictionApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (formData: PredictionData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🤖 Envoi de la prédiction à l\'API...');
      
      const apiPayload = {
        Taux_remplissage_pct: Number(formData.taux_remplissage_pct) || 0,
        Temperature_C: Number(formData.temperature_c) || 0,
        Lineaire_val: Number(formData.lineaire_val) || 0,
        Tension_V: Number(formData.tension_v) || 0,
        Intensite_avant_entretien_A: Number(formData.intensite_avant_entretien_a) || 0,
        Technicien_GFI: formData.technicien_gfi,
        Division: formData.division,
        Secteur: formData.secteur,
        Partenaire: formData.partenaire,
        Ville: formData.ville,
        Quartier: formData.quartier,
        Type_Frigo: formData.type_frigo,
        AF_NF: formData.af_nf,
        Branding: formData.branding,
        Securite: formData.securite,
        Eclairage: formData.eclairage,
        Purge_circuit_eaux: formData.purge_circuit_eaux,
        Soufflage_parties_actives: formData.soufflage_parties_actives,
        Date: formData.date
      };

      console.log('📤 Données envoyées:', apiPayload);

      const response = await fetch('https://web-production-c2b6a.up.railway.app/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      console.log('📊 Status de la réponse:', response.status);

      if (!response.ok) {
        if (response.status === 422) {
          const errorDetail = await response.json();
          console.error('❌ Erreur 422 - Données invalides:', errorDetail);
          throw new Error('Format de données invalide. Vérifiez les champs requis.');
        }
        throw new Error(`Erreur API ${response.status}: ${response.statusText}`);
      }

      const apiResult = await response.json();
      console.log('✅ Réponse de l\'API:', apiResult);

      // Calculer le score de confiance basé sur la probabilité la plus élevée
      const probabilities = apiResult.probabilities || {};
      const probabilityValues = Object.values(probabilities) as number[];
      const maxProbability = probabilityValues.length > 0 ? Math.max(...probabilityValues) : 0.85;
      
      const predictionResult: PredictionResult = {
        predicted_status: apiResult.predicted_status || 'Succès total',
        confidence_score: Math.round(maxProbability * 100),
        risk_level: maxProbability > 0.7 ? 'Faible' : maxProbability > 0.4 ? 'Moyen' : 'Élevé',
        recommendations: [
          'Maintenance renforcée recommandée',
          'Surveillance de la température conseillée',
          'Vérification du système de refroidissement'
        ],
        probabilities: probabilities
      };

      setResult(predictionResult);
      toast.success('Prédiction IA générée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la prédiction:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      
      const fallbackResult: PredictionResult = {
        predicted_status: 'Succès total (simulé)',
        confidence_score: Math.round(85 + Math.random() * 10),
        risk_level: Math.random() > 0.7 ? 'Élevé' : Math.random() > 0.4 ? 'Moyen' : 'Faible',
        recommendations: [
          'Maintenance renforcée recommandée',
          'Surveillance de la température conseillée',
          'Vérification du système de refroidissement'
        ]
      };

      setResult(fallbackResult);
      toast.warning('API non disponible - Prédiction simulée utilisée');
    } finally {
      setIsLoading(false);
    }
  };

  return { predict, isLoading, result, error };
}
