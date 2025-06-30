
import React, { useState } from 'react';
import { GeolocationSystem } from '@/components/GeolocationSystem';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, RefreshCw, Activity } from 'lucide-react';
import { MobileHeader } from '@/components/MobileHeader';
import { toast } from 'sonner';

export default function GeolocationPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation des positions...',
        success: 'Positions actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MobileHeader />
      
      {/* Header desktop uniquement - style référence Messages */}
      <div className="hidden md:block">
        <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 sticky top-0 z-40 w-full">
          <div className="w-full px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                    Géolocalisation
                  </h1>
                  <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">
                    Suivi en temps réel des équipements et techniciens
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="hover:bg-purple-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Header mobile avec boutons d'action */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Géolocalisation</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Suivi temps réel</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Statistiques de géolocalisation */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm w-full">
          <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 pb-3">
            <CardTitle className="flex items-center gap-3 text-base">
              <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Suivi en temps réel
              <Badge variant="secondary" className="ml-auto text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700">
                Actif
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">24</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Techniciens connectés</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400 mb-1">156</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Équipements localisés</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-lg md:text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">8</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Interventions en cours</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">95%</p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Précision GPS</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Système de géolocalisation - sections empilées verticalement */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm w-full">
          <CardContent className="p-4">
            <GeolocationSystem />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
