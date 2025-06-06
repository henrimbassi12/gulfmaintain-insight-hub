
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";

const TrendsChart: React.FC = () => {
  // Données d'exemple - Dans une application réelle, celles-ci viendraient d'un hook ou d'une API
  const maintenanceData = [
    { month: 'Jan', interventions: 65, avgTime: 2.3, criticalIssues: 8 },
    { month: 'Fev', interventions: 59, avgTime: 2.1, criticalIssues: 7 },
    { month: 'Mar', interventions: 80, avgTime: 1.8, criticalIssues: 10 },
    { month: 'Avr', interventions: 81, avgTime: 1.7, criticalIssues: 12 },
    { month: 'Mai', interventions: 76, avgTime: 1.9, criticalIssues: 9 },
    { month: 'Jun', interventions: 82, avgTime: 1.6, criticalIssues: 8 }
  ];

  // Calculer les tendances
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return 0;
    const lastMonth = data[data.length - 1][key];
    const previousMonth = data[data.length - 2][key];
    const change = ((lastMonth - previousMonth) / previousMonth) * 100;
    return Math.round(change * 10) / 10; // Arrondir à 1 décimale
  };

  const interventionsTrend = calculateTrend(maintenanceData, 'interventions');
  const timeTrend = calculateTrend(maintenanceData, 'avgTime');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Tendances de Maintenance
        </CardTitle>
        <CardDescription>Évolution des interventions et temps de résolution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Graphique des interventions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Nombre d'interventions</h3>
            <div className="flex items-center gap-1">
              {interventionsTrend > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={interventionsTrend > 0 ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                {interventionsTrend > 0 ? '+' : ''}{interventionsTrend}%
              </span>
            </div>
          </div>
          <div className="h-[180px]">
            <ChartContainer 
              config={{
                interventions: {
                  label: "Interventions",
                  theme: {
                    light: "#2563eb",
                    dark: "#3b82f6",
                  },
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maintenanceData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="interventions" 
                    name="Interventions"
                    className="fill-[--color-interventions]" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Graphique du temps moyen de résolution */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">Temps moyen de résolution (heures)</h3>
            <div className="flex items-center gap-1">
              {timeTrend < 0 ? (
                <TrendingDown className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500" />
              )}
              <span className={timeTrend < 0 ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                {timeTrend > 0 ? '+' : ''}{timeTrend}%
              </span>
            </div>
          </div>
          <div className="h-[180px]">
            <ChartContainer
              config={{
                avgTime: {
                  label: "Temps moyen",
                  theme: {
                    light: "#ca8a04",
                    dark: "#eab308",
                  },
                },
                criticalIssues: {
                  label: "Problèmes critiques",
                  theme: {
                    light: "#dc2626",
                    dark: "#ef4444",
                  },
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={maintenanceData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis tickLine={false} axisLine={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="avgTime" 
                    name="Temps moyen"
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    className="stroke-[--color-avgTime]"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="criticalIssues" 
                    name="Problèmes critiques"
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    className="stroke-[--color-criticalIssues]"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendsChart;
