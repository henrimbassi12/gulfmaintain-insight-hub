import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaintenancePrediction } from './useAIPredictions';
import { useOfflineStorage } from './useOfflineStorage';
import { v4 as uuidv4 } from 'uuid';

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
  const { isOnline, saveOfflineData, syncOfflineData, hasOfflineData } = useOfflineStorage('predictions');

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
          confidence_score: item.confidence_score ? Math.round(item.confidence_score * 10) : 75,
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
    const predictionData = {
      equipment_id: prediction.equipment_id,
      equipment_name: prediction.equipment_id,
      predicted_date: prediction.estimated_intervention_date,
      failure_risk: prediction.confidence_score,
      recommended_action: prediction.recommended_actions.join(', '),
      type: 'Prédictive',
      location: 'Douala',
      confidence_score: prediction.confidence_score / 100, // Convert to decimal for DB
      equipment_brand: null,
      equipment_model: null,
      equipment_serial_number: null,
      maintenance_history: null,
      environmental_factors: null,
      usage_pattern: null
    };

    if (isOnline) {
      try {
        const { data, error } = await supabase
          .from('failure_predictions')
          .insert([predictionData])
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
          confidence_score: data.confidence_score ? Math.round(data.confidence_score * 100) : 75,
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
    } else {
      const tempId = uuidv4();
      const predictedStatus = mapDbStatusToAppStatus(predictionData.predicted_date, predictionData.failure_risk);
      const maintenanceInstructions = getMaintenanceInstructions(predictedStatus);
      
      const tempPrediction: PredictionHistoryItem = {
        id: tempId,
        equipment_id: predictionData.equipment_id,
        equipment_name: predictionData.equipment_name,
        predicted_status: predictedStatus,
        confidence_score: predictionData.failure_risk,
        recommended_actions: maintenanceInstructions,
        priority_level: predictionData.failure_risk > 80 ? 'critical' : predictionData.failure_risk > 60 ? 'high' : predictionData.failure_risk > 40 ? 'medium' : 'low',
        estimated_intervention_date: predictionData.predicted_date,
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
        risk_factors: [`Risque de panne: ${predictionData.failure_risk}%`, `Type: ${predictionData.type}`, `Localisation: ${predictionData.location}`],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        location: predictionData.location,
        type: predictionData.type,
        equipment_brand: predictionData.equipment_brand,
        equipment_model: predictionData.equipment_model,
        equipment_serial_number: predictionData.equipment_serial_number,
        maintenance_history: predictionData.maintenance_history,
        environmental_factors: predictionData.environmental_factors,
        usage_pattern: predictionData.usage_pattern,
        failure_risk: predictionData.failure_risk
      };

      setPredictions(prev => [tempPrediction, ...prev]);
      saveOfflineData({ action: 'CREATE', payload: predictionData, tempId }, tempId);
      toast.info('Mode hors ligne: Prédiction sauvegardée', {
        description: 'Elle sera synchronisée une fois la connexion rétablie.'
      });
      return tempPrediction;
    }
  }, [isOnline, saveOfflineData]);

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

  // Sync effect for offline predictions
  useEffect(() => {
    if (isOnline && hasOfflineData) {
      toast.loading('Synchronisation des prédictions en cours...');
      
      syncOfflineData(async (item) => {
        try {
          const { action, payload, tempId } = item;
          console.log(`📡 Synchronisation de l'action ${action} pour la prédiction ${tempId}`);

          if (action === 'CREATE') {
            const { data, error } = await supabase
              .from('failure_predictions')
              .insert([payload])
              .select()
              .single();
            
            if (error) throw error;
            
            const predictedStatus = mapDbStatusToAppStatus(data.predicted_date, data.failure_risk);
            const maintenanceInstructions = getMaintenanceInstructions(predictedStatus);
            
            const newPrediction: PredictionHistoryItem = {
              id: data.id,
              equipment_id: data.equipment_id,
              equipment_name: data.equipment_name,
              predicted_status: predictedStatus,
              confidence_score: data.confidence_score ? Math.round(data.confidence_score * 100) : 75,
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
            
            setPredictions(prev => {
              const filteredPrev = prev.filter(p => p.id !== tempId);
              return [newPrediction, ...filteredPrev];
            });
          }
          
          return true; // Succès -> retire de la file d'attente
        } catch (error) {
          console.error(`❌ Erreur de synchronisation pour ${item.tempId}:`, error);
          return false; // Échec -> reste dans la file
        }
      }).then(results => {
        const successes = Object.values(results).filter(r => r).length;
        const failures = Object.values(results).length - successes;
        
        toast.dismiss();

        if (successes > 0) {
          toast.success(`${successes} prédiction(s) synchronisée(s) avec succès !`);
          refetch(); // Re-fetch all data to ensure consistency
        }
        if (failures > 0) {
          toast.error(`${failures} prédiction(s) n'ont pas pu être synchronisées.`);
        }
      });
    }
  }, [isOnline, hasOfflineData, syncOfflineData]);

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