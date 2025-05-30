
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'operational' | 'maintenance' | 'critical' | 'offline' | 'planned' | 'in-progress' | 'completed' | 'cancelled';
  children: React.ReactNode;
}

const statusStyles = {
  operational: 'bg-green-100 text-green-800 hover:bg-green-200',
  maintenance: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  critical: 'bg-red-100 text-red-800 hover:bg-red-200',
  offline: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  planned: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'in-progress': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  completed: 'bg-green-100 text-green-800 hover:bg-green-200',
  cancelled: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={statusStyles[status]}>
      {children}
    </Badge>
  );
}
