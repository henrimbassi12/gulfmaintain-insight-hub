
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, MapPin, Star, Clock, Wrench, Award } from "lucide-react";
import { TechnicianRecommendation } from '@/hooks/useSupervision';

interface TechnicianRecommendationsProps {
  recommendations: TechnicianRecommendation[];
  filters: {
    region: string;
    riskLevel: string;
    equipmentType: string;
    timeframe: string;
  };
}

export const TechnicianRecommendations: React.FC<TechnicianRecommendationsProps> = ({ 
  recommendations, 
  filters 
}) => {
  const getMatchColor = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 70) return "secondary";
    return "outline";
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes("Disponible")) return "default";
    return "secondary";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
            Recommandations de techniciens IA
          </CardTitle>
          <CardDescription className="text-sm">
            Assignation optimale basée sur l'expertise, la localisation et la disponibilité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:gap-4">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 mb-2">
                      <h3 className="font-semibold text-base md:text-lg">{recommendation.technician}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={getMatchColor(recommendation.match_score)} className="text-xs">
                          Match: {recommendation.match_score}%
                        </Badge>
                        <Badge variant={getAvailabilityColor(recommendation.availability)} className="text-xs">
                          {recommendation.availability}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate">{recommendation.equipment_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate">{recommendation.location}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Award className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700">Expérience</p>
                          <p className="text-xs md:text-sm truncate">{recommendation.experience}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700">Taux de réussite</p>
                          <p className="text-xs md:text-sm">{recommendation.success_rate}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <div className="flex flex-wrap gap-1">
                        {recommendation.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 md:ml-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none text-xs">
                      Assigner
                    </Button>
                    <Button size="sm" variant="ghost" className="flex-1 md:flex-none text-xs">
                      Voir profil
                    </Button>
                  </div>
                </div>

                {/* Barre de progression du match */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Score de compatibilité</span>
                    <span>{recommendation.match_score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        recommendation.match_score >= 90 ? 'bg-green-500' :
                        recommendation.match_score >= 70 ? 'bg-blue-500' : 
                        'bg-gray-500'
                      }`}
                      style={{ width: `${recommendation.match_score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {recommendations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm md:text-base">Aucune recommandation disponible pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
