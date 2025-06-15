import React, { useState, useMemo } from 'react';
import { EquipmentList } from '@/components/EquipmentList';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import MaintenanceFilters from '@/components/maintenance/MaintenanceFilters';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, ClipboardList, Truck, Wrench, Snowflake, Settings, RefreshCw, Activity } from 'lucide-react';
import { RepairForm } from '@/components/forms/RepairForm';
import { MovementForm } from '@/components/forms/MovementForm';
import { MaintenanceTrackingForm } from '@/components/forms/MaintenanceTrackingForm';
import { RefrigeratorMaintenanceForm } from '@/components/forms/RefrigeratorMaintenanceForm';
import { useEquipments } from '@/hooks/useEquipments';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { toast } from 'sonner';

export default function Maintenance() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isTrackingFormOpen, setIsTrackingFormOpen] = useState(false);
  const [isRefrigeratorFormOpen, setIsRefrigeratorFormOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState({
    technician: 'all',
    status: 'all',
    agency: 'all',
    equipment: 'all',
    search: ''
  });

  const { equipments, isLoading } = useEquipments();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      technician: 'all',
      status: 'all',
      agency: 'all',
      equipment: 'all',
      search: ''
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    toast.success("Actualisation des données...");
    
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Données mises à jour avec succès");
    }, 1500);
  };

  // Filter equipments based on maintenance filters
  const filteredEquipments = useMemo(() => {
    return equipments.filter(equipment => {
      const matchesSearch = filters.search === '' || 
        equipment.equipment_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'all' || equipment.status === filters.status;
      const matchesAgency = filters.agency === 'all' || equipment.agency === filters.agency;
      const matchesTechnician = filters.technician === 'all' || equipment.technician === filters.technician;

      return matchesSearch && matchesStatus && matchesAgency && matchesTechnician;
    });
  }, [equipments, filters]);

  const handleSaveForm = (data: any) => {
    console.log('Saving form data:', data);
    toast.success("Maintenance créée avec succès");
  };

  const handleSaveRepairForm = (data: any) => {
    console.log('Saving repair form data:', data);
    toast.success("Fiche réparation enregistrée");
  };

  const handleSaveMovementForm = (data: any) => {
    console.log('Saving movement form data:', data);
    toast.success("Fiche mouvement enregistrée");
  };

  const handleSaveTrackingForm = (data: any) => {
    console.log('Saving tracking form data:', data);
    toast.success("Fiche suivi enregistrée");
  };

  const handleSaveRefrigeratorForm = (data: any) => {
    console.log('Saving refrigerator form data:', data);
    toast.success("Fiche frigo enregistrée");
  };

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Maintenance"
        subtitle="Gestion et suivi des maintenances préventives et curatives"
        icon={Wrench}
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
          onClick={() => setIsFormOpen(true)}
          icon={Plus}
        >
          Nouvelle Maintenance
        </ModernButton>
      </AirbnbHeader>

      {/* Actions rapides - design épuré */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Actions rapides
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              6 actions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <ModernButton 
              onClick={() => setIsRepairFormOpen(true)}
              variant="outline"
              size="sm"
              icon={Wrench}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-200"
            >
              Réparation
            </ModernButton>
            
            <ModernButton 
              onClick={() => setIsMovementFormOpen(true)}
              variant="outline"
              size="sm"
              icon={Truck}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200"
            >
              Mouvement
            </ModernButton>
            
            <ModernButton 
              onClick={() => setIsTrackingFormOpen(true)}
              variant="outline"
              size="sm"
              icon={ClipboardList}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-200"
            >
              Suivi
            </ModernButton>
            
            <ModernButton 
              onClick={() => setIsRefrigeratorFormOpen(true)}
              variant="outline"
              size="sm"
              icon={Snowflake}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
            >
              Frigo
            </ModernButton>
            
            <ModernButton 
              variant="outline"
              size="sm"
              icon={FileText}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 hover:border-gray-300"
            >
              Rapport
            </ModernButton>
            
            <ModernButton 
              variant="outline"
              size="sm"
              icon={Activity}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-indigo-50 hover:border-indigo-200"
            >
              Analyse
            </ModernButton>
          </div>
        </CardContent>
      </Card>
      
      <MaintenanceFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />
      
      <EquipmentList 
        equipments={equipments}
        filteredEquipments={filteredEquipments}
        isLoading={isLoading}
      />

      {/* Modals */}
      <MaintenanceForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveForm}
      />

      <RepairForm 
        isOpen={isRepairFormOpen}
        onClose={() => setIsRepairFormOpen(false)}
        onSave={handleSaveRepairForm}
      />

      <MovementForm 
        isOpen={isMovementFormOpen}
        onClose={() => setIsMovementFormOpen(false)}
        onSave={handleSaveMovementForm}
      />

      <MaintenanceTrackingForm 
        isOpen={isTrackingFormOpen}
        onClose={() => setIsTrackingFormOpen(false)}
        onSave={handleSaveTrackingForm}
      />

      <RefrigeratorMaintenanceForm 
        isOpen={isRefrigeratorFormOpen}
        onClose={() => setIsRefrigeratorFormOpen(false)}
        onSave={handleSaveRefrigeratorForm}
      />
    </AirbnbContainer>
  );
}
