
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Clock, User, MapPin, FileText } from 'lucide-react';
import { MaintenanceStatusBadge } from './MaintenanceStatusBadge';

interface Maintenance {
  id: string;
  equipment: string;
  type: string;
  status: string;
  technician: string;
  scheduledDate: string;
  timeSlot: string;
  priority: string;
  location: string;
  client: string;
  description: string;
}

interface MaintenanceListProps {
  maintenances: Maintenance[];
  onMaintenanceClick: (maintenance: Maintenance) => void;
}

export function MaintenanceList({ maintenances, onMaintenanceClick }: MaintenanceListProps) {
  if (maintenances.length === 0) {
    return (
      <Card className="bg-white border border-gray-100 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune maintenance trouvée avec ces filtres</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {maintenances.map((maintenance) => (
            <div
              key={maintenance.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onMaintenanceClick(maintenance)}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {maintenance.equipment}
                      </h3>
                      <p className="text-sm text-gray-600">{maintenance.client}</p>
                    </div>
                    <MaintenanceStatusBadge 
                      status={maintenance.priority} 
                      priority={maintenance.priority}
                      variant="priority"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">ID:</span> {maintenance.id}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Horaire:</span> {maintenance.timeSlot}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">Technicien:</span> {maintenance.technician}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Lieu:</span> {maintenance.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {maintenance.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(maintenance.scheduledDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <MaintenanceStatusBadge status={maintenance.status} />
                  </div>

                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {maintenance.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
