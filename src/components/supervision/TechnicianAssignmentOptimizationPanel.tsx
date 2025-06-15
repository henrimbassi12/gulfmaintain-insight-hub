
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, Star, MapPin, BarChart, CheckSquare, User, ArrowRight } from 'lucide-react';
import { TechnicianRecommendation } from '@/types/supervision';
import { Button } from '@/components/ui/button';

interface TechnicianAssignmentOptimizationPanelProps {
  technicians: TechnicianRecommendation[];
  onSelectTechnician: (technician: TechnicianRecommendation) => void;
}


export const TechnicianAssignmentOptimizationPanel = ({ technicians, onSelectTechnician }: TechnicianAssignmentOptimizationPanelProps) => {
  const criteria = [
    { name: "Spécialité", icon: CheckSquare },
    { name: "Disponibilité", icon: Clock },
    { name: "Expérience", icon: Star },
    { name: "Localisation", icon: MapPin },
  ];

  return (
    <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">👥</span>
          Optimisation d'Affectation des Techniciens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-6">Algorithme de matching multi-critères pour assigner le technicien le plus adapté à chaque intervention.</p>
        
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Score composite basé sur :</h4>
          <div className="flex flex-wrap gap-3">
            {criteria.map(criterion => (
              <Badge key={criterion.name} variant="outline" className="py-1 px-3 text-sm">
                <criterion.icon className="w-4 h-4 mr-2" />
                {criterion.name}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Prédictions additionnelles :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg bg-gray-50/50 flex items-center gap-3">
              <BarChart className="w-5 h-5 text-indigo-500" />
              <div>
                <h5 className="font-medium">Durée de l'intervention</h5>
                <p className="text-sm text-gray-500">Estimation du temps nécessaire.</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-gray-50/50 flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <h5 className="font-medium">Taux de succès</h5>
                <p className="text-sm text-gray-500">Probabilité de résolution au premier passage.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4">Affectations Recommandées</h4>
          {technicians.length > 0 ? (
            <div className="space-y-3">
              {technicians.map((t) => (
                <div 
                  key={t.id} 
                  className="p-3 border rounded-lg bg-indigo-50/50 flex items-center justify-between transition-all duration-200 hover:bg-indigo-100/60 hover:shadow-sm cursor-pointer"
                  onClick={() => onSelectTechnician(t)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full flex-shrink-0">
                        <User className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">{t.technician}</p>
                      <p className="text-sm text-gray-600">
                        Score : <span className="font-bold">{t.match_score}%</span> pour <span className="font-semibold">{t.equipment_name}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 h-8 w-8 -mr-1">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg border">
                <p>Aucune recommandation de technicien disponible.</p>
                <p className="text-xs text-gray-400 mt-1">Le système analysera les besoins pour les prochaines interventions.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
