
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FailurePrediction, TechnicianRecommendation } from '@/types/supervision';
import { generateSamplePredictions, generateSampleRecommendations } from '@/data/supervision-samples';

export function useSupervision() {
  const [predictions, setPredictions] = useState<FailurePrediction[]>([]);
  const [recommendations, setRecommendations] = useState<TechnicianRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [predictionsResult, recommendationsResult] = await Promise.all([
        supabase
          .from('failure_predictions')
          .select('*')
          .order('failure_risk', { ascending: false }),
        supabase
          .from('technician_recommendations')
          .select('*')
          .order('match_score', { ascending: false })
      ]);

      if (predictionsResult.error) {
        console.warn('Erreur prédictions:', predictionsResult.error);
        // Utiliser les données d'exemple en cas d'erreur
        setPredictions(generateSamplePredictions());
      } else if (predictionsResult.data && predictionsResult.data.length > 0) {
        const typedPredictions = predictionsResult.data.map(item => ({
          ...item,
          type: item.type as 'AF' | 'NF'
        })) as FailurePrediction[];
        setPredictions(typedPredictions);
      } else {
        // Aucune donnée en base, utiliser les exemples
        setPredictions(generateSamplePredictions());
      }

      if (recommendationsResult.error) {
        console.warn('Erreur recommandations:', recommendationsResult.error);
        // Utiliser les données d'exemple en cas d'erreur
        setRecommendations(generateSampleRecommendations());
      } else if (recommendationsResult.data && recommendationsResult.data.length > 0) {
        const typedRecommendations = recommendationsResult.data as TechnicianRecommendation[];
        setRecommendations(typedRecommendations);
      } else {
        // Aucune donnée en base, utiliser les exemples
        setRecommendations(generateSampleRecommendations());
      }
      
      console.log(`✅ Récupération supervision: ${predictions.length} prédictions, ${recommendations.length} recommandations`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données de supervision:', error);
      setError('Erreur lors de la récupération des données de supervision');
      // En cas d'erreur, utiliser les données d'exemple
      setPredictions(generateSamplePredictions());
      setRecommendations(generateSampleRecommendations());
      toast.info('Utilisation des données de démonstration');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
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
