
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Plus, RefreshCw } from "lucide-react";
import { EquipmentStats } from '@/components/EquipmentStats';
import { EquipmentFilters } from '@/components/EquipmentFilters';
import { EquipmentList } from '@/components/EquipmentList';
import { AddEquipmentForm } from '@/components/AddEquipmentForm';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { useEquipments } from '@/hooks/useEquipments';
import { toast } from 'sonner';

const Equipments = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    agency: 'all',
    technician: 'all',
    search: '',
    brands: '',
    types: '',
    agencies: '',
    maintenanceStatus: ''
  });

  const { equipments, isLoading, refetch } = useEquipments();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    toast.promise(
      refetch(),
      {
        loading: 'Actualisation des données...',
        success: 'Données actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
  };

  // Enhanced filtering logic
  const filteredEquipments = useMemo(() => {
    return equipments.filter(equipment => {
      const matchesStatus = filters.status === 'all' || equipment.status === filters.status;
      const matchesType = filters.type === 'all' || equipment.type.toLowerCase().includes(filters.type.toLowerCase());
      const matchesAgency = filters.agency === 'all' || equipment.agency === filters.agency;
      const matchesTechnician = filters.technician === 'all' || equipment.technician === filters.technician;
      
      const matchesSearch = filters.search === '' || 
        equipment.equipment_id.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.model.toLowerCase().includes(filters.search.toLowerCase());

      // Advanced filters
      const selectedBrands = filters.brands ? filters.brands.split(',').filter(Boolean) : [];
      const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(equipment.brand);

      const selectedTypes = filters.types ? filters.types.split(',').filter(Boolean) : [];
      const matchesTypes = selectedTypes.length === 0 || selectedTypes.includes(equipment.type);

      const selectedAgencies = filters.agencies ? filters.agencies.split(',').filter(Boolean) : [];
      const matchesAgencies = selectedAgencies.length === 0 || selectedAgencies.includes(equipment.agency);

      return matchesStatus && matchesType && matchesAgency && matchesTechnician && 
             matchesSearch && matchesBrands && matchesTypes && matchesAgencies;
    });
  }, [equipments, filters]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600">Chargement des équipements...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Équipements</h1>
            <p className="text-gray-600">
              Gestion et suivi de {equipments.length} équipement{equipments.length > 1 ? 's' : ''}
              {filteredEquipments.length !== equipments.length && 
                ` (${filteredEquipments.length} affiché${filteredEquipments.length > 1 ? 's' : ''})`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <AddEquipmentForm onSuccess={refetch} />
        </div>
      </div>

      {/* Statistics */}
      <EquipmentStats equipments={filteredEquipments} />

      {/* Enhanced Filters */}
      <EquipmentFilters 
        onFilterChange={handleFilterChange}
        equipments={equipments}
      />

      {/* Equipment List */}
      <EquipmentList 
        equipments={equipments}
        filteredEquipments={filteredEquipments}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Equipments;
