
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FailurePrediction {
  id: string;
  equipment_id: string;
  equipment_name: string;
  failure_risk: number;
  predicted_date: string;
  type: 'AF' | 'NF';
  location: string;
  recommended_action: string;
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
  created_at: string;
  updated_at: string;
}

export function useSupervision() {
  const [predictions, setPredictions] = useState<FailurePrediction[]>([]);
  const [recommendations, setRecommendations] = useState<TechnicianRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
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
        throw predictionsResult.error;
      }
      if (recommendationsResult.error) {
        throw recommendationsResult.error;
      }

      // Type assertions to ensure proper typing
      const typedPredictions = (predictionsResult.data || []).map(item => ({
        ...item,
        type: item.type as 'AF' | 'NF'
      })) as FailurePrediction[];

      const typedRecommendations = (recommendationsResult.data || []) as TechnicianRecommendation[];

      setPredictions(typedPredictions);
      setRecommendations(typedRecommendations);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de supervision:', error);
      toast.error('Erreur lors de la récupération des données de supervision');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    predictions,
    recommendations,
    isLoading,
    refetch,
  };
}
