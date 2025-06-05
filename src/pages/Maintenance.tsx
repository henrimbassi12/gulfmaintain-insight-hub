
import React, { useState, useMemo } from 'react';
import { EquipmentList } from '@/components/EquipmentList';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import MaintenanceFilters from '@/components/maintenance/MaintenanceFilters';
import { Button } from "@/components/ui/button";
import { Plus, FileText, ClipboardList, Truck, Wrench, Snowflake } from 'lucide-react';
import { RepairForm } from '@/components/forms/RepairForm';
import { MovementForm } from '@/components/forms/MovementForm';
import { MaintenanceTrackingForm } from '@/components/forms/MaintenanceTrackingForm';
import { RefrigeratorMaintenanceForm } from '@/components/forms/RefrigeratorMaintenanceForm';
import { useEquipments } from '@/hooks/useEquipments';

export default function Maintenance() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRepairFormOpen, setIsRepairFormOpen] = useState(false);
  const [isMovementFormOpen, setIsMovementFormOpen] = useState(false);
  const [isTrackingFormOpen, setIsTrackingFormOpen] = useState(false);
  const [isRefrigeratorFormOpen, setIsRefrigeratorFormOpen] = useState(false);

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
  };

  const handleSaveRepairForm = (data: any) => {
    console.log('Saving repair form data:', data);
  };

  const handleSaveMovementForm = (data: any) => {
    console.log('Saving movement form data:', data);
  };

  const handleSaveTrackingForm = (data: any) => {
    console.log('Saving tracking form data:', data);
  };

  const handleSaveRefrigeratorForm = (data: any) => {
    console.log('Saving refrigerator form data:', data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance</h1>
          <p className="text-gray-600">Gestion et suivi des maintenances préventives et curatives</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Maintenance
          </Button>
          <Button 
            onClick={() => setIsRepairFormOpen(true)}
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Fiche Réparation
          </Button>
          <Button 
            onClick={() => setIsMovementFormOpen(true)}
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <Truck className="w-4 h-4 mr-2" />
            Fiche Mouvement
          </Button>
          <Button 
            onClick={() => setIsTrackingFormOpen(true)}
            variant="outline"
            className="border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Fiche Suivi
          </Button>
          <Button 
            onClick={() => setIsRefrigeratorFormOpen(true)}
            variant="outline"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Snowflake className="w-4 h-4 mr-2" />
            Fiche Frigo
          </Button>
        </div>
      </div>
      
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
