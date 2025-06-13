
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Route, Clock, TrendingUp, Zap } from "lucide-react";

interface RouteOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RouteOptimizationModal({ isOpen, onClose }: RouteOptimizationModalProps) {
  const { toast } = useToast();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  const currentRoutes = [
    {
      technician: "Ahmed Benali",
      interventions: 4,
      estimatedTime: "6h 30min",
      distance: "89 km",
      efficiency: 72
    },
    {
      technician: "Fatima Zahra", 
      interventions: 3,
      estimatedTime: "5h 15min",
      distance: "67 km",
      efficiency: 85
    },
    {
      technician: "Mohamed Alami",
      interventions: 2,
      estimatedTime: "4h 45min",
      distance: "125 km",
      efficiency: 58
    }
  ];

  const optimizedRoutes = [
    {
      technician: "Ahmed Benali",
      interventions: 4,
      estimatedTime: "5h 45min",
      distance: "72 km",
      efficiency: 89,
      improvement: "+17%"
    },
    {
      technician: "Fatima Zahra",
      interventions: 3,
      estimatedTime: "4h 30min",
      distance: "54 km",
      efficiency: 92,
      improvement: "+7%"
    },
    {
      technician: "Mohamed Alami",
      interventions: 2,
      estimatedTime: "3h 20min",
      distance: "78 km",
      efficiency: 84,
      improvement: "+26%"
    }
  ];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    
    toast({
      title: "🚀 Optimisation lancée",
      description: "Calcul des itinéraires optimaux en cours...",
    });

    // Simulation de l'optimisation
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationComplete(true);
      toast({
        title: "✅ Optimisation terminée",
        description: "Nouveaux itinéraires calculés avec succès",
      });
    }, 3000);
  };

  const handleApplyOptimization = () => {
    toast({
      title: "✅ Itinéraires appliqués",
      description: "Les nouveaux itinéraires ont été envoyés aux techniciens",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Route className="w-5 h-5 text-indigo-500" />
            Optimisation des tournées
          </DialogTitle>
          <DialogDescription>
            Optimisez les itinéraires des techniciens pour réduire les temps de déplacement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé des gains */}
          {optimizationComplete && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Gains d'optimisation</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">23%</div>
                  <div className="text-green-700">Temps économisé</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">31 km</div>
                  <div className="text-green-700">Distance réduite</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">€156</div>
                  <div className="text-green-700">Économie carburant</div>
                </div>
              </div>
            </div>
          )}

          {/* Comparaison des itinéraires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Itinéraires actuels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Itinéraires actuels</CardTitle>
                <CardDescription>Tournées en cours aujourd'hui</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentRoutes.map((route, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{route.technician}</span>
                      <Badge variant="outline">{route.interventions} interventions</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {route.distance}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Efficacité</span>
                        <span>{route.efficiency}%</span>
                      </div>
                      <Progress value={route.efficiency} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Itinéraires optimisés */}
            <Card className={optimizationComplete ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Itinéraires optimisés
                  {optimizationComplete && <Zap className="w-4 h-4 text-green-600" />}
                </CardTitle>
                <CardDescription>
                  {optimizationComplete ? 'Nouveaux itinéraires calculés' : 'Sera disponible après optimisation'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {optimizationComplete ? (
                  optimizedRoutes.map((route, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{route.technician}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{route.interventions} interventions</Badge>
                          <Badge className="bg-green-100 text-green-800">{route.improvement}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {route.estimatedTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {route.distance}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Efficacité</span>
                          <span>{route.efficiency}%</span>
                        </div>
                        <Progress value={route.efficiency} className="h-2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Route className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Cliquez sur "Optimiser" pour calculer les nouveaux itinéraires</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Indicateur de progression */}
          {isOptimizing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin">
                  <Route className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-800">Optimisation en cours...</p>
                  <p className="text-sm text-blue-600">Analyse des contraintes et calcul des meilleurs itinéraires</p>
                </div>
              </div>
              <Progress value={75} className="mt-3 h-2" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          {!optimizationComplete && (
            <Button onClick={handleOptimize} disabled={isOptimizing}>
              {isOptimizing ? 'Optimisation...' : 'Optimiser les tournées'}
            </Button>
          )}
          {optimizationComplete && (
            <Button onClick={handleApplyOptimization} className="bg-green-600 hover:bg-green-700">
              Appliquer les nouveaux itinéraires
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
