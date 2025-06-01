
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Calendar, MapPin, Wrench } from "lucide-react";

interface Prediction {
  id: string;
  name: string;
  failureRisk: number;
  predictedDate: string;
  type: string;
  location: string;
  recommendedAction: string;
}

interface PredictionsListProps {
  predictions: Prediction[];
  sortBy: string;
  setSortBy: (value: string) => void;
}

const PredictionsList: React.FC<PredictionsListProps> = ({ predictions, sortBy, setSortBy }) => {
  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "text-red-600 bg-red-50 border-red-200";
    if (risk >= 60) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  };

  const getRiskBadge = (risk: number) => {
    if (risk >= 80) return { color: "🔴", variant: "destructive" as const };
    if (risk >= 60) return { color: "🔶", variant: "secondary" as const };
    return { color: "🟢", variant: "default" as const };
  };

  const sortedPredictions = [...predictions].sort((a, b) => {
    switch (sortBy) {
      case 'risk':
        return b.failureRisk - a.failureRisk;
      case 'date':
        return new Date(a.predictedDate).getTime() - new Date(b.predictedDate).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          🔮 Prédictions de pannes à venir
        </CardTitle>
        <CardDescription>
          Équipements avec score de risque élevé - Actions préventives recommandées
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-600">Trier par:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="risk">Risque</option>
            <option value="date">Date prédite</option>
            <option value="name">Nom</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {sortedPredictions.map((prediction) => {
            const riskBadge = getRiskBadge(prediction.failureRisk);
            return (
              <div
                key={prediction.id}
                className={`p-4 rounded-lg border ${getRiskColor(prediction.failureRisk)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {riskBadge.color} {prediction.name}
                    </h3>
                    <p className="text-sm opacity-75 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {prediction.location}
                    </p>
                  </div>
                  <Badge variant={prediction.type === "AF" ? "destructive" : "secondary"}>
                    {prediction.type}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-sm font-medium">Probabilité de panne</p>
                    <div className="flex items-center gap-2">
                      <Progress value={prediction.failureRisk} className="flex-1" />
                      <span className="text-sm font-bold">{prediction.failureRisk}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Date prédite
                    </p>
                    <p className="text-sm">{prediction.predictedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Wrench className="w-3 h-3" />
                      Action recommandée
                    </p>
                    <p className="text-sm">{prediction.recommendedAction}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionsList;
