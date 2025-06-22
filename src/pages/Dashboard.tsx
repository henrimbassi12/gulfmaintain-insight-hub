import React, { useState, useMemo } from 'react';
import { ModernWeatherWidget } from '@/components/dashboard/ModernWeatherWidget';
import { ModernStatsGrid } from '@/components/dashboard/ModernStatsGrid';
import { useToast } from "@/hooks/use-toast";
import TechnicianPerformance from '@/components/dashboard/TechnicianPerformance';
import RegionMap from '@/components/dashboard/RegionMap';
import EquipmentTypeBreakdown from '@/components/dashboard/EquipmentTypeBreakdown';
import AgencySummary from '@/components/dashboard/AgencySummary';
import UrgentAlerts from '@/components/dashboard/UrgentAlerts';
import TrendsChart from '@/components/dashboard/TrendsChart';
import AISummary from '@/components/dashboard/AISummary';
import QuickActions from '@/components/dashboard/QuickActions';
import { useReports } from '@/hooks/useReports';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs';
import { RecentInterventionsTable } from '@/components/dashboard/RecentInterventionsTable';
import { MaintenanceReport } from '@/types/maintenance';
import { useAuth } from '@/contexts/AuthContext';
import { Wrench, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { OfflineBanner } from '@/components/OfflineBanner';
import { useSyncNotifications } from '@/hooks/useSyncNotifications';

type ReportStatus = MaintenanceReport['status'];
type InterventionStatus = 'completed' | 'in-progress' | 'planned';

const mapReportStatusToInterventionStatus = (status: ReportStatus): InterventionStatus => {
  switch (status) {
    case 'Terminé':
      return 'completed';
    case 'En cours':
      return 'in-progress';
    case 'Planifié':
      return 'planned';
  }
};

export default function Dashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("today");
  const [refreshing, setRefreshing] = useState(false);
  const { reports, isLoading: isLoadingReports, refetch: refetchReports } = useReports();
  const { userProfile, loading: isLoadingAuth } = useAuth();

  // Hook pour les notifications de synchronisation
  useSyncNotifications();

  const kpiData = useMemo(() => {
    if (!reports) return { total: 0, inProgress: 0, completed: 0, planned: 0 };
    
    const reportsToProcess = userProfile?.role === 'technician' && userProfile?.full_name
      ? reports.filter(r => r.technician.toLowerCase() === userProfile.full_name.toLowerCase())
      : reports;

    const total = reportsToProcess.length;
    const inProgress = reportsToProcess.filter(r => r.status === 'En cours').length;
    const completed = reportsToProcess.filter(r => r.status === 'Terminé').length;
    const planned = reportsToProcess.filter(r => r.status === 'Planifié').length;

    return { total, inProgress, completed, planned };
  }, [reports, userProfile]);

  const kpiConfig = useMemo(() => {
    const isTechnician = userProfile?.role === 'technician';
    return {
      titles: {
        total: isTechnician ? "Mes interventions" : "Interventions totales",
        inProgress: "En cours",
        completed: "Terminées",
        planned: "Planifiées",
      },
      subtitles: {
        total: "Toutes périodes",
        inProgress: isTechnician ? "Vos tâches actives" : "Interventions actives",
        completed: "Avec Accord de Fin",
        planned: "À venir",
      }
    }
  }, [userProfile]);

  const recentInterventions = useMemo(() => {
    if (!reports) return [];
    
    const reportsToDisplay = userProfile?.role === 'technician' && userProfile?.full_name
      ? reports.filter(r => r.technician.toLowerCase() === userProfile.full_name.toLowerCase())
      : reports;
      
    return reportsToDisplay.slice(0, 3).map(report => ({
      id: report.report_id,
      equipment: report.equipment,
      technician: report.technician,
      type: report.type,
      status: mapReportStatusToInterventionStatus(report.status),
      duration: report.duration,
      sector: report.location
    }));
  }, [reports, userProfile]);

  const handleRefreshData = () => {
    setRefreshing(true);
    toast({
      title: "✅ Actualisation",
      description: "Mise à jour des données en cours...",
    });
    
    refetchReports().finally(() => {
      setRefreshing(false);
      toast({
        title: "Données actualisées",
        description: "Les données ont été mises à jour avec succès.",
      });
    });
  };

  const performanceStats = [
    { label: "Temps moyen", value: "2.3h", change: "-12%", isPositive: true },
    { label: "Satisfaction", value: "94%", change: "+5%", isPositive: true },
    { label: "Première fois", value: "87%", change: "+8%", isPositive: true },
    { label: "Coût moyen", value: "450€", change: "-3%", isPositive: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        handleRefreshData={handleRefreshData}
        refreshing={refreshing}
        isLoading={isLoadingReports || isLoadingAuth}
      />

      <OfflineBanner />

      <div className="p-4 md:p-6 space-y-6">
        <DashboardKPIs
          kpiData={kpiData}
          isLoading={isLoadingReports || isLoadingAuth}
          config={kpiConfig}
        />

        {/* Grille principale épurée */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ModernWeatherWidget />
          </div>

          <div className="lg:col-span-2">
            <ModernStatsGrid 
              title="Indicateurs clés"
              stats={performanceStats}
            />
          </div>
        </div>

        {/* Row 1: Performance & Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TechnicianPerformance />
          <UrgentAlerts />
        </div>

        {/* Row 2: Geographic & Equipment Analysis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <RegionMap />
          <EquipmentTypeBreakdown />
        </div>

        {/* Row 3: Agency Summary & Trends */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AgencySummary />
          <TrendsChart />
        </div>

        {/* Row 4: AI Summary & Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AISummary />
          <QuickActions />
        </div>

        <RecentInterventionsTable 
          interventions={recentInterventions}
          isLoading={isLoadingReports || isLoadingAuth}
        />
      </div>
    </div>
  );
}
