
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, TrendingUp } from "lucide-react";

interface RecurrenceData {
  equipment: string;
  recurrenceRate: number;
  category: string;
  totalFailures: number;
  avgTimeBetweenFailures: number;
}

interface RecurrenceAnalysisProps {
  data: RecurrenceData[];
}

const RecurrenceAnalysis: React.FC<RecurrenceAnalysisProps> = ({ data }) => {
  const getRecurrenceColor = (rate: number) => {
    if (rate >= 40) return "destructive";
    if (rate >= 20) return "secondary";
    return "default";
  };

  const getRecurrenceBg = (rate: number) => {
    if (rate >= 40) return "bg-red-50 border-red-200";
    if (rate >= 20) return "bg-orange-50 border-orange-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-purple-500" />
          ♻️ Analyse des récurrences de pannes
        </CardTitle>
        <CardDescription>
          Équipements à problème chronique - Aide à la décision de remplacement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {data.map((item, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getRecurrenceBg(item.recurrenceRate)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium">{item.equipment}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={item.recurrenceRate} className="flex-1 max-w-xs" />
                    <span className="text-sm font-bold">{item.recurrenceRate}%</span>
                  </div>
                </div>
                <Badge variant={getRecurrenceColor(item.recurrenceRate)}>
                  {item.category}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Pannes totales:</span> {item.totalFailures}
                </div>
                <div>
                  <span className="font-medium">Intervalle moyen:</span> {item.avgTimeBetweenFailures} jours
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">Recommandation IA</span>
          </div>
          <p className="text-sm text-purple-600 mt-1">
            Les équipements avec taux de récurrence supérieur à 40% nécessitent une évaluation pour remplacement
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecurrenceAnalysis;
