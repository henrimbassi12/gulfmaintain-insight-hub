import React, { useState } from 'react';
import { BarChart3, Package, Wrench, AlertTriangle, Activity, TrendingUp, Clock, User, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MobileHeader } from '@/components/MobileHeader';
import { DashboardCard } from '@/components/DashboardCard';
import { InterventionTrendChart } from '@/components/dashboard/InterventionTrendChart';
import { NotificationSystem } from '@/components/NotificationSystem';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { DashboardAIPredictionForm } from '@/components/dashboard/DashboardAIPredictionForm';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = userProfile?.role === 'admin';
  const isManager = userProfile?.role === 'manager';

  const handleRefreshData = async () => {
    setRefreshing(true);
    // Simuler un rafraîchissement
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Données d'exemple
  const dashboardData = {
    totalEquipments: 150,
    activeEquipments: 120,
    maintenancesPlanned: 30,
    maintenancesOverdue: 5,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <MobileHeader />
      
      {/* Header principal sans profil utilisateur */}
      <div className="hidden md:block bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40 w-full">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
                  Tableau de bord
                </h1>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                  Vue d'ensemble des maintenances{isAdmin ? ' - Administration' : isManager ? ' - Gestion' : ' - Douala'}
                </p>
              </div>
            </div>
            
            {/* Section contrôles sans profil utilisateur */}
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
              <ConnectionStatus />
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-32 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshData}
                disabled={refreshing}
                className="flex-1 sm:flex-none hover:bg-blue-50 border-gray-200"
              >
                <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Sync</span>
              </Button>
              
              <NotificationSystem />
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
        
        {/* KPIs stylés - Nouvelles cartes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Taux de réussite</p>
                <p className="text-xl font-semibold text-gray-800">92%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Urgences en cours</p>
                <p className="text-xl font-semibold text-gray-800">7</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-full flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Technicien du mois</p>
                <p className="text-xl font-semibold text-gray-800">J. Ekwalla</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Durée moyenne</p>
                <p className="text-xl font-semibold text-gray-800">42 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique des tendances */}
        <div className="mb-8">
          <InterventionTrendChart />
        </div>

        {/* Cartes statistiques originales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <DashboardCard
            title="Total Équipements"
            value={dashboardData.totalEquipments}
            subtitle="Équipements enregistrés"
            icon={Package}
            trend={{ value: 5, isPositive: true }}
            className="hover:shadow-xl transition-all duration-300"
          />
          
          <DashboardCard
            title="Équipements Actifs"
            value={dashboardData.activeEquipments}
            subtitle="En fonctionnement"
            icon={Activity}
            trend={{ value: 2, isPositive: true }}
            className="hover:shadow-xl transition-all duration-300"
          />
          
          <DashboardCard
            title="Maintenances Planifiées"
            value={dashboardData.maintenancesPlanned}
            subtitle="À venir cette semaine"
            icon={Wrench}
            trend={{ value: 8, isPositive: false }}
            className="hover:shadow-xl transition-all duration-300"
          />
          
          {(isManager || isAdmin) && (
            <DashboardCard
              title="Maintenances En Retard"
              value={dashboardData.maintenancesOverdue}
              subtitle="Nécessitent une attention"
              icon={AlertTriangle}
              trend={{ value: 12, isPositive: false }}
              className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-red-500"
            />
          )}
        </div>

        {/* Section supplémentaire pour les statistiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Maintenance terminée</span>
                <span className="text-xs text-blue-600 font-medium">Il y a 2h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Équipement ajouté</span>
                <span className="text-xs text-green-600 font-medium">Il y a 4h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm text-gray-700">Maintenance planifiée</span>
                <span className="text-xs text-yellow-600 font-medium">Il y a 6h</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques du mois</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Taux de disponibilité</span>
                  <span className="text-sm font-semibold text-green-600">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Maintenances réalisées</span>
                  <span className="text-sm font-semibold text-blue-600">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Prédiction IA - Formulaire mis à jour */}
        <div className="mt-8">
          <DashboardAIPredictionForm />
        </div>
      </div>
    </div>
  );
}
