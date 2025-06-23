
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ModernStatsGrid } from '@/components/dashboard/ModernStatsGrid';
import TrendsChart from '@/components/dashboard/TrendsChart';
import { RecentInterventionsTable } from '@/components/dashboard/RecentInterventionsTable';
import UrgentAlerts from '@/components/dashboard/UrgentAlerts';
import { QuickActions } from '@/components/dashboard/QuickActions';
import AISummary from '@/components/dashboard/AISummary';
import TechnicianPerformance from '@/components/dashboard/TechnicianPerformance';
import EquipmentTypeBreakdown from '@/components/dashboard/EquipmentTypeBreakdown';
import RegionMap from '@/components/dashboard/RegionMap';
import AgencySummary from '@/components/dashboard/AgencySummary';
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs';
import { ModernWeatherWidget } from '@/components/dashboard/ModernWeatherWidget';
import ManagerQuickActions from '@/components/dashboard/ManagerQuickActions';
import TechnicianQuickActions from '@/components/dashboard/TechnicianQuickActions';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('today');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useAuth();

  // Sample data for components that require props
  const statsData = [
    { label: "Interventions totales", value: "247", change: "+12%", isPositive: true },
    { label: "En cours", value: "18", change: "+5%", isPositive: true },
    { label: "Terminées", value: "229", change: "+15%", isPositive: true },
    { label: "Planifiées", value: "32", change: "-3%", isPositive: false }
  ];

  const interventionsData = [
    {
      id: "INT-001",
      equipment: "FR-2024-089",
      technician: "CÉDRIC",
      type: "Maintenance préventive",
      status: "completed" as const,
      duration: "2h 30min",
      sector: "Douala Centre"
    },
    {
      id: "INT-002", 
      equipment: "FR-2024-156",
      technician: "MBAPBOU GRÉGOIRE",
      type: "Réparation",
      status: "in-progress" as const,
      duration: "1h 45min",
      sector: "Yaoundé Nord"
    },
    {
      id: "INT-003",
      equipment: "FR-2024-203", 
      technician: "VOUKENG",
      type: "Installation",
      status: "planned" as const,
      duration: "3h 00min",
      sector: "Bamenda Centre"
    }
  ];

  const kpiData = {
    total: 247,
    inProgress: 18,
    completed: 229,
    planned: 32
  };

  const kpiConfig = {
    titles: {
      total: "Total Interventions",
      inProgress: "En cours",
      completed: "Terminées",
      planned: "Planifiées"
    },
    subtitles: {
      total: "Ce mois",
      inProgress: "Actuellement",
      completed: "Avec accord de fin",
      planned: "À venir"
    }
  };

  useEffect(() => {
    // Exemple d'appel API ou de chargement de données initial
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
        subtitle="Vue d'ensemble de votre activité par secteur - Douala"
        icon={BarChart3}
      />
      
      <DashboardHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        handleRefreshData={handleRefreshData}
        refreshing={refreshing}
        isLoading={isLoading}
      />

      <ModernStatsGrid title="Statistiques générales" stats={statsData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
        <TrendsChart />
        <RecentInterventionsTable interventions={interventionsData} isLoading={isLoading} />
      </div>

      <UrgentAlerts />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {userProfile?.role === 'manager' ? <ManagerQuickActions /> : <TechnicianQuickActions />}
        <AISummary />
        <TechnicianPerformance />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
        <EquipmentTypeBreakdown />
        <RegionMap />
      </div>

      <AgencySummary />
      <DashboardKPIs kpiData={kpiData} isLoading={isLoading} config={kpiConfig} />
      <ModernWeatherWidget />
    </AirbnbContainer>
  );
}
