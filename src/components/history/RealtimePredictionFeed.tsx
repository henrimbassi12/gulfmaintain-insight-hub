import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Brain, Zap, Clock, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RealtimePrediction {
  id: string;
  equipment_name: string;
  equipment_id: string;
  predicted_status: string;
  confidence_score: number;
  priority_level: string;
  location: string;
  created_at: string;
  estimated_intervention_date: string;
  failure_risk: number;
  recommended_actions: string[];
  isNew?: boolean;
}

export function RealtimePredictionFeed() {
  const [realtimePredictions, setRealtimePredictions] = useState<RealtimePrediction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newPredictionCount, setNewPredictionCount] = useState(0);

  useEffect(() => {
    // Charger les prédictions récentes au démarrage
    loadRecentPredictions();

    // Configurer l'écoute en temps réel
    const channel = supabase
      .channel('realtime-predictions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'failure_predictions'
        },
        handleNewPrediction
      )
      .subscribe((status) => {
        console.log('Statut de connexion temps réel:', status);
        setIsConnected(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          toast.success('🔴 Connexion temps réel activée', {
            description: 'Vous recevrez les nouvelles prédictions instantanément',
            duration: 3000
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadRecentPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('failure_predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Erreur lors du chargement des prédictions:', error);
        return;
      }

      if (data) {
        setRealtimePredictions(data.map(pred => ({
          id: pred.id,
          equipment_name: pred.equipment_name,
          equipment_id: pred.equipment_id,
          predicted_status: pred.recommended_action || 'Maintenance_preventive',
          confidence_score: pred.confidence_score || 0,
          priority_level: 'moyenne', // valeur par défaut
          location: pred.location,
          created_at: pred.created_at,
          estimated_intervention_date: pred.predicted_date,
          failure_risk: pred.failure_risk,
          recommended_actions: Array.isArray(pred.recommended_action) 
            ? pred.recommended_action 
            : [pred.recommended_action || 'Maintenance préventive']
        })));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleNewPrediction = (payload: any) => {
    const newPrediction: RealtimePrediction = {
      id: payload.new.id,
      equipment_name: payload.new.equipment_name,
      equipment_id: payload.new.equipment_id,
      predicted_status: payload.new.recommended_action || 'Maintenance_preventive',
      confidence_score: payload.new.confidence_score || 0,
      priority_level: 'moyenne',
      location: payload.new.location,
      created_at: payload.new.created_at,
      estimated_intervention_date: payload.new.predicted_date,
      failure_risk: payload.new.failure_risk,
      recommended_actions: Array.isArray(payload.new.recommended_action) 
        ? payload.new.recommended_action 
        : [payload.new.recommended_action || 'Maintenance préventive'],
      isNew: true
    };

    setRealtimePredictions(prev => [newPrediction, ...prev.slice(0, 4)]);
    setNewPredictionCount(prev => prev + 1);

    // Notification toast avec animation
    toast.success('🤖 Nouvelle prédiction IA !', {
      description: `${newPrediction.equipment_name} - ${newPrediction.predicted_status.replace(/_/g, ' ')}`,
      duration: 5000,
      action: {
        label: "Voir",
        onClick: () => scrollToPrediction(newPrediction.id)
      }
    });

    // Retirer le marqueur "nouveau" après 10 secondes
    setTimeout(() => {
      setRealtimePredictions(prev => 
        prev.map(pred => 
          pred.id === newPrediction.id 
            ? { ...pred, isNew: false }
            : pred
        )
      );
    }, 10000);
  };

  const scrollToPrediction = (predictionId: string) => {
    const element = document.getElementById(`prediction-${predictionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-50');
      }, 3000);
    }
  };

  const clearNewCount = () => {
    setNewPredictionCount(0);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgente':
      case 'haute':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible':
      case 'basse':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgente':
      case 'haute':
        return <AlertTriangle className="w-3 h-3" />;
      case 'moyenne':
        return <Clock className="w-3 h-3" />;
      case 'faible':
      case 'basse':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600';
    if (risk >= 60) return 'text-orange-600';
    if (risk >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              {isConnected && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
              )}
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
              Prédictions IA en Temps Réel
            </span>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {newPredictionCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearNewCount}
                className="relative animate-bounce"
              >
                <Bell className="w-4 h-4 mr-1" />
                {newPredictionCount} nouvelle{newPredictionCount > 1 ? 's' : ''}
              </Button>
            )}
            
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                {isConnected ? 'Connecté' : 'Déconnecté'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {realtimePredictions.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 mx-auto mb-4 text-purple-300 animate-pulse" />
            <h3 className="text-lg font-medium mb-2 text-gray-700">En attente de prédictions...</h3>
            <p className="text-sm text-gray-500">Les nouvelles prédictions IA apparaîtront ici automatiquement</p>
          </div>
        ) : (
          <div className="space-y-3">
            {realtimePredictions.map((prediction, index) => (
              <div
                key={prediction.id}
                id={`prediction-${prediction.id}`}
                className={`
                  relative p-4 rounded-xl border-l-4 transition-all duration-500 transform
                  ${prediction.isNew 
                    ? 'border-l-purple-500 bg-white shadow-lg animate-slide-in-right ring-2 ring-purple-200' 
                    : 'border-l-blue-400 bg-white/70 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                {/* Badge "Nouveau" */}
                {prediction.isNew && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Nouveau
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* En-tête */}
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <h4 className="font-semibold text-gray-900 truncate">
                        {prediction.equipment_name}
                      </h4>
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        {prediction.equipment_id}
                      </Badge>
                    </div>

                    {/* Statut et métrique */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${getPriorityColor(prediction.priority_level)}`}>
                            {getPriorityIcon(prediction.priority_level)}
                            {prediction.priority_level}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          <strong>Statut:</strong> {prediction.predicted_status.replace(/_/g, ' ')}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-blue-600" />
                          <span className="text-xs font-medium text-gray-700">
                            Confiance: {prediction.confidence_score}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          <strong>Risque:</strong> 
                          <span className={`font-medium ml-1 ${getRiskColor(prediction.failure_risk)}`}>
                            {prediction.failure_risk}%
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Informations détaillées */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>Lieu:</strong> {prediction.location}</p>
                      <p><strong>Intervention prévue:</strong> {new Date(prediction.estimated_intervention_date).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Actions:</strong> {prediction.recommended_actions.join(', ')}</p>
                    </div>
                  </div>

                  {/* Indicateur temporel */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {new Date(prediction.created_at).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      {new Date(prediction.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Barre de progression pour le risque */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        prediction.failure_risk >= 80 ? 'bg-red-500' :
                        prediction.failure_risk >= 60 ? 'bg-orange-500' :
                        prediction.failure_risk >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${prediction.failure_risk}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}