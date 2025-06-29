
import { useState } from 'react';
import { toast } from 'sonner';
import { PredictionData, PredictionResult } from './types';

export function usePredictionApi() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async (formData: PredictionData): Promise<PredictionResult | null> => {
    setIsLoading(true);

    try {
      console.log('🤖 Envoi de la prédiction à l\'API...');
      
      const apiPayload = {
        Taux_remplissage_pct: formData.taux_remplissage_pct,
        Temperature_C: formData.temperature_c,
        Lineaire_val: formData.lineaire_val,
        Tension_V: formData.tension_v,
        Intensite_avant_entretien_A: formData.intensite_avant_entretien_a,
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
      const maxProbability = apiResult.probabilities ? 
        Math.max(...Object.values(apiResult.probabilities)) : 0.85;
      
      const result: PredictionResult = {
        predicted_status: apiResult.predicted_status || 'Succès total',
        confidence_score: Math.round(maxProbability * 100),
        risk_level: maxProbability > 0.7 ? 'Faible' : maxProbability > 0.4 ? 'Moyen' : 'Élevé',
        recommendations: [
          'Maintenance renforcée recommandée',
          'Surveillance de la température conseillée',
          'Vérification du système de refroidissement'
        ],
        probabilities: apiResult.probabilities || {}
      };

      toast.success('Prédiction IA générée avec succès');
      return result;
    } catch (error) {
      console.error('❌ Erreur lors de la prédiction:', error);
      
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

      toast.warning('API non disponible - Prédiction simulée utilisée');
      return fallbackResult;
    } finally {
      setIsLoading(false);
    }
  };

  return { handlePredict, isLoading };
}
