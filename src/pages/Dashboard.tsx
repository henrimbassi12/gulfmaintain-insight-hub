
import React from 'react';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Interventions"
          value="247"
          subtitle="Ce mois"
          icon={Wrench}
          trend={{ value: 12, isPositive: true }}
          className="border-l-4 border-l-blue-500"
        />
        <DashboardCard
          title="Interventions Critiques"
          value="8"
          subtitle="En attente"
          icon={AlertTriangle}
          trend={{ value: -25, isPositive: true }}
          className="border-l-4 border-l-red-500"
        />
        <DashboardCard
          title="Taux de Réussite"
          value="94.2%"
          subtitle="Performance globale"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          className="border-l-4 border-l-green-500"
        />
        <DashboardCard
          title="Temps Moyen"
          value="2h 15min"
          subtitle="Par intervention"
          icon={Clock}
          trend={{ value: -8, isPositive: true }}
          className="border-l-4 border-l-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alertes urgentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-500" />
              Alertes urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'critical' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Répartition par région */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Répartition par région
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Casablanca</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Rabat</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">50%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Marrakech</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">33%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tanger</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">25%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
