
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import ManagerQuickActions from './ManagerQuickActions';
import TechnicianQuickActions from './TechnicianQuickActions';
import { Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  const { userProfile, loading } = useAuth();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      );
    }

    const role = userProfile?.role;

    if (role === 'admin' || role === 'manager') {
      return <ManagerQuickActions />;
    }
  
    if (role === 'technician') {
      return <TechnicianQuickActions />;
    }

    return <p className="text-gray-500">Aucune action rapide disponible.</p>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Actions rapides
        </CardTitle>
        <CardDescription>Accès rapide aux fonctionnalités principales</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
