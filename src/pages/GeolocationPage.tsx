
import React, { useState } from 'react';
import { GeolocationSystem } from '@/components/GeolocationSystem';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, RefreshCw, Activity } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Header stylé comme le Dashboard */}
      <div className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 sticky top-0 z-40 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                  Géolocalisation
                </h1>
                <p className="text-gray-500 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
                  Suivi en temps réel des équipements et techniciens
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none hover:bg-blue-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
              >
                <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Sync</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
        {/* Statistiques de géolocalisation */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="flex items-center gap-3 text-lg text-gray-900 dark:text-white">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Suivi en temps réel
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                Actif
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">24</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Techniciens connectés</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">156</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Équipements localisés</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">8</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Interventions en cours</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">95%</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Précision GPS</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte de géolocalisation */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <GeolocationSystem />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
