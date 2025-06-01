
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Star, Clock } from "lucide-react";

interface TechnicianRecommendation {
  equipmentId: string;
  equipmentName: string;
  technician: string;
  matchScore: number;
  expertise: string[];
  availability: string;
  location: string;
  experience: string;
  successRate: number;
}

interface TechnicianRecommendationsProps {
  recommendations: TechnicianRecommendation[];
}

const TechnicianRecommendations: React.FC<TechnicianRecommendationsProps> = ({ recommendations }) => {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          🤖 Technicien recommandé par IA
        </CardTitle>
        <CardDescription>
          Attribution intelligente basée sur l'historique, proximité et spécialité
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {recommendations.map((rec) => (
            <div key={rec.equipmentId} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-blue-900">{rec.technician}</h3>
                  <p className="text-sm text-blue-700">Pour: {rec.equipmentName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">Score IA: {rec.matchScore}%</span>
                    <span className="text-sm text-blue-600">• Taux réussite: {rec.successRate}%</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white">
                  <Clock className="w-3 h-3 mr-1" />
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
                  <p className="text-sm font-medium text-blue-900 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Localisation
                  </p>
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
  );
};

export default TechnicianRecommendations;
