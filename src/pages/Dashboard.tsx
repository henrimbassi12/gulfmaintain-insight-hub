import React from 'react';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MapPin,
  Bell,
  Calendar,
  Users
} from 'lucide-react';

export default function Dashboard() {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      message: 'Frigo #FR-2024-045 - Température critique détectée',
      location: 'Agence Casablanca Nord',
      time: 'Il y a 5 min'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Maintenance préventive due dans 2 jours',
      location: 'Agence Rabat Centre',
      time: 'Il y a 1h'
    },
    {
      id: 3,
      type: 'info',
      message: 'Rapport de maintenance disponible',
      location: 'Équipe Technique A',
      time: 'Il y a 2h'
    }
  ];

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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité de maintenance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Aujourd'hui
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Bell className="w-4 h-4 mr-2" />
            Nouvelle alerte
          </Button>
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
          className="border-l-4 border-l-blue-500"
        />
        <DashboardCard
          title="En cours"
          value="8"
          subtitle="Interventions actives"
          icon={Clock}
          trend={{ value: -25, isPositive: true }}
          className="border-l-4 border-l-orange-500"
        />
        <DashboardCard
          title="AF Terminées"
          value="23"
          subtitle="Pannes avec Accord de Fin"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          className="border-l-4 border-l-green-500"
        />
        <DashboardCard
          title="NF Terminées"
          value="5"
          subtitle="Pannes Non-Fermées à surveiller"
          icon={AlertTriangle}
          trend={{ value: -8, isPositive: true }}
          className="border-l-4 border-l-red-500"
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Interventions récentes
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
                </tr>
              </thead>
              <tbody>
                {recentInterventions.map((intervention) => (
                  <tr key={intervention.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3">
                      <span className="font-mono text-sm text-blue-600">{intervention.id}</span>
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
