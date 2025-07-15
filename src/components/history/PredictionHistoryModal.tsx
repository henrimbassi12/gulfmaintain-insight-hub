import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, Clock, User, MapPin, AlertTriangle, CheckCircle, Wrench, TrendingUp } from 'lucide-react';
import { MaintenancePrediction } from '@/hooks/useAIPredictions';

interface PredictionHistoryModalProps {
  prediction: MaintenancePrediction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PredictionHistoryModal({ prediction, isOpen, onClose }: PredictionHistoryModalProps) {
  if (!prediction) return null;

  const getStatusIcon = (status: MaintenancePrediction['predicted_status']) => {
    switch (status) {
      case 'Maintenance_preventive':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Surveillance_renforcee':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'Entretien_renforce':
        return <Wrench className="w-5 h-5 text-orange-600" />;
      case 'Investigation_defaillance':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      default:
        return <Brain className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: MaintenancePrediction['predicted_status']) => {
    switch (status) {
      case 'Maintenance_preventive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Surveillance_renforcee':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Entretien_renforce':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Investigation_defaillance':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: MaintenancePrediction['predicted_status']) => {
    switch (status) {
      case 'Maintenance_preventive':
        return 'Maintenance Préventive';
      case 'Surveillance_renforcee':
        return 'Surveillance Renforcée';
      case 'Entretien_renforce':
        return 'Entretien Renforcé';
      case 'Investigation_defaillance':
        return 'Investigation Défaillance';
      default:
        return status;
    }
  };

  const getStatusDescription = (status: MaintenancePrediction['predicted_status']) => {
    switch (status) {
      case 'Investigation_defaillance':
        return 'Diagnostic approfondi nécessaire - Intervention critique requise';
      case 'Entretien_renforce':
        return 'Maintenance complète recommandée - Remplacement préventif des pièces';
      case 'Maintenance_preventive':
        return 'Maintenance standard selon planning - Check-list habituelle';
      case 'Surveillance_renforcee':
        return 'Surveillance accrue lors des prochaines visites - Pas d\'action immédiate';
      default:
        return 'Maintenance selon procédures standards';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            Prédiction IA - Équipement {prediction.equipment_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {getStatusIcon(prediction.predicted_status)}
                Analyse Prédictive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Statut Prédit</label>
                    <div className="mt-1 space-y-2">
                      <Badge className={`${getStatusColor(prediction.predicted_status)} text-sm`}>
                        {getStatusLabel(prediction.predicted_status)}
                      </Badge>
                      <p className="text-xs text-gray-600 italic">
                        {getStatusDescription(prediction.predicted_status)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Niveau de Confiance</label>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${prediction.confidence_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{prediction.confidence_score}%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Priorité</label>
                    <div className="mt-1">
                      <Badge className={`${getPriorityColor(prediction.priority_level)} text-sm capitalize`}>
                        {prediction.priority_level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Date d'Intervention Estimée
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(prediction.estimated_intervention_date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Durée Estimée
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{prediction.estimated_duration_hours}h</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Date de Création
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(prediction.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions recommandées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="w-5 h-5 text-blue-600" />
                Consignes de Maintenance - {getStatusLabel(prediction.predicted_status)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prediction.recommended_actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-blue-900">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Compétences et pièces */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-5 h-5 text-green-600" />
                  Compétences Requises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {prediction.required_skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wrench className="w-5 h-5 text-orange-600" />
                  Pièces Recommandées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {prediction.recommended_parts.map((part, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      {part}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Facteurs de risque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Facteurs de Risque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {prediction.risk_factors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-900">{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}