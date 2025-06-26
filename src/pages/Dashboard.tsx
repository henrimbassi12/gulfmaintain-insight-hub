import React from 'react';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MobileHeader } from '@/components/MobileHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  isLoading?: boolean;
}

function DashboardCard({ title, value, description, isLoading }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { userProfile } = useAuth();

  const isAdmin = userProfile?.role === 'admin';
  const isManager = userProfile?.role === 'manager';

  // Exemple de données (à remplacer avec les vraies données)
  const totalEquipments = 150;
  const activeEquipments = 120;
  const maintenancesPlanned = 30;
  const maintenancesOverdue = 5;

  const isLoading = false; // Simuler le chargement des données

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      
      <AirbnbContainer>
        <AirbnbHeader
          title="Tableau de bord"
          subtitle={`Vue d'ensemble des maintenances${userProfile?.role === 'admin' ? ' - Administration' : userProfile?.role === 'manager' ? ' - Gestion' : ' - Douala'}`}
          icon={BarChart3}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          <DashboardCard
            title="Total Équipements"
            value={totalEquipments}
            isLoading={isLoading}
          />
          <DashboardCard
            title="Équipements Actifs"
            value={activeEquipments}
            isLoading={isLoading}
          />
          <DashboardCard
            title="Maintenances Planifiées"
            value={maintenancesPlanned}
            isLoading={isLoading}
          />
          {isManager || isAdmin ? (
            <DashboardCard
              title="Maintenances En Retard"
              value={maintenancesOverdue}
              isLoading={isLoading}
            />
          ) : null}
        </div>
      </AirbnbContainer>
    </div>
  );
}
