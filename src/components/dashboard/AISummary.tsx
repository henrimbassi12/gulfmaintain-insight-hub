
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { AIAnalysisModal } from './AIAnalysisModal';

const AISummary: React.FC = () => {
  const { toast } = useToast();
  const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);

  const aiInsights = [
    {
      type: "prediction",
      icon: Target,
      title: "Prédiction de panne",
      content: "3 équipements à risque élevé dans les 48h",
      confidence: 89,
      priority: "high"
    },
    {
      type: "optimization",
      icon: TrendingUp,
      title: "Optimisation des tournées",
      content: "Économie possible de 23% sur les déplacements",
      confidence: 76,
      priority: "medium"
    },
    {
      type: "recommendation",
      icon: Lightbulb,
      title: "Recommandation maintenance",
      content: "Programmer maintenance préventive pour 8 équipements",
      confidence: 94,
      priority: "high"
    }
  ];

  const handleApplyRecommendation = (type: string) => {
    toast({
      title: "Recommandation appliquée",
      description: `Application de la recommandation ${type}`,
    });
  };

  const handleViewDetails = (type: string) => {
    toast({
      title: "Détails IA",
      description: `Ouverture des détails de l'analyse ${type}`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Résumé IA
          </CardTitle>
          <CardDescription>Insights et recommandations intelligentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <IconComponent className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.content}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={insight.priority === 'high' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {insight.priority === 'high' ? 'Priorité haute' : 'Priorité moyenne'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Confiance:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full" 
                            style={{ width: `${insight.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{insight.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(insight.type)}
                        className="text-xs"
                      >
                        Détails
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApplyRecommendation(insight.type)}
                        className="text-xs"
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t text-center">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAIAnalysisModal(true)}
            >
              <Brain className="w-4 h-4 mr-2" />
              Voir toutes les analyses IA
            </Button>
          </div>
        </CardContent>
      </Card>

      <AIAnalysisModal
        isOpen={showAIAnalysisModal}
        onClose={() => setShowAIAnalysisModal(false)}
      />
    </>
  );
};

export default AISummary;
