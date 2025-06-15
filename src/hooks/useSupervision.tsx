
import { useState, useEffect, useCallback } from 'react';
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';
import { failurePredictionSamples, technicianRecommendationSamples } from '@/data/supervision-samples';

export function useSupervision() {
  const [predictions, setPredictions] = useState<FailurePrediction[]>([]);
  const [recommendations, setRecommendations] = useState<TechnicianRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // On utilise directement les données d'exemple
      setPredictions(failurePredictionSamples);
      setRecommendations(technicianRecommendationSamples);
      
      console.log(`✅ Utilisation des données d'exemple : ${failurePredictionSamples.length} prédictions, ${technicianRecommendationSamples.length} recommandations`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données de supervision:', error);
      setError('Erreur lors de la récupération des données de supervision');
      setPredictions(failurePredictionSamples);
      setRecommendations(technicianRecommendationSamples);
      toast.info('Utilisation des données de démonstration');
    } finally {
      // On simule un petit temps de chargement
      setTimeout(() => setIsLoading(false), 300);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Les souscriptions en temps réel sont désactivées pour le moment
    /*
    const predictionsChannel = supabase
      .channel('failure_predictions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'failure_predictions'
        },
        (payload) => {
          console.log('📡 Changement détecté dans failure_predictions:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newPrediction = {
              ...payload.new,
              type: payload.new.type as 'AF' | 'NF'
            } as FailurePrediction;
            
            setPredictions(prev => [newPrediction, ...prev].sort((a, b) => b.failure_risk - a.failure_risk));
            toast.info('Nouvelle prédiction de panne');
          } else if (payload.eventType === 'UPDATE') {
            const updatedPrediction = {
              ...payload.new,
              type: payload.new.type as 'AF' | 'NF'
            } as FailurePrediction;
            
            setPredictions(prev => prev.map(prediction => 
              prediction.id === updatedPrediction.id ? updatedPrediction : prediction
            ).sort((a, b) => b.failure_risk - a.failure_risk));
          } else if (payload.eventType === 'DELETE') {
            setPredictions(prev => prev.filter(prediction => prediction.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    const recommendationsChannel = supabase
      .channel('technician_recommendations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'technician_recommendations'
        },
        (payload) => {
          console.log('📡 Changement détecté dans technician_recommendations:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newRecommendation = payload.new as TechnicianRecommendation;
            setRecommendations(prev => [newRecommendation, ...prev].sort((a, b) => b.match_score - a.match_score));
            toast.info('Nouvelle recommandation technicien');
          } else if (payload.eventType === 'UPDATE') {
            const updatedRecommendation = payload.new as TechnicianRecommendation;
            setRecommendations(prev => prev.map(recommendation => 
              recommendation.id === updatedRecommendation.id ? updatedRecommendation : recommendation
            ).sort((a, b) => b.match_score - a.match_score));
          } else if (payload.eventType === 'DELETE') {
            setRecommendations(prev => prev.filter(recommendation => recommendation.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(predictionsChannel);
      supabase.removeChannel(recommendationsChannel);
    };
    */
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    predictions,
    recommendations,
    isLoading,
    error,
    refetch,
  };
}
