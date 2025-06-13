import React, { useState } from 'react';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import TechnicianPerformance from '@/components/dashboard/TechnicianPerformance';
import RegionMap from '@/components/dashboard/RegionMap';
import EquipmentTypeBreakdown from '@/components/dashboard/EquipmentTypeBreakdown';
import AgencySummary from '@/components/dashboard/AgencySummary';
import UrgentAlerts from '@/components/dashboard/UrgentAlerts';
import TrendsChart from '@/components/dashboard/TrendsChart';
import AISummary from '@/components/dashboard/AISummary';
import QuickActions from '@/components/dashboard/QuickActions';
import { NotificationSystem } from '@/components/NotificationSystem';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { DataExport } from '@/components/DataExport';
import { 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Bell,
  Users,
  RefreshCw
} from 'lucide-react';
import { PermissionCheck } from '@/components/auth/PermissionCheck';

export default function Dashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("today");
  const [refreshing, setRefreshing] = useState(false);

  // Fonctions corrigées pour les actions
  const handleNewAlert = () => {
    toast({
      title: "✅ Nouvelle alerte",
      description: "Alerte créée et ajoutée au système de surveillance.",
    });
    setTimeout(() => {
      toast({
        title: "Notification envoyée",
        description: "Équipe technique notifiée de la nouvelle alerte",
      });
    }, 1500);
  };

  const handleExportData = () => {
    toast({
      title: "✅ Export démarré",
      description: "Génération du rapport en cours...",
    });
    
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Le rapport a été téléchargé avec succès.",
      });
    }, 2000);
  };

  const handleRefreshData = () => {
    setRefreshing(true);
    toast({
      title: "✅ Actualisation",
      description: "Mise à jour des données en cours...",
    });
    
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Données actualisées",
        description: "Les données ont été mises à jour avec succès.",
      });
    }, 1500);
  };

  // Fonctions pour les cartes KPI
  const handleInterventionsClick = () => {
    toast({
      title: "✅ Navigation",
      description: "Redirection vers la page Maintenance...",
    });
  };

  const handleActiveInterventionsClick = () => {
    toast({
      title: "✅ Interventions actives",
      description: "Affichage des 8 interventions en cours...",
    });
  };

  const handleCompletedClick = () => {
    toast({
      title: "✅ AF Terminées",
      description: "Affichage des 23 interventions avec Accord de Fin...",
    });
  };

  const handleNonClosedClick = () => {
    toast({
      title: "✅ NF Terminées",
      description: "Affichage des 5 pannes Non-Fermées à surveiller...",
    });
  };

  // Fonction pour les interventions récentes
  const handleViewIntervention = (interventionId: string) => {
    toast({
      title: "✅ Détails intervention",
      description: `Ouverture des détails de l'intervention ${interventionId}`,
    });
  };

  const recentInterventions = [
    {
      id: 'INT-2024-156',
      equipment: 'FR-2024-089',
      technician: 'Ahmed Benali',
      type: 'Maintenance préventive',
      status: 'completed',
      duration: '2h 30min'
    },
    {
      id: 'INT-2024-157',
      equipment: 'FR-2024-012',
      technician: 'Fatima Zahra',
      type: 'Réparation urgente',
      status: 'in-progress',
      duration: '1h 15min'
    },
    {
      id: 'INT-2024-158',
      equipment: 'FR-2024-134',
      technician: 'Mohamed Alami',
      type: 'Inspection',
      status: 'planned',
      duration: '45min'
    }
  ];

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 bg-gray-50 min-h-screen pt-16 md:pt-0">
      {/* Header avec statut de connexion */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <ConnectionStatus />
          </div>
          <p className="text-sm md:text-base text-gray-600">Vue d'ensemble de votre activité de maintenance</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <DataExport />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={refreshing}
            className="flex-1 sm:flex-none hover:bg-green-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualiser</span>
            <span className="sm:hidden">Sync</span>
          </Button>
          
          <div className="hidden md:block">
            <NotificationSystem />
          </div>
          
          <PermissionCheck requiredRole="admin">
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none transition-colors" 
              onClick={handleNewAlert}
            >
              <Bell className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Nouvelle alerte</span>
              <span className="sm:hidden">Alerte</span>
            </Button>
          </PermissionCheck>
        </div>
      </div>

      {/* KPIs - En-tête rapide */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <DashboardCard
          title="Interventions totales"
          value="247"
          subtitle="Ce mois"
          icon={Wrench}
          trend={{ value: 12, isPositive: true }}
          className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => toast({ title: "Navigation", description: "Redirection vers la page Maintenance..." })}
        />
        <DashboardCard
          title="En cours"
          value="8"
          subtitle="Interventions actives"
          icon={Clock}
          trend={{ value: -25, isPositive: true }}
          className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => toast({ title: "✅ Interventions actives", description: "Affichage des 8 interventions en cours..." })}
        />
        <DashboardCard
          title="AF Terminées"
          value="23"
          subtitle="Pannes avec Accord de Fin"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => toast({ title: "✅ AF Terminées", description: "Affichage des 23 interventions avec Accord de Fin..." })}
        />
        <DashboardCard
          title="NF Terminées"
          value="5"
          subtitle="Pannes Non-Fermées à surveiller"
          icon={AlertTriangle}
          trend={{ value: -8, isPositive: true }}
          className="border-l-4 border-l-red-500 cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => toast({ title: "✅ NF Terminées", description: "Affichage des 5 pannes Non-Fermées à surveiller..." })}
        />
      </div>

      {/* Row 1: Performance & Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <TechnicianPerformance />
        <UrgentAlerts />
      </div>

      {/* Row 2: Geographic & Equipment Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <RegionMap />
        <EquipmentTypeBreakdown />
      </div>

      {/* Row 3: Agency Summary & Trends */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <AgencySummary />
        <TrendsChart />
      </div>

      {/* Row 4: AI Summary & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <AISummary />
        <QuickActions />
      </div>

      {/* Interventions récentes */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="w-5 h-5 text-green-500" />
            Interventions récentes
            <Badge variant="secondary" className="ml-auto text-xs">
              {recentInterventions.length} interventions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs md:text-sm text-gray-500">
                  <th className="pb-3 font-medium">ID Intervention</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Équipement</th>
                  <th className="pb-3 font-medium">Technicien</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Type</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Durée</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentInterventions.map((intervention) => (
                  <tr key={intervention.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="font-mono text-xs md:text-sm text-blue-600 cursor-pointer hover:underline">
                        {intervention.id}
                      </span>
                    </td>
                    <td className="py-3 hidden sm:table-cell">
                      <span className="font-medium text-sm">{intervention.equipment}</span>
                    </td>
                    <td className="py-3 text-sm">{intervention.technician}</td>
                    <td className="py-3 text-xs md:text-sm text-gray-600 hidden md:table-cell">{intervention.type}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className={`text-xs ${
                        intervention.status === 'completed' ? 'bg-green-100 text-green-800' :
                        intervention.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {intervention.status === 'completed' ? 'Terminé' :
                         intervention.status === 'in-progress' ? 'En cours' : 'Planifié'}
                      </Badge>
                    </td>
                    <td className="py-3 text-xs md:text-sm text-gray-600 hidden lg:table-cell">{intervention.duration}</td>
                    <td className="py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs px-2 py-1 hover:bg-blue-50 transition-colors"
                        onClick={() => toast({ title: "✅ Détails intervention", description: `Ouverture des détails de l'intervention ${intervention.id}` })}
                      >
                        Voir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
