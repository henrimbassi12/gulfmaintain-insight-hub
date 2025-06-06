
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
import { 
  Wrench, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Bell,
  Calendar,
  Users,
  Download,
  RefreshCw
} from 'lucide-react';
import { PermissionCheck } from '@/components/auth/PermissionCheck';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export default function Dashboard() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("today");
  const [refreshing, setRefreshing] = useState(false);

  const handleNewAlert = () => {
    toast({
      title: "Nouvelle alerte créée",
      description: "L'alerte a été ajoutée au système de surveillance.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "Génération du rapport en cours...",
    });
    
    // Simuler l'export
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
      title: "Actualisation",
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header avec statut de connexion */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <OfflineIndicator />
          </div>
          <p className="text-gray-600">Vue d'ensemble de votre activité de maintenance</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
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
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <PermissionCheck requiredRole="admin">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={handleNewAlert}>
              <Bell className="w-4 h-4 mr-2" />
              Nouvelle alerte
            </Button>
          </PermissionCheck>
        </div>
      </div>

      {/* KPIs - En-tête rapide (Header summary) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Interventions totales"
          value="247"
          subtitle="Ce mois"
          icon={Wrench}
          trend={{ value: 12, isPositive: true }}
          className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => toast({ title: "Navigation", description: "Redirection vers la page Maintenance..." })}
        />
        <DashboardCard
          title="En cours"
          value="8"
          subtitle="Interventions actives"
          icon={Clock}
          trend={{ value: -25, isPositive: true }}
          className="border-l-4 border-l-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => toast({ title: "Navigation", description: "Affichage des interventions en cours..." })}
        />
        <DashboardCard
          title="AF Terminées"
          value="23"
          subtitle="Pannes avec Accord de Fin"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          className="border-l-4 border-l-green-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => toast({ title: "Navigation", description: "Affichage des interventions terminées..." })}
        />
        <DashboardCard
          title="NF Terminées"
          value="5"
          subtitle="Pannes Non-Fermées à surveiller"
          icon={AlertTriangle}
          trend={{ value: -8, isPositive: true }}
          className="border-l-4 border-l-red-500 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => toast({ title: "Navigation", description: "Affichage des pannes non-fermées..." })}
        />
      </div>

      {/* Row 1: Performance & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechnicianPerformance />
        <UrgentAlerts />
      </div>

      {/* Row 2: Geographic & Equipment Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RegionMap />
        <EquipmentTypeBreakdown />
      </div>

      {/* Row 3: Agency Summary & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgencySummary />
        <TrendsChart />
      </div>

      {/* Row 4: AI Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AISummary />
        <QuickActions />
      </div>

      {/* Interventions récentes */}
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Interventions récentes
            <Badge variant="secondary" className="ml-auto">
              {recentInterventions.length} interventions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="pb-3 font-medium">ID Intervention</th>
                  <th className="pb-3 font-medium">Équipement</th>
                  <th className="pb-3 font-medium">Technicien</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Statut</th>
                  <th className="pb-3 font-medium">Durée</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentInterventions.map((intervention) => (
                  <tr key={intervention.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <span className="font-mono text-sm text-blue-600 cursor-pointer hover:underline">
                        {intervention.id}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-medium">{intervention.equipment}</span>
                    </td>
                    <td className="py-3">{intervention.technician}</td>
                    <td className="py-3 text-sm text-gray-600">{intervention.type}</td>
                    <td className="py-3">
                      <Badge variant="secondary" className={
                        intervention.status === 'completed' ? 'bg-green-100 text-green-800' :
                        intervention.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {intervention.status === 'completed' ? 'Terminé' :
                         intervention.status === 'in-progress' ? 'En cours' : 'Planifié'}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{intervention.duration}</td>
                    <td className="py-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toast({ 
                          title: "Détails", 
                          description: `Affichage des détails de l'intervention ${intervention.id}` 
                        })}
                      >
                        Voir détails
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
