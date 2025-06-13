
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
import { ConnectionStatus } from '@/components/ConnectionStatus';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header épuré */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Maintenance</h1>
                  <p className="text-sm text-gray-500">Gestion et suivi des maintenances préventives et curatives</p>
                </div>
                <ConnectionStatus />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3 items-center w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 sm:flex-none hover:bg-blue-50 border-gray-200"
              >
                <RefreshCw className={`w-4 h-4 mr-1 md:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualiser</span>
                <span className="sm:hidden">Sync</span>
              </Button>
              
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Nouvelle Maintenance</span>
                <span className="sm:hidden">Nouvelle</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Actions rapides - design épuré */}
        <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-gray-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
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
              <Button 
                onClick={() => setIsRepairFormOpen(true)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-200 transition-all duration-200"
              >
                <Wrench className="w-5 h-5 text-green-600" />
                <div className="text-center">
                  <div className="font-medium text-xs text-gray-900">Réparation</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => setIsMovementFormOpen(true)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 hover:border-orange-200 transition-all duration-200"
              >
                <Truck className="w-5 h-5 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium text-xs text-gray-900">Mouvement</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => setIsTrackingFormOpen(true)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-all duration-200"
              >
                <ClipboardList className="w-5 h-5 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium text-xs text-gray-900">Suivi</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => setIsRefrigeratorFormOpen(true)}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <Snowflake className="w-5 h-5 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium text-xs text-gray-900">Frigo</div>
                </div>
              </Button>
              
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-center">
                  <div className="font-medium text-xs text-gray-900">Rapport</div>
                </div>
              </Button>
              
              <Button 
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200"
              >
                <Activity className="w-5 h-5 text-indigo-600" />
                <div className="text-center">
                  <div className="font-medium text-xs text-gray-900">Analyse</div>
                </div>
              </Button>
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
      </div>

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
    </div>
  );
}
