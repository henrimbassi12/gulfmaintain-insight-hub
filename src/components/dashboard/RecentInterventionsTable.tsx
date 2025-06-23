
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, Wrench, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { InterventionActions } from './InterventionActions';
import { toast } from 'sonner';

interface Intervention {
  id: string;
  equipment: string;
  technician: string;
  type: string;
  status: 'completed' | 'in-progress' | 'planned';
  duration: string;
  sector: string;
}

interface RecentInterventionsTableProps {
  interventions: Intervention[];
  isLoading: boolean;
}

export function RecentInterventionsTable({ interventions, isLoading }: RecentInterventionsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'in-progress':
        return 'En cours';
      case 'planned':
        return 'Planifiée';
      default:
        return status;
    }
  };

  const handleExportInterventions = () => {
    const exportData = {
      date: new Date().toISOString(),
      interventions: interventions
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interventions-recentes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Interventions exportées avec succès !');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Interventions récentes par secteur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            Interventions récentes par secteur
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportInterventions}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {interventions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune intervention récente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interventions.map((intervention) => (
              <div 
                key={intervention.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(intervention.status)}>
                      {getStatusText(intervention.status)}
                    </Badge>
                    <span className="text-sm font-medium">#{intervention.id}</span>
                  </div>
                  <InterventionActions intervention={intervention} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{intervention.equipment}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{intervention.technician}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{intervention.duration}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{intervention.sector}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-600">
                  Type: <span className="font-medium">{intervention.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
