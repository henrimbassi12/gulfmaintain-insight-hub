
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { NotificationSystem } from '@/components/NotificationSystem';
import { RefreshCw, Activity } from 'lucide-react';

interface DashboardHeaderProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  handleRefreshData: () => void;
  refreshing: boolean;
  isLoading: boolean;
}

export function DashboardHeader({
  timeRange,
  setTimeRange,
  handleRefreshData,
  refreshing,
  isLoading
}: DashboardHeaderProps) {
  return (
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
            <ConnectionStatus />
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
              disabled={refreshing || isLoading}
              className="flex-1 sm:flex-none hover:bg-blue-50 border-gray-200"
            >
              <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing || isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualiser</span>
              <span className="sm:hidden">Sync</span>
            </Button>
            
            <NotificationSystem />
          </div>
        </div>
      </div>
    </div>
  );
}
