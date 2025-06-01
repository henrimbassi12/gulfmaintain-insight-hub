
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Brain, AlertTriangle, User, RotateCcw, TrendingUp, Calendar, MapPin, Wrench } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Supervision = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [predictionType, setPredictionType] = useState<string>("failure");

  // Mock data for AI predictions
  const failurePredictions = [
    {
      id: "EQ-001",
      name: "Climatiseur Bureau A1",
      failureRisk: 85,
      predictedDate: "2024-01-15",
      type: "AF",
      location: "Bâtiment A - Étage 1",
      recommendedAction: "Maintenance préventive urgente"
    },
    {
      id: "EQ-045",
      name: "Groupe électrogène Principal",
      failureRisk: 72,
      predictedDate: "2024-01-22",
      type: "NF",
      location: "Sous-sol technique",
      recommendedAction: "Inspection des filtres"
    },
    {
      id: "EQ-023",
      name: "Ascenseur Tour B",
      failureRisk: 68,
      predictedDate: "2024-01-28",
      type: "AF",
      location: "Tour B - Tous étages",
      recommendedAction: "Vérification câblage"
    }
  ];

  const technicianRecommendations = [
    {
      equipmentId: "EQ-001",
      technician: "Ahmed Ben Ali",
      matchScore: 94,
      expertise: ["Climatisation", "Réfrigération"],
      availability: "Disponible",
      location: "Tunis Centre",
      experience: "8 ans"
    },
    {
      equipmentId: "EQ-045",
      technician: "Fatma Trabelsi",
      matchScore: 89,
      expertise: ["Électricité", "Groupes électrogènes"],
      availability: "Disponible demain",
      location: "Tunis Nord",
      experience: "12 ans"
    },
    {
      equipmentId: "EQ-023",
      technician: "Mohamed Khelifi",
      matchScore: 91,
      expertise: ["Ascenseurs", "Mécanique"],
      availability: "Disponible",
      location: "Tunis Centre",
      experience: "15 ans"
    }
  ];

  const recurrenceData = [
    { equipment: "Climatiseur Bureau A1", recurrenceRate: 23, category: "Élevée" },
    { equipment: "Imprimante Laser HP", recurrenceRate: 8, category: "Faible" },
    { equipment: "Projecteur Salle 201", recurrenceRate: 45, category: "Très élevée" },
    { equipment: "Photocopieur Canon", recurrenceRate: 15, category: "Modérée" }
  ];

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "text-red-600 bg-red-50 border-red-200";
    if (risk >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const getRecurrenceColor = (rate: number) => {
    if (rate >= 40) return "destructive";
    if (rate >= 20) return "secondary";
    return "default";
  };

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supervision IA</h1>
          <p className="text-gray-600">Décisions assistées par intelligence artificielle</p>
        </div>
      </div>

      {/* Prédiction de pannes */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            🔮 Prédiction de panne (AF/NF)
          </CardTitle>
          <CardDescription>
            Analyse prédictive des équipements à risque de panne
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {failurePredictions.map((prediction) => (
              <div
                key={prediction.id}
                className={`p-4 rounded-lg border ${getRiskColor(prediction.failureRisk)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{prediction.name}</h3>
                    <p className="text-sm opacity-75">{prediction.location}</p>
                  </div>
                  <Badge variant={prediction.type === "AF" ? "destructive" : "secondary"}>
                    {prediction.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium">Risque de panne</p>
                    <div className="flex items-center gap-2">
                      <Progress value={prediction.failureRisk} className="flex-1" />
                      <span className="text-sm font-bold">{prediction.failureRisk}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date prédite</p>
                    <p className="text-sm">{prediction.predictedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Action recommandée</p>
                    <p className="text-sm">{prediction.recommendedAction}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandation technicien */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            🤖 Recommandation du technicien le plus adapté
          </CardTitle>
          <CardDescription>
            IA recommande le meilleur technicien pour chaque intervention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {technicianRecommendations.map((rec) => (
              <div key={rec.equipmentId} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-blue-900">{rec.technician}</h3>
                    <p className="text-sm text-blue-700">Score de compatibilité: {rec.matchScore}%</p>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {rec.availability}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Expertise</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Localisation</p>
                    <p className="text-sm text-blue-700">{rec.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Expérience</p>
                    <p className="text-sm text-blue-700">{rec.experience}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Taux de récurrence */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-purple-500" />
            ♻️ Taux de récurrence d'un équipement
          </CardTitle>
          <CardDescription>
            Analyse des pannes récurrentes par équipement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {recurrenceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.equipment}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={item.recurrenceRate} className="flex-1 max-w-xs" />
                    <span className="text-sm text-gray-600">{item.recurrenceRate}%</span>
                  </div>
                </div>
                <Badge variant={getRecurrenceColor(item.recurrenceRate)}>
                  {item.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Données historiques */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            🔍 Données historiques techniques analysées
          </CardTitle>
          <CardDescription>
            Analyse des tendances et patterns de maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">1,247</h3>
              <p className="text-sm text-green-700">Interventions analysées</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">89%</h3>
              <p className="text-sm text-blue-700">Précision prédictive</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-600">156</h3>
              <p className="text-sm text-purple-700">Équipements surveillés</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Supervision;
