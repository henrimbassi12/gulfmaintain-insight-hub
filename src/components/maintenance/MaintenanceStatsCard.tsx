
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface MaintenanceStatsCardProps {
  maintenances: any[];
}

export function MaintenanceStatsCard({ maintenances }: MaintenanceStatsCardProps) {
  const stats = React.useMemo(() => {
    const total = maintenances.length;
    const planned = maintenances.filter(m => m.status === 'planned' || m.status === 'prevu').length;
    const inProgress = maintenances.filter(m => m.status === 'in-progress').length;
    const completed = maintenances.filter(m => m.status === 'completed').length;
    const urgent = maintenances.filter(m => m.priority === 'high' || m.status === 'urgent').length;
    
    return { total, planned, inProgress, completed, urgent };
  }, [maintenances]);

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="bg-gray-50 border-b border-gray-100 pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          Statistiques des maintenances
          <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
            Temps réel
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-orange-600" />
              <p className="text-2xl font-bold text-orange-600">{stats.planned}</p>
            </div>
            <p className="text-sm text-gray-600">Planifiées</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-2xl font-bold text-green-600">{stats.inProgress}</p>
            </div>
            <p className="text-sm text-gray-600">En cours</p>
          </div>
          
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
            <p className="text-sm text-gray-600">Terminées</p>
          </div>
        </div>
        
        {stats.urgent > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                {stats.urgent} maintenance{stats.urgent > 1 ? 's' : ''} urgente{stats.urgent > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
