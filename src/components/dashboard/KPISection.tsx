
import React from 'react';
import { KPICard } from './KPICard';
import { TrendingUp, AlertTriangle, User, Clock } from 'lucide-react';

export function KPISection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KPICard 
        title="Taux de réussite" 
        value="92%" 
        icon={TrendingUp}
      />
      <KPICard 
        title="Urgences en cours" 
        value="7" 
        icon={AlertTriangle}
      />
      <KPICard 
        title="Technicien du mois" 
        value="J. Ekwalla" 
        icon={User}
      />
      <KPICard 
        title="Durée moyenne" 
        value="42 min" 
        icon={Clock}
      />
    </div>
  );
}
