
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { AIAnalysisModal } from './AIAnalysisModal';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AISummary: React.FC = () => {
  const { toast: showToast } = useToast();
  const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);
  const navigate = useNavigate();

  const aiInsights = [
    {
      type: "prediction",
      icon: Target,
      title: "Prédiction de panne",
      content: "3 équipements à risque élevé dans les 48h",
      confidence: 89,
      priority: "high",
      details: "Analyse basée sur les données de température, vibrations et historique de maintenance. Équipements concernés: FR-2024-089, FR-2024-156, FR-2024-203"
    },
    {
      type: "optimization",
      icon: TrendingUp,
      title: "Optimisation des tournées",
      content: "Économie possible de 23% sur les déplacements",
      confidence: 76,
      priority: "medium",
      details: "Regroupement intelligent des interventions par secteur géographique et optimisation des trajets basée sur l'algorithme de Dijkstra"
    },
    {
      type: "recommendation",
      icon: Lightbulb,
      title: "Recommandation maintenance",
      content: "Programmer maintenance préventive pour 8 équipements",
      confidence: 94,
      priority: "high",
      details: "Maintenance préventive recommandée basée sur l'analyse prédictive des pannes et l'optimisation des coûts de maintenance"
    }
  ];

  const handleApplyRecommendation = (type: string, title: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Application de la recommandation "${title}"...`,
        success: `Recommandation "${title}" appliquée avec succès !`,
        error: 'Erreur lors de l\'application de la recommandation'
      }
    );
    
    // Rediriger vers la page Supervision après application
    setTimeout(() => {
      navigate('/supervision');
      toast.success('Redirection vers la section Prédiction');
    }, 2500);
  };

  const handleViewDetails = (insight: any) => {
    showToast({
      title: `📊 Détails - ${insight.title}`,
      description: insight.details,
      duration: 5000,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <div>
                <CardTitle>Résumé IA</CardTitle>
                <CardDescription>Insights et recommandations intelligentes</CardDescription>
              </div>
            </div>
          </div>
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
                        onClick={() => handleViewDetails(insight)}
                        className="text-xs"
                      >
                        Détails
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApplyRecommendation(insight.type, insight.title)}
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
