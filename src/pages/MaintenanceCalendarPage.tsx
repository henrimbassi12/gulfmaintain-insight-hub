import React, { useState } from 'react';
import { MaintenanceCalendar } from '@/components/MaintenanceCalendar';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, RefreshCw, Activity } from 'lucide-react';
import { DepotScheduleForm } from '@/components/forms/DepotScheduleForm';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

export default function MaintenanceCalendarPage() {
  const [isDepotFormOpen, setIsDepotFormOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSaveDepotForm = (data: any) => {
    console.log('Saving depot schedule:', data);
    toast.success("Fiche passage dépôt enregistrée avec succès");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Actualisation du planning...',
        success: 'Planning actualisé avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Planning & Calendrier"
        subtitle="Gestion des plannings et calendriers de maintenance"
        icon={Calendar}
      >
        <ModernButton 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          icon={RefreshCw}
          className={refreshing ? 'animate-spin' : ''}
        >
          Actualiser
        </ModernButton>
        
        <ModernButton 
          onClick={() => setIsDepotFormOpen(true)}
          icon={FileText}
        >
          Fiche Passage Dépôt
        </ModernButton>
      </AirbnbHeader>

      {/* Statistiques du planning */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Vue d'ensemble du planning
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              Cette semaine
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-blue-600 mb-1">12</p>
              <p className="text-sm text-gray-600">Maintenances programmées</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-green-600 mb-1">8</p>
              <p className="text-sm text-gray-600">Interventions terminées</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-orange-600 mb-1">3</p>
              <p className="text-sm text-gray-600">En cours</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-2xl font-bold text-red-600 mb-1">1</p>
              <p className="text-sm text-gray-600">Retards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendrier principal */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <MaintenanceCalendar />
        </CardContent>
      </Card>

      <DepotScheduleForm 
        isOpen={isDepotFormOpen}
        onClose={() => setIsDepotFormOpen(false)}
        onSave={handleSaveDepotForm}
      />
    </AirbnbContainer>
  );
}
