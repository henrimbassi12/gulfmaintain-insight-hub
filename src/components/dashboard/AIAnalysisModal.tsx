
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Activity } from "lucide-react";

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAnalysisModal({ isOpen, onClose }: AIAnalysisModalProps) {
  const analyses = [
    {
      id: 1,
      type: "prediction",
      icon: Target,
      title: "Prédiction de pannes équipements",
      description: "Analyse prédictive basée sur l'historique et les patterns",
      confidence: 92,
      priority: "high",
      results: "15 équipements à risque identifiés",
      status: "completed"
    },
    {
      id: 2,
      type: "optimization",
      icon: TrendingUp,
      title: "Optimisation des ressources",
      description: "Recommandations pour améliorer l'efficacité opérationnelle",
      confidence: 87,
      priority: "medium",
      results: "Économie potentielle de 23% identifiée",
      status: "completed"
    },
    {
      id: 3,
      type: "maintenance",
      icon: Activity,
      title: "Planification maintenance préventive",
      description: "Suggestion de planning optimal basé sur l'IA",
      confidence: 94,
      priority: "high",
      results: "12 interventions préventives recommandées",
      status: "in-progress"
    },
    {
      id: 4,
      type: "anomaly",
      icon: AlertTriangle,
      title: "Détection d'anomalies",
      description: "Identification de comportements anormaux",
      confidence: 78,
      priority: "medium",
      results: "3 anomalies détectées nécessitant attention",
      status: "pending"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            Toutes les analyses IA
          </DialogTitle>
          <DialogDescription>
            Vue complète des analyses et recommandations générées par l'intelligence artificielle
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyses.map((analysis) => {
            const IconComponent = analysis.icon;
            return (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-purple-500" />
                      <div>
                        <CardTitle className="text-sm">{analysis.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {analysis.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={analysis.priority === 'high' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {analysis.priority === 'high' ? 'Haute' : 'Moyenne'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Niveau de confiance</span>
                      <span className="font-medium">{analysis.confidence}%</span>
                    </div>
                    <Progress value={analysis.confidence} className="h-2" />
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500">Résultats:</span>
                    <p className="text-sm font-medium mt-1">{analysis.results}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Badge 
                      variant={
                        analysis.status === 'completed' ? 'default' :
                        analysis.status === 'in-progress' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {analysis.status === 'completed' ? 'Terminé' :
                       analysis.status === 'in-progress' ? 'En cours' : 'En attente'}
                    </Badge>
                    
                    <Button variant="outline" size="sm" className="text-xs">
                      Voir détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button>
            Exporter analyses
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
