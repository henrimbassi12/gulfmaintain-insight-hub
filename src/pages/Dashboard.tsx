
import React from 'react';
import { Package, Wrench, AlertTriangle, Activity, TrendingUp, Clock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import { DashboardCard } from '@/components/DashboardCard';
import { InterventionTrendChart } from '@/components/dashboard/InterventionTrendChart';
import { DashboardAIPredictionForm } from '@/components/dashboard/DashboardAIPredictionForm';

export default function Dashboard() {
  const { userProfile } = useAuth();

  const isAdmin = userProfile?.role === 'admin';
  const isManager = userProfile?.role === 'manager';

  // Données d'exemple
  const dashboardData = {
    totalEquipments: 150,
    activeEquipments: 120,
    maintenancesPlanned: 30,
    maintenancesOverdue: 5,
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      
      {/* Contenu principal */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
        
        {/* KPIs stylés - Nouvelles cartes avec couleurs améliorées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-3 rounded-full flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Taux de réussite</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">92%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-full flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Urgences en cours</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">7</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 p-3 rounded-full flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Technicien du mois</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">J. Ekwalla</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 p-3 rounded-full flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-300 font-medium">Durée moyenne</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">42 min</p>
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">Activité récente</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance terminée</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Il y a 2h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Équipement ajouté</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Il y a 4h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance planifiée</span>
                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Il y a 6h</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">Statistiques du mois</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Taux de disponibilité</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">94%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Maintenances réalisées</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">78%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
