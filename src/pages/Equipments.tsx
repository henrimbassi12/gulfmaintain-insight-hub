
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Package, RefreshCw } from "lucide-react";
import { EquipmentStats } from '@/components/EquipmentStats';
import { EquipmentFilters } from '@/components/EquipmentFilters';
import { EquipmentList } from '@/components/EquipmentList';
import { AddEquipmentForm } from '@/components/AddEquipmentForm';
import { AirbnbContainer } from '@/components/ui/airbnb-container';
import { AirbnbHeader } from '@/components/ui/airbnb-header';
import { useEquipments } from '@/hooks/useEquipments';
import { toast } from 'sonner';

const Equipments = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    afNf: 'all', // Changé de 'status' à 'afNf'
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

  // Enhanced filtering logic avec filtre AF/NF
  const filteredEquipments = useMemo(() => {
    return equipments.filter(equipment => {
      const matchesAfNf = filters.afNf === 'all' || equipment.af_nf === filters.afNf;
      const matchesType = filters.type === 'all' || equipment.type_frigo.toLowerCase().includes(filters.type.toLowerCase());
      const matchesAgency = filters.agency === 'all' || equipment.division === filters.agency;
      const matchesTechnician = filters.technician === 'all' || equipment.technician === filters.technician;
      
      const matchesSearch = filters.search === '' || 
        equipment.serial_number.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.type_frigo.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.branding.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.localisation.toLowerCase().includes(filters.search.toLowerCase()) ||
        equipment.tag_number.toLowerCase().includes(filters.search.toLowerCase());

      // Advanced filters
      const selectedBrands = filters.brands ? filters.brands.split(',').filter(Boolean) : [];
      const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(equipment.branding);

      const selectedTypes = filters.types ? filters.types.split(',').filter(Boolean) : [];
      const matchesTypes = selectedTypes.length === 0 || selectedTypes.includes(equipment.type_frigo);

      const selectedAgencies = filters.agencies ? filters.agencies.split(',').filter(Boolean) : [];
      const matchesAgencies = selectedAgencies.length === 0 || selectedAgencies.includes(equipment.division);

      return matchesAfNf && matchesType && matchesAgency && matchesTechnician && 
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
        icon={Package}
      >
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="hover:bg-blue-50 border-gray-200"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
        
        <AddEquipmentForm onSuccess={refetch} />
      </AirbnbHeader>

      {/* Statistics harmonisées */}
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
    </AirbnbContainer>
  );
};

export default Equipments;
