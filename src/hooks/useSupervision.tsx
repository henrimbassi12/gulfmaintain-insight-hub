
import { useState, useEffect, useCallback } from 'react';
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

// Noms d'agences cohérents avec les autres pages
const AGENCY_LOCATIONS = [
  'Agence Douala Centre',
  'Agence Douala Nord',
  'Agence Yaoundé Centre',
  'Agence Yaoundé Nord',
  'Agence Bamenda',
  'Agence Bafoussam',
  'Agence Garoua',
  'Agence Maroua'
];

// Données d'exemple avec noms cohérents
const generateSamplePredictions = (): FailurePrediction[] => {
  return [
    {
      id: '1',
      equipment_id: 'FR-2024-089',
      equipment_name: 'Réfrigérateur Commercial A1',
      failure_risk: 85,
      type: 'AF',
      location: 'Agence Douala Centre',
      predicted_date: '2024-02-15',
      recommended_action: 'Maintenance préventive immédiate',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      equipment_id: 'FR-2024-012',
      equipment_name: 'Climatiseur Bureau B2',
      failure_risk: 72,
      type: 'NF',
      location: 'Agence Yaoundé Centre',
      predicted_date: '2024-02-22',
      recommended_action: 'Inspection programmée',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      equipment_id: 'FR-2024-134',
      equipment_name: 'Système HVAC C3',
      failure_risk: 68,
      type: 'AF',
      location: 'Agence Bamenda',
      predicted_date: '2024-03-01',
      recommended_action: 'Surveillance renforcée',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '4',
      equipment_id: 'FR-2024-156',
      equipment_name: 'Réfrigérateur Vitrine D4',
      failure_risk: 79,
      type: 'AF',
      location: 'Agence Douala Nord',
      predicted_date: '2024-02-18',
      recommended_action: 'Remplacement du compresseur',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '5',
      equipment_id: 'FR-2024-167',
      equipment_name: 'Climatiseur Central E5',
      failure_risk: 63,
      type: 'NF',
      location: 'Agence Bafoussam',
      predicted_date: '2024-03-05',
      recommended_action: 'Nettoyage des filtres',
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];
};

const generateSampleRecommendations = (): TechnicianRecommendation[] => {
  return [
    {
      id: '1',
      technician: 'CÉDRIC',
      equipment_id: 'FR-2024-089',
      equipment_name: 'Réfrigérateur Commercial A1',
      location: 'Agence Douala Centre',
      match_score: 92,
      availability: 'Disponible demain',
      experience: '8 ans en réfrigération',
      success_rate: 96,
      expertise: ['Réfrigération', 'Climatisation', 'Électrique'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      technician: 'MBAPBOU GRÉGOIRE',
      equipment_id: 'FR-2024-012',
      equipment_name: 'Climatiseur Bureau B2',
      location: 'Agence Yaoundé Centre',
      match_score: 87,
      availability: 'Disponible aujourd\'hui',
      experience: '6 ans en HVAC',
      success_rate: 94,
      expertise: ['Climatisation', 'Ventilation', 'Maintenance'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      technician: 'VOUKENG',
      equipment_id: 'FR-2024-134',
      equipment_name: 'Système HVAC C3',
      location: 'Agence Bamenda',
      match_score: 89,
      availability: 'Disponible demain matin',
      experience: '7 ans en HVAC',
      success_rate: 93,
      expertise: ['HVAC', 'Électrique', 'Diagnostic'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '4',
      technician: 'TCHINDA CONSTANT',
      equipment_id: 'FR-2024-156',
      equipment_name: 'Réfrigérateur Vitrine D4',
      location: 'Agence Douala Nord',
      match_score: 95,
      availability: 'Disponible immédiatement',
      experience: '10 ans en réfrigération',
      success_rate: 98,
      expertise: ['Réfrigération', 'Électrique', 'Mécanique'],
      created_at: '2024-01-20T10:00:00Z',
      updated_at: '2024-01-20T10:00:00Z'
    }
  ];
};

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
