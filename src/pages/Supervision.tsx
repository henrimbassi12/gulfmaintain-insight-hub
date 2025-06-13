
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, RefreshCw, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { toast } from 'sonner';
import { AIPredictionPanel } from '@/components/supervision/AIPredictionPanel';
import { SupervisionFilters } from '@/components/supervision/SupervisionFilters';

export default function Supervision() {
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    agency: 'all',
    technician: 'all',
    equipment: 'all',
    priority: 'all'
  });

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation de la supervision...',
        success: 'Données de supervision actualisées',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Supervision</h1>
                  <p className="text-sm text-gray-500">Surveillance intelligente et prédictions IA</p>
                </div>
                <ConnectionStatus />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none hover:bg-blue-50 border-gray-200"
              >
                <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Sync</span>
              </Button>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Nouvelle alerte</span>
                <span className="sm:hidden">Alerte</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Métriques de supervision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Alertes actives</p>
                  <p className="text-2xl font-bold text-red-600">12</p>
                </div>
                <div className="p-3 rounded-xl bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Prédictions IA</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Équipements surveillés</p>
                  <p className="text-2xl font-bold text-green-600">247</p>
                </div>
                <div className="p-3 rounded-xl bg-green-50">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Taux de précision</p>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres de supervision */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Filtres de supervision
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <SupervisionFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </CardContent>
        </Card>

        {/* Panneau IA */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <AIPredictionPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
