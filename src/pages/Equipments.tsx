
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, Plus, RefreshCw, Activity } from "lucide-react";
import { EquipmentStats } from '@/components/EquipmentStats';
import { EquipmentFilters } from '@/components/EquipmentFilters';
import { EquipmentList } from '@/components/EquipmentList';
import { EquipmentFormModal } from '@/components/EquipmentFormModal';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { ModernButton } from '@/components/ui/modern-button';
import { useEquipments } from '@/hooks/useEquipments';
import { toast } from 'sonner';

const Equipments = () => {
  const [refreshing, setRefreshing] = useState(false);
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
    setRefreshing(true);
    toast.promise(
      refetch(),
      {
        loading: 'Actualisation des données...',
        success: 'Données actualisées avec succès',
        error: 'Erreur lors de l\'actualisation'
      }
    );
    setTimeout(() => setRefreshing(false), 1500);
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
      <AirbnbContainer>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg text-gray-600">Chargement des équipements...</span>
          </div>
        </div>
      </AirbnbContainer>
    );
  }

  return (
    <AirbnbContainer>
      <AirbnbHeader
        title="Équipements"
        subtitle={`Gestion et suivi de ${equipments.length} équipement${equipments.length > 1 ? 's' : ''}${filteredEquipments.length !== equipments.length ? ` (${filteredEquipments.length} affiché${filteredEquipments.length > 1 ? 's' : ''})` : ''}`}
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
        
        <EquipmentFormModal onSuccess={refetch} />
      </AirbnbHeader>

      {/* Statistics épurées */}
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Statistiques des équipements
            <Badge variant="secondary" className="ml-auto text-xs bg-blue-50 text-blue-700 border-blue-200">
              {filteredEquipments.length} équipements
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <EquipmentStats equipments={filteredEquipments} />
        </CardContent>
      </Card>

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
    </AirbnbContainer>
  );
};

export default Equipments;
