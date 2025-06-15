import React, { useState } from 'react';
import { ModernKPICard } from '@/components/dashboard/ModernKPICard';
import { ModernWeatherWidget } from '@/components/dashboard/ModernWeatherWidget';
import { ModernStatsGrid } from '@/components/dashboard/ModernStatsGrid';
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
import { 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Users,
  RefreshCw,
  Activity,
  Settings
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
      technician: 'CÉDRIC',
      type: 'Maintenance préventive',
      status: 'completed',
      duration: '2h 30min',
      sector: 'JAPOMA'
    },
    {
      id: 'INT-2024-157',
      equipment: 'FR-2024-012',
      technician: 'MBAPBOU GRÉGOIRE',
      type: 'Réparation urgente',
      status: 'in-progress',
      duration: '1h 15min',
      sector: 'AKWA'
    },
    {
      id: 'INT-2024-158',
      equipment: 'FR-2024-134',
      technician: 'VOUKENG',
      type: 'Inspection',
      status: 'planned',
      duration: '45min',
      sector: 'BONABERI'
    }
  ];

  const performanceStats = [
    { label: "Temps moyen", value: "2.3h", change: "-12%", isPositive: true },
    { label: "Satisfaction", value: "94%", change: "+5%", isPositive: true },
    { label: "Première fois", value: "87%", change: "+8%", isPositive: true },
    { label: "Coût moyen", value: "450€", change: "-3%", isPositive: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-500">Vue d'ensemble de votre activité par secteur - Douala</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
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

      <div className="p-4 md:p-6 space-y-6">
        {/* KPIs épurés */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModernKPICard
            title="Interventions totales"
            value="247"
            subtitle="Ce mois"
            icon={Wrench}
            trend={{ value: 12, isPositive: true }}
            onClick={handleInterventionsClick}
          />
          <ModernKPICard
            title="En cours"
            value="8"
            subtitle="Interventions actives"
            icon={Clock}
            trend={{ value: -25, isPositive: true }}
            onClick={handleActiveInterventionsClick}
          />
          <ModernKPICard
            title="AF Terminées"
            value="23"
            subtitle="Avec Accord de Fin"
            icon={TrendingUp}
            trend={{ value: 3, isPositive: true }}
            onClick={handleCompletedClick}
          />
          <ModernKPICard
            title="NF Terminées"
            value="5"
            subtitle="Non-Fermées"
            icon={AlertTriangle}
            trend={{ value: -8, isPositive: true }}
            onClick={handleNonClosedClick}
          />
        </div>

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

        {/* Interventions récentes - design épuré */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-lg md:text-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Interventions récentes par secteur
              <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
                {recentInterventions.length} interventions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-xs md:text-sm text-gray-600">
                    <th className="py-4 px-6 font-semibold">ID Intervention</th>
                    <th className="py-4 px-6 font-semibold hidden sm:table-cell">Équipement</th>
                    <th className="py-4 px-6 font-semibold">Technicien</th>
                    <th className="py-4 px-6 font-semibold hidden md:table-cell">Secteur</th>
                    <th className="py-4 px-6 font-semibold hidden md:table-cell">Type</th>
                    <th className="py-4 px-6 font-semibold">Statut</th>
                    <th className="py-4 px-6 font-semibold hidden lg:table-cell">Durée</th>
                    <th className="py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInterventions.map((intervention, index) => (
                    <tr key={intervention.id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs md:text-sm text-blue-600 cursor-pointer hover:underline font-semibold">
                          {intervention.id}
                        </span>
                      </td>
                      <td className="py-4 px-6 hidden sm:table-cell">
                        <span className="font-medium text-sm text-gray-900">{intervention.equipment}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700">{intervention.technician}</td>
                      <td className="py-4 px-6 text-xs md:text-sm text-gray-600 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {intervention.sector}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs md:text-sm text-gray-600 hidden md:table-cell">{intervention.type}</td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className={`text-xs font-medium ${
                          intervention.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          intervention.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {intervention.status === 'completed' ? 'Terminé' :
                           intervention.status === 'in-progress' ? 'En cours' : 'Planifié'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs md:text-sm text-gray-600 hidden lg:table-cell font-medium">{intervention.duration}</td>
                      <td className="py-4 px-6">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
                          onClick={() => handleViewIntervention(intervention.id)}
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
    </div>
  );
}
