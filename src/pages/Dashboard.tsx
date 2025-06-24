import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { KPISection } from '@/components/dashboard/KPISection';
import { InterventionTrendChart } from '@/components/dashboard/InterventionTrendChart';
import { UpcomingInterventions } from '@/components/dashboard/UpcomingInterventions';
import { ActiveAlerts } from '@/components/dashboard/ActiveAlerts';
import { AIPredictionBlock } from '@/components/dashboard/AIPredictionBlock';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { NotificationSystem } from '@/components/NotificationSystem';
import { BarChart3, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth();

  useEffect(() => {
    handleRefreshData();
  }, [timeRange]);

  const handleRefreshData = async () => {
    setIsLoading(true);
    setRefreshing(true);
    
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Données du tableau de bord actualisées !');
    setIsLoading(false);
    setRefreshing(false);
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble des maintenances – Douala"
        icon={BarChart3}
      >
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
          
          <ModernButton 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={refreshing || isLoading}
            icon={RefreshCw}
            className={refreshing || isLoading ? 'animate-spin' : ''}
          >
            <span className="hidden sm:inline">Actualiser</span>
            <span className="sm:hidden">Sync</span>
          </ModernButton>
          
          <NotificationSystem />
        </div>
      </AirbnbHeader>

      {/* Section KPIs stylés GulfMaintain */}
      <KPISection />

      {/* Graphique de tendances des interventions */}
      <InterventionTrendChart />

      {/* Widgets opérationnels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpcomingInterventions />
        <ActiveAlerts />
      </div>

      {/* Bloc IA prédictif */}
      <AIPredictionBlock />
    </AirbnbContainer>
  );
}
