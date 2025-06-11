
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Zap, Clock, AlertTriangle, CheckCircle, Wrench, TrendingUp } from "lucide-react";
import { useAIPredictions, MaintenancePredictionInput, MaintenancePrediction } from '@/hooks/useAIPredictions';

export function AIPredictionPanel() {
  const { isLoading, error, getPrediction } = useAIPredictions();
  const [prediction, setPrediction] = useState<MaintenancePrediction | null>(null);
  const [formData, setFormData] = useState<MaintenancePredictionInput>({
    equipment_id: '',
    equipment_type: '',
    last_maintenance_date: '',
    failure_history: [],
    location: '',
    usage_intensity: 'medium',
    sensor_data: {
      temperature: undefined,
      pressure: undefined,
      vibration: undefined,
      humidity: undefined,
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await getPrediction(formData);
    if (result) {
      setPrediction(result);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entretien_renforce': return 'destructive';
      case 'Investigation_defaillance': return 'secondary';
      case 'Maintenance_preventive': return 'default';
      case 'Surveillance_renforcee': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entretien_renforce': return <AlertTriangle className="w-4 h-4" />;
      case 'Investigation_defaillance': return <Wrench className="w-4 h-4" />;
      case 'Maintenance_preventive': return <CheckCircle className="w-4 h-4" />;
      case 'Surveillance_renforcee': return <TrendingUp className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            🤖 Prédiction IA - Statut Post-Entretien
          </CardTitle>
          <CardDescription>
            Utilisez votre modèle IA entraîné pour prédire le statut après intervention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipment_id">ID Équipement</Label>
                <Input
                  id="equipment_id"
                  value={formData.equipment_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, equipment_id: e.target.value }))}
                  placeholder="FR-2024-001"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="equipment_type">Type d'équipement</Label>
                <Select 
                  value={formData.equipment_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, equipment_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refrigerateur">Réfrigérateur</SelectItem>
                    <SelectItem value="climatiseur">Climatiseur</SelectItem>
                    <SelectItem value="groupe_electrogene">Groupe électrogène</SelectItem>
                    <SelectItem value="ascenseur">Ascenseur</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="last_maintenance">Dernière maintenance</Label>
                <Input
                  id="last_maintenance"
                  type="date"
                  value={formData.last_maintenance_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_maintenance_date: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Agence Rabat Centre"
                  required
                />
              </div>

              <div>
                <Label htmlFor="usage_intensity">Intensité d'utilisation</Label>
                <Select 
                  value={formData.usage_intensity} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, usage_intensity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Données capteurs (optionnel) */}
            <div className="space-y-3">
              <Label>Données capteurs (optionnel)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <Label htmlFor="temperature" className="text-xs">Température (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.sensor_data?.temperature || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sensor_data: { ...prev.sensor_data, temperature: parseFloat(e.target.value) || undefined }
                    }))}
                    placeholder="25.5"
                  />
                </div>
                <div>
                  <Label htmlFor="pressure" className="text-xs">Pression (bar)</Label>
                  <Input
                    id="pressure"
                    type="number"
                    step="0.1"
                    value={formData.sensor_data?.pressure || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sensor_data: { ...prev.sensor_data, pressure: parseFloat(e.target.value) || undefined }
                    }))}
                    placeholder="1.2"
                  />
                </div>
                <div>
                  <Label htmlFor="vibration" className="text-xs">Vibration (Hz)</Label>
                  <Input
                    id="vibration"
                    type="number"
                    step="0.1"
                    value={formData.sensor_data?.vibration || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sensor_data: { ...prev.sensor_data, vibration: parseFloat(e.target.value) || undefined }
                    }))}
                    placeholder="50.0"
                  />
                </div>
                <div>
                  <Label htmlFor="humidity" className="text-xs">Humidité (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="0.1"
                    value={formData.sensor_data?.humidity || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sensor_data: { ...prev.sensor_data, humidity: parseFloat(e.target.value) || undefined }
                    }))}
                    placeholder="65.0"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  Génération de la prédiction...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Générer la prédiction IA
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">❌ {error}</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Résultats de la prédiction */}
      {prediction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Résultat de la prédiction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(prediction.predicted_status)}
                <Badge variant={getStatusColor(prediction.predicted_status)} className="text-sm">
                  {prediction.predicted_status.replace('_', ' ')}
                </Badge>
              </div>
              <Badge variant="outline">
                Confiance: {prediction.confidence_score}%
              </Badge>
              <Badge variant={getPriorityColor(prediction.priority_level)}>
                Priorité: {prediction.priority_level}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Actions recommandées:</h4>
                <ul className="text-sm space-y-1">
                  {prediction.recommended_actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Compétences requises:</h4>
                <div className="flex flex-wrap gap-1">
                  {prediction.required_skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Durée estimée: {prediction.estimated_duration_hours}h
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Intervention prévue: {new Date(prediction.estimated_intervention_date).toLocaleDateString('fr-FR')}
              </div>
            </div>

            {prediction.risk_factors.length > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-sm text-orange-800 mb-2">⚠️ Facteurs de risque identifiés:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  {prediction.risk_factors.map((risk, index) => (
                    <li key={index}>• {risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
