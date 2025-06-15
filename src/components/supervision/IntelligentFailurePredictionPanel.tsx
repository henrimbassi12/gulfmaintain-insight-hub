
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Zap, History, SlidersHorizontal, AlertTriangle, ArrowRight } from 'lucide-react';
import { FailurePrediction } from '@/types/supervision';
import { Button } from '@/components/ui/button';

interface IntelligentFailurePredictionPanelProps {
  predictions: FailurePrediction[];
  onSelectPrediction: (prediction: FailurePrediction) => void;
}

export const IntelligentFailurePredictionPanel = ({ predictions, onSelectPrediction }: IntelligentFailurePredictionPanelProps) => {
  const factors = [
    { name: "Température", weight: 30, details: "Pic à 8°C identifié", icon: Thermometer, color: "text-red-500" },
    { name: "Intensité électrique", weight: 35, details: "Zones optimales 2.4-2.6A", icon: Zap, color: "text-yellow-500" },
    { name: "Historique maintenance", weight: 25, details: "", icon: History, color: "text-blue-500" },
    { name: "Utilisation", weight: 10, details: "", icon: SlidersHorizontal, color: "text-green-500" }
  ];

  return (
    <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">🧠</span>
          Prédiction de Pannes Intelligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">Algorithme composite basé sur 4 facteurs clés pour anticiper les défaillances avant qu'elles ne surviennent.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map(factor => (
            <div key={factor.name} className="p-4 border rounded-lg bg-gray-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <factor.icon className={`w-5 h-5 ${factor.color}`} />
                  <h4 className="font-semibold text-gray-800">{factor.name}</h4>
                </div>
                <Badge variant="secondary" className="font-bold">{factor.weight}%</Badge>
              </div>
              {factor.details && <p className="text-sm text-gray-500 pl-7">{factor.details}</p>}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4">Prédictions Actives à Haut Risque</h4>
          {predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.map((p) => (
                <div 
                  key={p.id} 
                  className="p-3 border rounded-lg bg-red-50/50 flex items-center justify-between transition-all duration-200 hover:bg-red-100/60 hover:shadow-sm cursor-pointer" 
                  onClick={() => onSelectPrediction(p)}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{p.equipment_name}</p>
                      <p className="text-sm text-gray-600">
                        Risque de panne à <span className="font-bold">{p.failure_risk}%</span> sur <span className="font-semibold">{p.location}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-100 h-8 w-8 -mr-1">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border">
                <p>Aucune prédiction à haut risque pour le moment.</p>
                <p className="text-xs text-gray-400 mt-1">Le système surveille activement vos équipements.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
