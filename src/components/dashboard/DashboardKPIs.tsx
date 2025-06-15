
import React from 'react';
import { ModernKPICard } from '@/components/dashboard/ModernKPICard';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Wrench, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface KpiData {
  total: number;
  inProgress: number;
  completed: number;
  planned: number;
}

interface DashboardKPIsProps {
  kpiData: KpiData;
  isLoading: boolean;
  config: {
    titles: {
      total: string;
      inProgress: string;
      completed: string;
      planned: string;
    };
    subtitles: {
      total: string;
      inProgress: string;
      completed: string;
      planned: string;
    };
  };
}

export function DashboardKPIs({ kpiData, isLoading, config }: DashboardKPIsProps) {
  const { toast } = useToast();

  const handleInterventionsClick = () => toast({ title: "✅ Navigation", description: "Redirection vers la page Maintenance..." });
  const handleActiveInterventionsClick = () => toast({ title: "✅ Interventions actives", description: "Affichage des interventions en cours..." });
  const handleCompletedClick = () => toast({ title: "✅ AF Terminées", description: "Affichage des interventions avec Accord de Fin..." });
  const handleNonClosedClick = () => toast({ title: "✅ NF Terminées", description: "Affichage des pannes Non-Fermées à surveiller..." });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ModernKPICard
        title={config.titles.total}
        value={isLoading ? <Skeleton className="h-8 w-20" /> : kpiData.total}
        subtitle={config.subtitles.total}
        icon={Wrench}
        onClick={handleInterventionsClick}
      />
      <ModernKPICard
        title={config.titles.inProgress}
        value={isLoading ? <Skeleton className="h-8 w-12" /> : kpiData.inProgress}
        subtitle={config.subtitles.inProgress}
        icon={Clock}
        onClick={handleActiveInterventionsClick}
      />
      <ModernKPICard
        title={config.titles.completed}
        value={isLoading ? <Skeleton className="h-8 w-12" /> : kpiData.completed}
        subtitle={config.subtitles.completed}
        icon={TrendingUp}
        onClick={handleCompletedClick}
      />
      <ModernKPICard
        title={config.titles.planned}
        value={isLoading ? <Skeleton className="h-8 w-12" /> : kpiData.planned}
        subtitle={config.subtitles.planned}
        icon={AlertTriangle}
        onClick={handleNonClosedClick}
      />
    </div>
  );
}
