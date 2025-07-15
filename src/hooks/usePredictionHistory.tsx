import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenancePrediction } from './useAIPredictions';

// Interface pour les prédictions sauvegardées dans la base de données
export interface PredictionHistoryItem {
  id: string;
  equipment_id: string;
  equipment_name: string;
  predicted_status: MaintenancePrediction['predicted_status'];
  confidence_score: number;
  recommended_actions: string[];
  priority_level: string;
  estimated_intervention_date: string;
  estimated_duration_hours: number;
  required_skills: string[];
  recommended_parts: string[];
  risk_factors: string[];
  created_at: string;
  updated_at: string;
  location: string;
  type: string;
  equipment_brand?: string;
  equipment_model?: string;
  equipment_serial_number?: string;
  maintenance_history?: any;
  environmental_factors?: any;
  usage_pattern?: string;
  failure_risk: number;
}

export function usePredictionHistory() {
  const [predictions, setPredictions] = useState<PredictionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('failure_predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Mapper les données de la base vers notre interface
      const mappedPredictions: PredictionHistoryItem[] = (data || []).map(item => {
        const predictedStatus = mapDbStatusToAppStatus(item.predicted_date, item.failure_risk);
        const maintenanceInstructions = getMaintenanceInstructions(predictedStatus);
        
        return {
          id: item.id,
          equipment_id: item.equipment_id,
          equipment_name: item.equipment_name,
          predicted_status: predictedStatus,
          confidence_score: item.confidence_score || 75,
          recommended_actions: maintenanceInstructions,
          priority_level: item.failure_risk > 80 ? 'critical' : item.failure_risk > 60 ? 'high' : item.failure_risk > 40 ? 'medium' : 'low',
          estimated_intervention_date: item.predicted_date,
          estimated_duration_hours: predictedStatus === 'Investigation_defaillance' ? 4 : 
                                   predictedStatus === 'Entretien_renforce' ? 3 :
                                   predictedStatus === 'Maintenance_preventive' ? 2 : 1,
          required_skills: predictedStatus === 'Investigation_defaillance' ? ['Diagnostic avancé', 'Réparation', 'Électricité', 'Réfrigération'] :
                          predictedStatus === 'Entretien_renforce' ? ['Maintenance avancée', 'Réfrigération', 'Mécanique'] :
                          predictedStatus === 'Maintenance_preventive' ? ['Maintenance standard', 'Nettoyage', 'Vérifications'] :
                          ['Surveillance', 'Inspection visuelle'],
          recommended_parts: predictedStatus === 'Investigation_defaillance' ? ['Compresseur', 'Capteurs', 'Joints'] :
                            predictedStatus === 'Entretien_renforce' ? ['Pièces d\'usure', 'Filtres', 'Joints'] :
                            predictedStatus === 'Maintenance_preventive' ? ['Filtres', 'Huile', 'Joints'] :
                            [],
          risk_factors: [`Risque de panne: ${item.failure_risk}%`, `Type: ${item.type}`, `Localisation: ${item.location}`],
          created_at: item.created_at,
          updated_at: item.updated_at,
          location: item.location,
          type: item.type,
          equipment_brand: item.equipment_brand,
          equipment_model: item.equipment_model,
          equipment_serial_number: item.equipment_serial_number,
          maintenance_history: item.maintenance_history,
          environmental_factors: item.environmental_factors,
          usage_pattern: item.usage_pattern,
          failure_risk: item.failure_risk
        };
      });

      setPredictions(mappedPredictions);
      console.log(`✅ Récupération de ${mappedPredictions.length} prédictions réussie`);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des prédictions:', error);
      setError('Erreur lors de la récupération des prédictions');
      toast.error('Erreur lors de la récupération des prédictions', {
        description: 'Vérifiez votre connexion et réessayez'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mapper le statut de la base de données vers le statut de l'application avec consignes
  const mapDbStatusToAppStatus = (predictedDate: string, failureRisk: number): MaintenancePrediction['predicted_status'] => {
    const daysUntilPrediction = Math.ceil((new Date(predictedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    if (failureRisk > 80) {
      return 'Investigation_defaillance';
    } else if (failureRisk > 60) {
      return 'Entretien_renforce';
    } else if (daysUntilPrediction <= 7) {
      return 'Surveillance_renforcee';
    } else {
      return 'Maintenance_preventive';
    }
  };

  // Obtenir les consignes spécifiques pour chaque type de maintenance
  const getMaintenanceInstructions = (status: MaintenancePrediction['predicted_status']): string[] => {
    switch (status) {
      case 'Investigation_defaillance':
        return [
          'Réaliser un diagnostic approfondi',
          'Tester les composants critiques (compresseur, capteurs)',
          'Remplacer si nécessaire'
        ];
      case 'Maintenance_preventive':
        return [
          'Appliquer la check-list standard',
          'Nettoyage complet de l\'équipement',
          'Resserrage des connexions',
          'Vérification des fluides'
        ];
      case 'Entretien_renforce':
        return [
          'Réaliser un entretien plus complet',
          'Remplacement systématique des pièces d\'usure',
          'Contrôle approfondi de tous les composants'
        ];
      case 'Surveillance_renforcee':
        return [
          'Aucune action immédiate nécessaire',
          'Inscrire l\'équipement pour un suivi lors des prochaines visites',
          'Surveiller les indicateurs de performance'
        ];
      default:
        return ['Suivre les procédures standards de maintenance'];
    }
  };

  const savePrediction = useCallback(async (prediction: MaintenancePrediction) => {
    try {
      const { data, error } = await supabase
        .from('failure_predictions')
        .insert([{
          equipment_id: prediction.equipment_id,
          equipment_name: prediction.equipment_id, // Utiliser l'ID comme nom pour l'instant
          predicted_date: prediction.estimated_intervention_date,
          failure_risk: prediction.confidence_score,
          recommended_action: prediction.recommended_actions.join(', '),
          type: 'Prédiction IA',
          location: 'Douala', // Valeur par défaut
          confidence_score: prediction.confidence_score,
          equipment_brand: null,
          equipment_model: null,
          equipment_serial_number: null,
          maintenance_history: null,
          environmental_factors: null,
          usage_pattern: null
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Ajouter la nouvelle prédiction à la liste
      const predictedStatus = mapDbStatusToAppStatus(data.predicted_date, data.failure_risk);
      const maintenanceInstructions = getMaintenanceInstructions(predictedStatus);
      
      const newPrediction: PredictionHistoryItem = {
        id: data.id,
        equipment_id: data.equipment_id,
        equipment_name: data.equipment_name,
        predicted_status: predictedStatus,
        confidence_score: data.confidence_score || 75,
        recommended_actions: maintenanceInstructions,
        priority_level: data.failure_risk > 80 ? 'critical' : data.failure_risk > 60 ? 'high' : data.failure_risk > 40 ? 'medium' : 'low',
        estimated_intervention_date: data.predicted_date,
        estimated_duration_hours: predictedStatus === 'Investigation_defaillance' ? 4 : 
                                 predictedStatus === 'Entretien_renforce' ? 3 :
                                 predictedStatus === 'Maintenance_preventive' ? 2 : 1,
        required_skills: predictedStatus === 'Investigation_defaillance' ? ['Diagnostic avancé', 'Réparation', 'Électricité', 'Réfrigération'] :
                        predictedStatus === 'Entretien_renforce' ? ['Maintenance avancée', 'Réfrigération', 'Mécanique'] :
                        predictedStatus === 'Maintenance_preventive' ? ['Maintenance standard', 'Nettoyage', 'Vérifications'] :
                        ['Surveillance', 'Inspection visuelle'],
        recommended_parts: predictedStatus === 'Investigation_defaillance' ? ['Compresseur', 'Capteurs', 'Joints'] :
                          predictedStatus === 'Entretien_renforce' ? ['Pièces d\'usure', 'Filtres', 'Joints'] :
                          predictedStatus === 'Maintenance_preventive' ? ['Filtres', 'Huile', 'Joints'] :
                          [],
        risk_factors: [`Risque de panne: ${data.failure_risk}%`, `Type: ${data.type}`, `Localisation: ${data.location}`],
        created_at: data.created_at,
        updated_at: data.updated_at,
        location: data.location,
        type: data.type,
        equipment_brand: data.equipment_brand,
        equipment_model: data.equipment_model,
        equipment_serial_number: data.equipment_serial_number,
        maintenance_history: data.maintenance_history,
        environmental_factors: data.environmental_factors,
        usage_pattern: data.usage_pattern,
        failure_risk: data.failure_risk
      };

      setPredictions(prev => [newPrediction, ...prev]);
      toast.success('Prédiction sauvegardée dans l\'historique');
      return newPrediction;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la prédiction:', error);
      toast.error('Erreur lors de la sauvegarde de la prédiction');
      throw error;
    }
  }, []);

  const deletePrediction = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('failure_predictions')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPredictions(prev => prev.filter(prediction => prediction.id !== id));
      toast.success('Prédiction supprimée de l\'historique');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la prédiction:', error);
      toast.error('Erreur lors de la suppression de la prédiction');
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchPredictions();

    // Set up real-time subscription
    const channel = supabase
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
            // Refetch to get the new prediction properly formatted
            fetchPredictions();
          } else if (payload.eventType === 'DELETE') {
            setPredictions(prev => prev.filter(prediction => prediction.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPredictions]);

  const refetch = useCallback(() => {
    return fetchPredictions();
  }, [fetchPredictions]);

  return {
    predictions,
    isLoading,
    error,
    refetch,
    savePrediction,
    deletePrediction,
  };
}