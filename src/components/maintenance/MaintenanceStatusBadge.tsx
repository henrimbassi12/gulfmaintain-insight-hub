
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface MaintenanceStatusBadgeProps {
  status: string;
  priority?: string;
  variant?: 'status' | 'priority';
}

export function MaintenanceStatusBadge({ status, priority, variant = 'status' }: MaintenanceStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Prévu': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Terminé': return 'bg-green-100 text-green-800 border-green-200';
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500 text-white';
      case 'Haute': return 'bg-orange-500 text-white';
      case 'Normale': return 'bg-blue-500 text-white';
      case 'Basse': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (variant === 'priority' && priority) {
    return (
      <Badge className={getPriorityColor(priority)}>
        {priority}
      </Badge>
    );
  }

  return (
    <Badge className={getStatusColor(status)}>
      {status}
    </Badge>
  );
}
