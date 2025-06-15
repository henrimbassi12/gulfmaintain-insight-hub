
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, Star, MapPin, BarChart, CheckSquare } from 'lucide-react';

export const TechnicianAssignmentOptimizationPanel = () => {
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
      </CardContent>
    </Card>
  );
};
